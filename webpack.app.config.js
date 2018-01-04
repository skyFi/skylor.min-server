'use strict';

const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const color = require('cli-color');
const VersionWebpackPlugin = require('./webpack.version.plugin');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'app/web/index.js'),
  },
  watch: !process.env.EGG_SERVER_ENV || process.env.EGG_SERVER_ENV === 'develop' || process.env.EGG_SERVER_ENV === 'dev' || process.env.EGG_SERVER_ENV === 'development',
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /(node_modules|bower_components|public)/,
  },
  output: {
    path: path.resolve(__dirname, 'app/public'),
    filename: '[name].[version].js',
    library: '[name]',
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
          loader: 'happypack/loader',
          options: {
            id: 'js',
          },
        }] },
    ],
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./manifest.json'),
    }),
    new VersionWebpackPlugin({
      cb: version => {
        process.env.APP_VERSION = version;
        console.log(`${color.cyan('当前编译版本号为：')}${color.magenta(process.env.APP_VERSION)}`);
      },
    }),
    new HappyPack({
      id: 'js',
      loaders: [ 'babel-loader' ],
    }),
    new UglifyJsPlugin({
      cache: true,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"',
    }),
  ],
};
