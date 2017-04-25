const { join } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM();

module.exports = {
  context: __dirname,
  entry  : {
    main: './src/app.js'
  },
  output : {
    path         : join(__dirname, 'dist'),
    filename     : '[name].bundle.js',
    chunkFilename: '[id]_chunk.js',
    libraryTarget: 'umd'
  },
  module : {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.(scss|sass)$/, loaders: ['style-loader', 'css-loader', 'sass-loader'] },
      { test: /\.(png|jpg|jpeg|gif)$/, loader: 'url-loader?limit=8192' },
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({m: 'mithril'}),
    new HtmlWebpackPlugin({
      title: 'MyTitle'
    }),
    new StaticSiteGeneratorPlugin({
      entry: 'main',
      paths: [
        '/hello/',
        '/world/'
      ],
      locals: {
        greet: 'Hello'
      },
      globals: {
        window: dom.window,
        document: dom.document,
      },
    })

  ],
  devServer: {
    historyApiFallback: true
  }
};
