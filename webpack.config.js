//// Instructions:

//// 1. Please select correctly the static polyfills for your app by editing the file
////    global/static-polyfills.js, as described in its comments.

//// 2. If you want to use dynamic ployfills loading by browser feature detection - set true here,
////    and edit the files global/page-initializer.js and global/dynamic-polyfills.js, as described in their comments.
////    It implements the ideas of this great artice by Philip Walton: https://philipwalton.com/articles/loading-polyfills-only-when-needed/
const useDynamicPolyfills = true;

//// 3. KEEP THE FOLLOWING CONVENTION: Make sure that each html file and its main script file have the same filename (e.g. index.html, index.js),
////    the Webpack configuraton here assumes this to make it easy to build multiple pages app.

//// 4. Select the dev server port - it runs your app with Hot Module Replacement, start it with `npm start`:
const devPort = 4242;

//// 5. run `npm run build` to run the production build (saved in build folder), it includes html files that refer both to smaller 
////    ES6 scripts for modern browsers, and also to normal ES5 scripts for legacy browsers that won't be downloaded by modern browsers,
////    by using the nomodule attribute. Anything is optimized and minimized by Webpack tools.
////    See this another great Philip Walton's article: https://philipwalton.com/articles/deploying-es2015-code-in-production-today/
////
////    To build and use ES5 scripts only, if is is needed for some reason, run `npm run build-es5-only`.
////
////    The polyfills and other global bundles will be shared among all of the pages, so the browser will have to download them only once, 
////    when visiting the first page of your app. On the next pages visits it will get them from its cache.

////    

const webpack = require('webpack');
const path = require('path');
var glob = require("glob")
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');

//definition for all the browsers that should be supported by your app:
const allSupportedBrowsers = [
  '> 0.2%',
  'not dead',
  'ie >= 9'
];

//Modern browsers that support ES6 modules natively, based od on https://github.com/babel/babel/blob/master/packages/babel-preset-env/data/built-in-modules.json
//To test the global usage of those browsers: https://browserl.ist/?q=Chrome%3E%3D61%2C+ChromeAndroid%3E%3D61%2C+Safari%3E%3D11%2C+iOS%3E%3D11%2C+Firefox%3E%3D60%2C+FirefoxAndroid%3E%3D64%2C+Opera%3E%3D48%2C+OperaMobile%3E%3D48%2C+Edge%3E%3D16
//We use Safari 11 to avoid the problems in version 10.1, that old version is almost not in use today.
//That customization requires us not to use targets.esmodules=true, but to provide the browsers manually instead:
const es6Browsers = [
  'Chrome >= 61',
  'Safari >= 11',
  'iOS >= 11',
  'Firefox >= 60',
  'FirefoxAndroid >= 64',
  'Opera >= 48',
  'Edge >= 16',
  'not <= 0.2%',
  'not dead'
];

// Build all the html files in src folder.
let dir = glob.sync('./src/**/*.+(html|js)');
let htmlFiles = dir.filter(f => f.match(/.+\.html$/));
let pages = [];

