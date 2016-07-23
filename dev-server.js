const path = require('path');
const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const webpackConfig = require('./webpack.development.config');

const HOST = '127.0.0.1';
const PORT = 8080;
const BASE_URL = `http://${HOST}:${PORT}`;

webpackConfig.entry.app = [
  `webpack-dev-server/client?${BASE_URL}`,
  'webpack/hot/dev-server',
  webpackConfig.entry.app,
];

webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

webpackConfig.output.publicPath = `${BASE_URL}/assets`;

const compiler = webpack(webpackConfig);

const server = new WebpackDevServer(compiler, {
  contentBase: path.join(__dirname, 'public'),
  publicPath: '/assets',
  hot: true,
});

server.listen(PORT, HOST, () => {});
