'use strict';

const path = require('path');
const onerror = require('../common/onerror');

module.exports = appInfo => {
  console.log(appInfo);
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1514368681876_840';

  exports.logger = {
    consoleLevel: 'DEBUG',
    dir: path.join(appInfo.baseDir, 'logs'),
  };

  // add your config here
  config.middleware = [ 'gzip', 'notfoundHandler', 'errorHandler', 'access' ];
  config.gzip = {
    threshold: 1024,
  };

  config.bodyParser = {
    jsonLimit: '10mb',
    formLimit: '10mb',
  };

  config.session = {
    key: 'SKYLOR_MIN_SESS', // 承载 Session 的 Cookie 键值对名字
    maxAge: 86400000 * 30, // Session 的最大有效时间
  };

  config.passportGithub = {
    key: '297650509085816168ed',
    secret: '83a8ddfe3ee68751dcabaab0fd89b082d84eef37',
  };

  config.onerror = onerror;

  config.mysql = {
    client: {
      host: 'localhost',
      port: '3306',
      user: 'skylor',
      password: '123456',
      database: 'blog',
    },
    app: true,
    agent: false,
  };

  config.static = {
    prefix: '/',
    dir: path.join(appInfo.baseDir, 'public'),
    dynamic: true,
    preload: true,
    buffer: false,
    maxFiles: 1000,
  };

  config.view = {
    root: [
      path.join(appInfo.baseDir, 'frontend/view'),
      path.join(appInfo.baseDir, 'public'),
    ].join(','),
    mapping: {
      '.ejs': 'ejs',
      '.html': 'ejs',
    },
  };

  return config;
};
