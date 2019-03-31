// webpack v4
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const WebpackMd5Hash = require('webpack-md5-hash');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const DelayPlugin = require('webpack-delay-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  const isDevServer = !!process.argv.find(v =>
    v.includes('webpack-dev-server')
  );
  const buildFolderName = isDev ? 'build-dev' : 'build';
  const buildPath = path.resolve(__dirname, buildFolderName);

  let config = {
    entry: { main: './src/index.js' },
    output: {
      path: buildPath,
      filename: isDev ? '[name].[hash].js' : '[name].[chunkhash].js'
    },
    devtool: isDev ? 'eval-source-map' : 'source-map',
    devServer: {
      contentBase: path.join(__dirname, 'src'),
      watchContentBase: true,
      compress: true,
      open: true,
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
                    useBuiltIns: 'entry',
                    corejs: 2,
                    targets: {
                      browsers: isDev
                        ? [
                            '>0.2%',
                            'not dead',
                            'not ie <= 8',
                            'not op_mini all'
                          ]
                        : [
                            'last 2 Chrome versions',
                            'not Chrome < 60',
                            'last 2 Safari versions',
                            'not Safari < 10.1',
                            'last 2 iOS versions',
                            'not iOS < 10.3',
                            'last 2 Firefox versions',
                            'not Firefox < 54',
                            'last 2 Edge versions',
                            'not Edge < 15'
                          ]
                    }
                  }
                ]
              ],
              plugins: [
                '@babel/plugin-transform-runtime',
                '@babel/plugin-syntax-dynamic-import'
              ]
            }
          }
        },
        {
          test: /\.scss$/,
          exclude: /\.useable\.scss$/,
          use: [
            {
              loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
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
                name: 'img/[name].[hash].[ext]'
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
    plugins: [
      !isDevServer && new CleanWebpackPlugin(buildPath, {}),
      !isDev &&
        new MiniCssExtractPlugin({
          filename: 'style.[contenthash].css'
        }),
      !isDev && new OptimizeCSSAssetsPlugin({}),
      new HtmlWebpackPlugin({
        isDev: isDev,
        inject: false,
        hash: isDev,
        minify: {},
        template: './src/index.html',
        filename: isDev ? 'index.html' : 'temp.html'
      }),
      // new WebpackMd5Hash(),
      isDev &&
        new StyleLintPlugin({
          configFile: './stylelint.config.js',
          files: './src/scss/*.scss',
          syntax: 'scss'
        })
    ].filter(Boolean) //removes all non-truthy values
  };

  //legacyConfig used only for production build, for building the bigger bundles just for legacy browsers
  let legacyConfig = Object.assign({}, config);

  legacyConfig.entry = { mainLegacy: './src/index.js' };
  legacyConfig.watch = false;

  legacyConfig.module = {
    rules: config.module.rules.slice()
  };

  legacyConfig.module.rules[0] = {
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
              useBuiltIns: 'entry',
              corejs: 2,
              targets: {
                browsers: [
                  '>0.2%',
                  'not dead',
                  'not ie <= 8',
                  'not op_mini all'
                ]
              }
            }
          ]
        ],
        plugins: [
          '@babel/plugin-transform-runtime',
          '@babel/plugin-syntax-dynamic-import'
        ]
      }
    }
  };

  legacyConfig.module.rules[1] = {
    test: /\.scss$/,
    exclude: /\.useable\.scss$/,
    use: [
      {
        loader: 'ignore-loader',
        options: { hmr: false, sourceMap: true }
      },
      {
        loader: 'css-loader',
        options: { modules: true, importLoaders: 1 }
      },
      'postcss-loader',
      'sass-loader'
    ]
  };

  legacyConfig.plugins = [
    new DelayPlugin({
      delay: 5000 // delay in ms
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: false,
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      },
      template: `${buildFolderName}/temp.html`,
      filename: 'index.html'
    })
  ];

  return isDev ? config : [config, legacyConfig];
};
