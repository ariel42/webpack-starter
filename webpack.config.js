// webpack v4
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  const isDevServer = !!process.argv.find(v =>
    v.includes('webpack-dev-server')
  );
  const buildPath = path.resolve(__dirname, isDev ? 'build-dev' : 'build');

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
      open: true
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    modules: false,
                    useBuiltIns: 'entry'
                  }
                ]
              ],
              plugins: [
                '@babel/plugin-syntax-dynamic-import',
                [
                  '@babel/plugin-transform-runtime',
                  {
                    regenerator: true
                  }
                ]
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
        inject: false,
        hash: isDev,
        minify: isDev
          ? {}
          : {
              collapseWhitespace: true,
              removeComments: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true,
              useShortDoctype: true
            },
        template: './src/index.html',
        filename: 'index.html'
      }),
      new WebpackMd5Hash(),
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
