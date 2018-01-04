'use strict';

// had enabled by egg
exports.static = true;

exports.validate = {
  enable: true,
  package: 'egg-validate',
};

exports.passport = {
  enable: true,
  package: 'egg-passport',
};

exports.passportGithub = {
  enable: true,
  package: 'egg-passport-github',
};

exports.mysql = {
  enable: true,
  package: 'egg-mysql',
};

exports.ejs = {
  enable: true,
  package: 'egg-view-ejs',
};
