const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

//definition for all the browsers that should be supported by your app:
const allSupportedBrowsers = [
  '>0.2%',
  'not dead',
  'not op_mini all',
  'Firefox ESR',
  'ie >= 9'
];

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';
  const isDev = !isProd;
  const isDevServer = !!process.argv.find(v =>
    v.includes('webpack-dev-server')
  );

  const isEs6 = argv.es == 6;
  const willBe2ndStage = argv.stage == 1;
  const is2ndStage = argv.stage == 2;

  const buildFolderName = isDev ? 'build-dev' : 'build';
  const buildPath = path.resolve(__dirname, buildFolderName);

  const htmlMinifySettings = {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: false,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true
  };

  let config = {
    mode: isDev ? 'development' : 'production', //if not set by cli
    //dev mode always uses ES5 polyfills, so it is possible to develop also on legacy browsers
    entry: isEs6
      ? { main: './src/index.js' }
      : //// Select one of the following and comment the other option:
        ////
        //// If in your app, you BOTH USE dynamic import(), that requires Promise, AND ALSO DON'T HAVE any other use of Promise:
        { 'main-es5': ['core-js/modules/es.promise', 'core-js/modules/es.array.iterator', './src/index.js'] },
        ////
        //// Otherwise:
        // { 'main-es5': './src/index.js' },
    ////
    //// Also select correctly one of 3 options inside src/static-polyfills.js.
    output: {
      path: buildPath,
      filename: isDev ? '[name].[hash:8].js' : '[name].[chunkhash:8].js'
    },
    devtool: isDev ? 'eval-source-map' : 'source-map',
    devServer: {
      contentBase: path.join(__dirname, 'src'),
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
                    targets: isEs6
                      ? {
                          //build for modern browsers that support the new ES6 compact syntax and the <script type=module / nomodule> tag,
                          //and also they need less polyfills since they support many ES6 features natively:
                          esmodules: true
                        }
                      : {
                          //build also for legacy browsers that support only normal ES5 syntax,
                          //and need more polyfills fot supporting new ES6 features:
                          esmodules: false,
                          browsers: allSupportedBrowsers
                        }
                  }
                ]
              ],
              plugins: ['@babel/plugin-syntax-dynamic-import']
            }
          }
        },
        {
          test: /\.scss$/,
          exclude: /\.useable\.scss$/,
          use: [
            {
              loader: isProd ? MiniCssExtractPlugin.loader : 'style-loader',
              options: { hmr: isDev, sourceMap: true }
            },
            {
              loader: 'css-loader',
              options: { modules: true, importLoaders: 1 }
            },
            'postcss-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.useable\.scss$/,
          use: [
            {
              loader: 'style-loader/useable',
              options: { hmr: isDev, sourceMap: true }
            },
            {
              loader: 'css-loader',
              options: { modules: true, importLoaders: 1 }
            },
            'postcss-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'img/[name].[hash:8].[ext]'
              }
            }
          ]
        },
        {
          test: /\.(ttf|eot|woff2?)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'fonts/[name].[ext]'
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
      splitChunks: {
        cacheGroups: {
          'dynamic-polyfills': {
            chunks: 'async',
            enforce: true,
            priority: 100,
            test: /(node_modules[\\/](@babel|core-js|whatwg))|(src[\\/]dynamic-polyfills)/,
            name: isEs6 ? 'dynamic-polyfills' : 'dynamic-polyfills-es5'
          },
          'static-polyfills': {
            chunks: 'initial',
            enforce: true,
            priority: 90,
            test: /(node_modules[\\/](@babel|core-js|whatwg|regenerator))|(src[\\/]static-polyfills)/,
            name: isEs6 ? 'polyfills' : 'polyfills-es5'
          },
          vendors: {
            chunks: 'all',
            enforce: true,
            priority: 80,
            test: /node_modules/,
            name: isEs6 ? 'vendors' : 'vendors-es5'
          }
        }
      }
    },
    plugins: [
      isProd && !is2ndStage && new CleanWebpackPlugin(buildPath, {}),
      isProd &&
        new MiniCssExtractPlugin({
          filename: 'style.[contenthash:8].css'
        }),
      isProd && !is2ndStage && new OptimizeCSSAssetsPlugin({}),
      !is2ndStage
        ? //first stage (maybe single)
          new HtmlWebpackPlugin({
            isProd: isProd,
            isEs6: isEs6,
            willBe2ndStage: willBe2ndStage,
            inject: false,
            hash: isDev,
            minify: isProd && !willBe2ndStage ? htmlMinifySettings : {},
            chunksSortMode: 'dependency',
            template: './src/index.html',
            filename: willBe2ndStage ? 'temp.html' : 'index.html'
          })
        : //2nd stage - transfers temp.html to index.html, with production ES5 bundles
          new HtmlWebpackPlugin({
            inject: false,
            hash: false,
            minify: htmlMinifySettings,
            chunksSortMode: 'dependency',
            template: `${buildFolderName}/temp.html`,
            filename: 'index.html'
          }),
      isDev &&
        new StyleLintPlugin({
          configFile: './stylelint.config.js',
          files: './src/scss/*.scss',
          syntax: 'scss'
        })
    ].filter(Boolean) //removes all non-truthy values
  };

  return config;
};
