'use strict';

const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const color = require('cli-color');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const VersionWebpackPlugin = require('./webpack.version.plugin');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/page/index.js'),
  },
  watch: !process.env.EGG_SERVER_ENV || process.env.EGG_SERVER_ENV === 'develop' || process.env.EGG_SERVER_ENV === 'dev' || process.env.EGG_SERVER_ENV === 'development',
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /(node_modules|bower_components|public)/,
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].[hash].js',
    chunkFilename: '[name].[chunkhash:6].chunk.js',
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
        }]
      }, {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'raw-loader',
              options: {
                minimize: true,
              }
            },
            'postcss-loader',
            'less-loader',
          ],
          fallback: 'style-loader',
        }),
      }, {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'raw-loader',
              options: {
                minimize: true,
              }
            },
            {
              loader: 'postcss-loader',
            },
          ],
          fallback: 'style-loader',
        })
      }, {
        test: /\.(jpg|png)$/,
        use: ['url-loader'],
      }, {
        test: /\.yml$/,
        use: ['json-loader', 'yaml-loader']
      }, {
        test: /\.svg/,
        use: ['svg-loader']
      }
    ],
  },
  node: {
    fs: 'empty'
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./manifest.json'),
    }),
    new ExtractTextPlugin('app.[hash].css'),
    new VersionWebpackPlugin({
      cb: hash => {
        console.log(`${color.cyan('当前编译hash为：')}${color.magenta(hash)}`);
      },
    }),
    new HappyPack({
      id: 'js',
      loaders: ['babel-loader'],
    }),
    new UglifyJsPlugin({
      cache: true,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"',
    }),
  ],
};
