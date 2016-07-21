const path = require('path');

module.exports = {
  devtool: '#cheap-eval-source-map',
  // devtool: '#inline-source-map',

  entry: {
    app: './src/app/main.js',
    decodeImage: './src/workers/decodeImage.js',
    resizeImage: './src/workers/resizeImage.js',
    dataURL: './src/workers/dataURL.js',
    computePhotomosaicDiff: './src/workers/computePhotomosaicDiff.js',
    computePhotomosaic: './src/workers/computePhotomosaic.js',
  },

  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].bundle.js',
  },

  node: {
    fs: 'empty',
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      },

      {
        test: /\.css$/,
        loader: 'style!css',
      },

      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
  },
};
