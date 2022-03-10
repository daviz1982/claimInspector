const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (_, argv) => {
  const isDevelopment = argv.mode !== 'production';

  return {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'build'),
      clean: true,
    },
    devServer: {
      port: 5050,
      hot: true,
    },
    devtool: isDevelopment ? 'eval-source-map' : 'source-map',
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              compact: !isDevelopment,
            },
          },
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader'
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                // options...
              }
            }
          ]
        }
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: './index.html' }), //
      new MiniCssExtractPlugin({ filename: 'css/style.css' }),
    ],
    performance: {
      hints: isDevelopment ? 'warning' : 'error',
    },
  };
};
