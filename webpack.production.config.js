const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  devtool: '#source-map',

  entry: {
    app: './src/app/main.js',
  },

  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name]-[chunkhash].js',
  },

  resolve: {
    root: path.resolve(__dirname, 'src/app'),
  },

  node: {
    fs: 'empty',
  },

  module: {
    loaders: [
      {
        exclude: /node_modules/,
        test: /\.js$/,
        loader: 'babel',
      },

      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css'),
      },

      {
        test: /\.json$/,
        loader: 'json',
      },

      {
        include: path.resolve(__dirname, 'src/app/assets/fonts'),
        test: /\.woff$/,
        loader: 'url?limit=5000',
      },
    ],

    postLoaders: [
      {
        include: path.resolve(__dirname, 'node_modules/pica'),
        loader: 'transform?brfs',
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
      '__DEV__': false,
    }),

    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
    }),

    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.html$|\.css$/,
      threshold: 10240,
      minRatio: 0.8,
    }),

    new ExtractTextPlugin('main-[chunkhash].css'),

    new HtmlWebpackPlugin({
      template: 'production.ejs',
      filename: 'index.html',
    }),
  ],
};
