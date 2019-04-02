// webpack v4
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const legacyBrowsers = [
  '>0.2%',
  'not dead',
  'not op_mini all',
  'Firefox ESR',
  'ie >= 9'
];

const modernBrowsers = [
  'Chrome >= 61',
  'ChromeAndroid >= 61',
  'Safari >= 11',
  'iOS >= 11',
  'Firefox >= 60',
  'FirefoxAndroid >= 60',
  'Opera >= 48',
  'OperaMobile >= 48',
  'Edge >= 16'
];

module.exports = (env, argv) => {
  const isDev = argv.mode !== 'production';
  const isDevServer = !!process.argv.find(v =>
    v.includes('webpack-dev-server')
  );
  const isLegacyStage = argv.stage === 'legacy';
  const buildFolderName = isDev ? 'build-dev' : 'build';
  const buildPath = path.resolve(__dirname, buildFolderName);

  let config = {
    mode: isDev ? 'development' : 'production', //if not set by cli
    //dev mode uses always legacy es5 polyfills, so it is possible to develop also on legacy browsers
    entry: isDev
      ? { 'main-es5': './src/index.js' }
      : { main: './src/index.js' },
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
                    useBuiltIns: 'entry',
                    corejs: 3,
                    targets: {
                      browsers: isDev ? legacyBrowsers : modernBrowsers
                    }
                  }
                ]
              ],
              plugins: [
                ['@babel/plugin-transform-runtime', { corejs: 3 }],
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
          polyfills: {
            chunks: 'all',
            enforce: true,
            priority: 100,
            test: /node_modules[\\/](@babel|core-js)/,
            name: isDev || isLegacyStage ? 'polyfills-es5' : 'polyfills'
          },
          vendors: {
            chunks: 'all',
            enforce: true,
            priority: 90,
            test: /node_modules/,
            name: isDev || isLegacyStage ? 'vendors-es5' : 'vendors'
          }
        }
      }
    },
    plugins: [
      !isDevServer && new CleanWebpackPlugin(buildPath, {}),
      !isDev &&
        new MiniCssExtractPlugin({
          filename: 'style.[contenthash:8].css'
        }),
      !isDev && new OptimizeCSSAssetsPlugin({}),
      new HtmlWebpackPlugin({
        isDev: isDev,
        inject: false,
        hash: isDev,
        minify: {},
        chunksSortMode: 'dependency',
        template: './src/index.html',
        filename: isDev ? 'index.html' : 'temp.html'
      }),
      isDev &&
        new StyleLintPlugin({
          configFile: './stylelint.config.js',
          files: './src/scss/*.scss',
          syntax: 'scss'
        })
    ].filter(Boolean) //removes all non-truthy values
  };

  if (!isLegacyStage) {
    return config;
  }

  //legacyConfig used only for production build, for building the bigger bundles just for legacy browsers
  let legacyConfig = Object.assign({}, config);

  legacyConfig.entry = { 'main-es5': './src/index.js' };
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
              corejs: 3,
              targets: {
                browsers: legacyBrowsers
              }
            }
          ]
        ],
        plugins: [
          ['@babel/plugin-transform-runtime', { corejs: 3 }],
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
      chunksSortMode: 'dependency',
      template: `${buildFolderName}/temp.html`,
      filename: 'index.html'
    })
  ];

  return legacyConfig;
};
