'use strict';

const color = require('cli-color');
const gulp = require('gulp');
const webpack = require('webpack');
const gulpSequence = require('gulp-sequence');
const del = require('del');
const merge = require('merge-stream');
const changed = require('gulp-changed');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const file = require('gulp-file');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const iconPlugin = require('./icon-plugin');
const config = require('./src/core/common/config');
const webpackAppConfig = require('./webpack.app.config');
const webpackLibConfig = require('./webpack.lib.config');

// 清除打包目录
gulp.task('clean', () => {
  return del('public/**/*');
});

// 复制文件
gulp.task('copy', () => {
  return merge(
    // 复制图片
    gulp.src('src/core/asset/img/**/*')
      .pipe(changed('public/images'))
      .pipe(gulp.dest('public/images')),

    // 复制图标
    gulp.src('src/core/asset/img/favicon.ico')
      .pipe(changed('public'))
      .pipe(gulp.dest('public')),

    // 复制第三方包
    gulp.src('src/core/vendor/**/*')
      .pipe(changed('public'))
      .pipe(gulp.dest('public')),

    // 压缩单个JS文件
    gulp.src('src/core/vendor/**/*.js')
      .pipe(babel())
      .pipe(uglify())
      .pipe(changed('public'))
      .pipe(gulp.dest('public')),

    // 写入less配置
    gulp.src('src/core/page/style/common/config.less')
      .pipe(file('config.less', `@cdn: '${config.cdn || ''}';`))
      .pipe(gulp.dest('src/core/page/style/common')),

    // 生成SVG
    gulp.src('src/core/asset/svg/**/*.svg')
      .pipe(iconPlugin())
      .pipe(rename((path) => {
        path.extname = '.js';
      }))
      .pipe(gulp.dest('src/core/page/icon'))
  );
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
    gulp.watch(['app/frontend/core/**/*', 'app/frontend/page/**/*', 'app/frontend/view/**/*'], event => {
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

gulp.task('dev', gulpSequence('clean', 'copy', 'webpack:lib', 'webpack:app', 'watch'));
