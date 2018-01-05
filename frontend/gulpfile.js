'use strict';

const color = require('cli-color');
const gulp = require('gulp');
const webpack = require('webpack');
const gulpSequence = require('gulp-sequence');
const del = require('del');
const browserSync = require('browser-sync').create();
const webpackAppConfig = require('./webpack.app.config');
const webpackLibConfig = require('./webpack.lib.config');

// 清除打包目录
gulp.task('clean', () => {
  return del('public/**/*');
});

// 三方库打包
gulp.task('webpack:lib', cb => {
  webpack(webpackLibConfig, webpackCallback(() => cb()));
});

// 业务逻辑打包
let appCallbacked = false;
gulp.task('webpack:app', cb => {
  webpack(webpackAppConfig, webpackCallback((err, stats) => {
    if (!appCallbacked) {
      appCallbacked = true;
      const error = err || (stats.errors && stats.errors[0]);
      cb(error);
    } else {
      console.log(`[${color.cyan('webpack:app')}] done ${color.magenta(`${stats.toJson({ timing: true }).time} ms`)}`);
    }
  }));
});

// 监听 web 同步浏览器
gulp.task('watch', () => {
  browserSync.init({
    port: 7000,
    proxy: 'http://127.0.0.1:7001',
    ui: {
      port: 8888,
    },
  }, () => {
    gulp.watch(['app/web/**/*', 'app/view/**/*'], event => {
      console.log(`[Watch ${color.cyan(event.type)}] ${color.magenta(event.path)}`);
      browserSync.reload();
    });
  });
});

// webpack 任务结果处理
function webpackCallback(cb = () => {}) {
  return (err, stats) => {
    if (err) {
      console.error(err);
    }
    if (stats.compilation.errors.length > 0) {
      console.error(stats.compilation.errors[0]);
    }

    cb(err, stats);
  };
}

gulp.task('dev', gulpSequence('clean', 'webpack:lib', 'webpack:app', 'watch'));
