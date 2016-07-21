const path = require('path');

module.exports = {
  entry: {
    app: './src/app/main.js',
    decodeImage: './src/workers/decodeImage.js',
    resizeImage: './src/workers/resizeImage.js',
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
