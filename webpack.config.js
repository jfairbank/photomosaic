const path = require('path');

module.exports = {
  entry: {
    app: './src/app/main.js',
    mainImageUploader: './src/workers/mainImageUploader.js',
  },

  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].bundle.js',
  },

  module: {
    loaders: [
      {
        test: /.*\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      },

      {
        test: /\.*\.css$/,
        loader: 'style!css',
      },
    ],
  },
};
