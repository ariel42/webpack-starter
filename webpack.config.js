//// If in your app, you BOTH USE dynamic import(), that requires Promise, 
//// AND ALSO DON'T HAVE any other use of Promise - set true here, otherwise set false:
const promiseUsedOnlyForDynamicImport = false;
//// Also select correctly one of the 3 options inside src/static-polyfills.js.

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

//definition for all the browsers that should be supported by your app:
const allSupportedBrowsers = [
  '>0.2%',
  'not dead',
  'not op_mini all',
  'Firefox ESR',
  'ie >= 9'
];

//Modern browsers that support ES6 modules natively, based od on https://github.com/babel/babel/blob/master/packages/babel-preset-env/data/built-in-modules.json
//To test the global usage of those browsers: https://browserl.ist/?q=Chrome%3E%3D61%2C+ChromeAndroid%3E%3D61%2C+Safari%3E%3D11%2C+iOS%3E%3D11%2C+Firefox%3E%3D60%2C+FirefoxAndroid%3E%3D64%2C+Opera%3E%3D48%2C+OperaMobile%3E%3D48%2C+Edge%3E%3D16
//We use Safari 11 to avoid the problems in version 10.1, that old version is almost not in use today.
//For this customization we don't use targets.esmodules=true, but provide the browsers manually:
const es6Browsers = [
  'Chrome >= 61',
  'Safari >= 11',
  'iOS >= 11',
  'Firefox >= 60',
  'FirefoxAndroid >= 64',
  'Opera >= 48',
  'Edge >= 16'
];

let pages = [
  { name: 'index', html: './index.html', script: './index.js' },
  { name: 'sample', html: './sample.html', script: './sample.js' }
]

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';
  const isDev = !isProd;
  const isDevServer = !!process.argv.find(v =>
    v.includes('webpack-dev-server')
  );

  const isEs6 = argv.es == 6;
  const willBeAnotherStage = argv.stage == 1;
  const is2ndStage = argv.stage == 2;

  const buildFolderName = isDev ? 'build-dev' : 'build';
  const buildPath = path.resolve(__dirname, buildFolderName);
  const srcPath = path.resolve(__dirname, 'src');

  const htmlMinifySettings = {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: false,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true
  };

  const es5PolyfillsForDynamicImport = ['core-js/modules/es.promise', 'core-js/modules/es.array.iterator'];

  let config = {
    mode: isDev ? 'development' : 'production', //if not set by cli
    //dev mode always uses ES5 polyfills, so it is possible to develop also on legacy browsers
    context: srcPath,
    // the entry point should be for example { 'index-es6': './index.js', 'sample-es6': './sample.js' } for es6,
    // or { 'index' : ['core-js/modules/es.promise', 'core-js/modules/es.array.iterator', './index.js'], 
    //      'sample': ['core-js/modules/es.promise', 'core-js/modules/es.array.iterator', './sample.js']} for es5
    entry: pages.reduce((acc, current) => {
      acc[`${current.name}${willBeAnotherStage ? '-es6' : ''}`] =
        !isEs6 && promiseUsedOnlyForDynamicImport ?
          [...es5PolyfillsForDynamicImport, current.script] :
          current.script;
      return acc;
    }, {}),
    output: {
      path: buildPath,
      filename: isDev ? '[name].[hash:8].js' : '[name].[chunkhash:8].js',
      //Default deploy url of assets, for generating correct links relative to the html page. Can be overriden by loaders.
      //See examples at https://webpack.js.org/configuration/output#outputpublicpath
      publicPath: isDevServer ? '' : ''  // '' means the same folder of the html, leave it for dev server
    },
    devtool: isDev ? 'eval-source-map' : 'source-map',
    devServer: {
      contentBase: srcPath,
      watchContentBase: true,
      compress: true,
      open: true,
      port: 4242,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    modules: false,
                    useBuiltIns: 'entry', //bundle only the needed static polyfills (from src/static-polyfills.js) by the targets field
                    corejs: 3,
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
              options: { hmr: isDev, sourceMap: true }
            },
            {
              loader: 'css-loader',
              options: { importLoaders: 1, sourceMap: true }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
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
              options: { hmr: isDev, sourceMap: true }
            },
            {
              loader: 'css-loader',
              options: { importLoaders: 1, sourceMap: true }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                ident: 'postcss',
                plugins: (loader) => [require('postcss-cssnext')(), require('cssnano')()]
              },
            },
            'sass-loader'
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/i,
          exclude: /[\\/]fonts[\\/].+\.svg$/i,
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
          use: !isDevServer ? [
            {
              loader: 'html-loader',
              options: {
                minimize: false
              }
            }
          ] : 'raw-loader'
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
      splitChunks: {
        cacheGroups: {
          'dynamic-polyfills': {
            chunks: 'async',
            enforce: true,
            priority: 100,
            test: /(node_modules[\\/](@babel|core-js|whatwg))|(src[\\/]dynamic-polyfills)/,
            name: willBeAnotherStage ? 'dynamic-polyfills-es6' : 'dynamic-polyfills'
          },
          'static-polyfills': {
            chunks: 'initial',
            enforce: true,
            priority: 90,
            test: /node_modules[\\/](@babel|core-js|whatwg|regenerator)/,
            name: willBeAnotherStage ? 'polyfills-es6' : 'polyfills'
          },
          vendors: {
            chunks: 'all',
            enforce: true,
            priority: 80,
            test: /node_modules/,
            name: willBeAnotherStage ? 'vendors-es6' : 'vendors'
          }
        }
      }
    },
    plugins: [
      !isDevServer && !is2ndStage && new CleanWebpackPlugin(buildPath, {}),
      isProd && !willBeAnotherStage && new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].css'
      }),
      ...pages.map(p => new HtmlWebpackPlugin({
        inject: true,
        hash: isDev,
        minify: isProd && !willBeAnotherStage ? htmlMinifySettings : false,
        favicon: !is2ndStage ? 'favicon.ico' : '',
        chunksSortMode: 'dependency',
        template: is2ndStage ? `${buildPath}/${p.name}.temp.html` : `${p.html}`,
        filename: willBeAnotherStage ? `${p.name}.temp.html` : `${p.name}.html`,
        chunks: ['dynamic-polyfills', 'dynamic-polyfills-es6', 'polyfills', 'polyfills-es6', 'vendors', 'vendors-es6', p.name, `${p.name}-es6`]
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
      })
    ].filter(Boolean) //removes all non-truthy values
  };

  return config;
};