htmlFiles.forEach(f => {
  let script = f.replace(/\.[^/.]+$/, '.js');
  let scriptExist = dir.find(s => s === script);
  let page = {
    name: path.basename(f, path.extname(f)),
    html: '.' + f.slice('./src'.length),
    script: scriptExist ? '.' + script.slice('./src'.length) : undefined
  };

  pages.push(page);
})

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';
  const isDev = !isProd;
  const isDevServer = !!process.argv.find(v =>
    v.includes('webpack-dev-server')
  );

  const isEs6 = argv.es == 6;
  const willBeAnotherStage = argv.stage == 1;
  const is2ndStage = argv.stage == 2;
  const withSourceMap = typeof argv['source-map'] === "undefined" || !!argv['source-map'];

  const buildFolderName = isDev ? 'build-dev' : 'build';
  const buildPath = path.resolve(__dirname, buildFolderName);
  const srcPath = path.resolve(__dirname, 'src');

  //Public path is the deploy url of the assets, for generating correct links relative to the html page. Can be overriden by loaders.
  //See examples at https://webpack.js.org/configuration/output#outputpublicpath
  //The priorities for production public path are: 1. PUBLIC_PATH environment variable, 2. config section of package.json, 3. / folder.
  let publicPath = isDev ? '/' : (process.env.PUBLIC_PATH || process.env.npm_package_config_public_path || '/').trim();
  if (publicPath && publicPath.substr(-1) !== '/') {
    publicPath += '/';
  }

  const htmlMinifySettings = {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: false,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true
  };

  let config = {
    target: 'web',
    mode: isDev ? 'development' : 'production', //if not set by cli
    //dev mode always uses ES5 polyfills, so it is possible to develop also on legacy browsers
    context: srcPath,
    // the entry point should be for example:
    // { 'index'/'index-es6' : ['./global/static-polyfills', './index.js'], 
    //   'sample'/'sample-es6' : ['./global/static-polyfills', './sample.js']}
    entry: pages.reduce((acc, current) => {
      acc[`${current.name}${willBeAnotherStage ? '-es6' : ''}`] =
        current.script ?
          ['./global/static-polyfills.js', current.script]
          : current.html //if no script - just process the html via html-loader, for images processing and copying to build folder
      return acc;
    }, {}),
    output: {
      path: buildPath,
      filename: isDev ? '[name].[hash:8].js' : '[name].[chunkhash:8].js',
      publicPath: publicPath
    },
    devtool: withSourceMap ? (isDev ? 'eval-source-map' : 'source-map') : false,
    devServer: {
      contentBase: srcPath,
      watchContentBase: true,
      compress: true,
      open: true,
      port: devPort,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    },
    module: {
      rules: [
        {
          test: /static-polyfills\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    modules: false,
                    useBuiltIns: 'entry', //bundle only the needed static polyfills from static-polyfills.js by the targets field
                    corejs: '3.1',
                    targets: {
                      browsers: isEs6 ?
                        //build for modern browsers that support the new ES6 compact syntax natively and the <script type=module / nomodule> tag,
                        //and also they need less polyfills since they support many ES6 features natively:
                        es6Browsers :
                        //build also for legacy browsers that support only normal ES5 syntax, and need more polyfills fot supporting new ES6 features:
                        allSupportedBrowsers
                    }
                  }
                ]
              ]
            }
          }
        },
        {
          test: /\.m?js$/,
          exclude: /([\\/]node_modules[\\/]|static-polyfills\.js$)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    modules: false,
                    useBuiltIns: 'usage', //the needed polyfills will be inferred from their use in the code itself
                    corejs: '3.1',
                    targets: {
                      browsers: isEs6 ? es6Browsers : allSupportedBrowsers
                    }
                  }
                ]
              ],
              plugins: ['@babel/plugin-syntax-dynamic-import']
            }
          }
        },
        {
          test: /\.(s?css|sass)$/,
          exclude: /\.useable\.(s?css|sass)$/,
          use: !willBeAnotherStage ? [
            {
              loader: isProd ? MiniCssExtractPlugin.loader : 'style-loader',
              options: { hmr: isDev, sourceMap: withSourceMap }
            },
            {
              loader: 'css-loader',
              options: { importLoaders: 1, sourceMap: withSourceMap }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: withSourceMap,
                ident: 'postcss',
                plugins: (loader) => [require('postcss-cssnext')(), require('cssnano')()]
              }
            },
            'sass-loader'
          ] : 'ignore-loader'
        },
        {
          test: /\.useable\.(s?css|sass)$/,
          use: [
            {
              loader: 'style-loader/useable',
              options: { hmr: isDev, sourceMap: withSourceMap }
            },
            {
              loader: 'css-loader',
              options: { importLoaders: 1, sourceMap: withSourceMap }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: withSourceMap,
                ident: 'postcss',
                plugins: (loader) => [require('postcss-cssnext')(), require('cssnano')()]
              },
            },
            'sass-loader'
          ]
        },
        {
          test: /images[\\/]url[\\/].+$/i,
          use: [
            {
              loader: 'url-loader'
            }
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/i,
          exclude: /([\\/]fonts[\\/].+\.svg|images[\\/]url[\\/].+)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'images/[name].[hash:8].[ext]'
              }
            }
          ]
        },
        {
          test: /(\.(ttf|eot|woff2?)|([\\/]fonts[\\/].+\.svg))$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'fonts/[name].[ext]'
              }
            }
          ]
        },
        {
          test: /.html$/,
          exclude: /\.temp\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: {
                minimize: false,
                interpolate: true
              }
            }
          ]
        }
      ]
    },
    watch: isDevServer,
    watchOptions: {
      aggregateTimeout: 300,
      //poll: 1000, //uncomment if necessary for better HMR file change detection
      ignored: /node_modules/
    },
    optimization: {
      runtimeChunk: pages.filter(p => !!p.script).length > 1 ?
        {
          name: `runtime${isEs6 ? '-es6' : ''}`
        }
        : false,
      splitChunks: {
        maxInitialRequests: 4, //static-polyfills, initial-vendors, initial-common, entry point itself
        cacheGroups: {
          'static-polyfills': {
            chunks: 'initial',
            priority: 100,
            test: (module) => {
              let name = module.resource;
              if (module && module.resource && module.resource.match(/[\\/]node_modules[\\/]core-js/)) {
                console.log(name);
                return true;
              }
              while (module) {
                if (module.resource && module.resource.endsWith('static-polyfills.js')) {
                  console.log(name);
                  return true;
                }
                module = module.issuer;
              }
              return false;
            },
            name: willBeAnotherStage ? 'polyfills-es6' : 'polyfills'
          },
          'initial-vendors': { //by default webpack will create also a vendors chunk only for async chunks, if needed
            chunks: 'initial',
            priority: 90,
            name: willBeAnotherStage ? 'vendors-es6' : 'vendors',
            test: /[\\/]node_modules[\\/]/
          },
          'initial-common': {
            chunks: 'initial',
            minChunks: 2,
            priority: 80,
            reuseExistingChunk: true,
            name: willBeAnotherStage ? 'common-es6' : 'common',
          }
        }
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        'USE_DYNAMIC_POLYFILLS': JSON.stringify(useDynamicPolyfills)
      }),
      !isDevServer && !is2ndStage && new CleanWebpackPlugin(buildPath, {}),
      isProd && !willBeAnotherStage && new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].css'
      }),
      ...pages.map(p => new HtmlWebpackPlugin({
        hash: isDev,
        minify: isProd && !willBeAnotherStage ? htmlMinifySettings : false,
        favicon: !is2ndStage ? 'favicon.ico' : '',
        chunksSortMode: 'dependency',
        template: is2ndStage ? `${buildPath}/${p.name}.temp.html` : `${p.html}`,
        filename: willBeAnotherStage ? `${p.name}.temp.html` : `${p.html}`,
        //inject: !!p.script, //should be, but not injecting favicon if no script
        //chunks: [...]
        //workaround for the problem of not injecting favicon if inject is false:
        inject: true,
        chunks: p.script ? ['runtime', 'runtime-es6', 'polyfills', 'polyfills-es6', 'vendors', 'vendors-es6', 'common', 'common-es6', p.name, `${p.name}-es6`] : []
      })),
      isEs6 && new ScriptExtHtmlWebpackPlugin({
        module: /\.m?js$/
      }),
      is2ndStage && !isEs6 && new ScriptExtHtmlWebpackPlugin({
        custom: {
          test: /\.js$/,
          attribute: 'nomodule',
        }
      }),
      isDev && new StyleLintPlugin({
        configFile: './stylelint.config.js',
        files: './style/*.scss',
        syntax: 'scss'
      }),
      !willBeAnotherStage && new FileManagerPlugin({
        onEnd: {
          delete: //delete temp html files that were generated in the es6 building stage (first stage):
            [`${buildPath}/*.temp.html`]
              //and also unused default script bundles, that were built for html files that don't have a script anyway:
              .concat(pages.filter(p => !p.script).map(p => `${buildPath}/${p.name}*.js*`))
        }
      })
    ].filter(Boolean) //removes all non-truthy values
  };

  return config;
};
