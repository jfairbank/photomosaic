const path = require('path');

module.exports = {
  devtool: '#cheap-eval-source-map',

  entry: {
    app: './src/app/main.js',
  },

  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].bundle.js',
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
        loader: 'style!css',
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
};
