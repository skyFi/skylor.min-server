'use strict';

const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const appVersion = require('./package').version;

module.exports = {
  entry: {
    lib: [
      'react',
    ],
  },
  output: {
    path: path.resolve(__dirname, 'app/public'),
    filename: `[name].${appVersion}.js`,
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
    new webpack.DllPlugin({
      context: __dirname,
      name: '[name]',
      path: path.join(__dirname, 'manifest.json'),
    }),
    new HappyPack({
      id: 'js',
      loaders: [ 'babel-loader' ],
    }),
    new UglifyJsPlugin({
      cache: true,
    }),
  ],
};
