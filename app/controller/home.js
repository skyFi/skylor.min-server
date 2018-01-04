'use strict';

const Controller = require('egg').Controller;
const appVersion = require('../../package.json').version;
const reload = requiredModulePath => {
  const resolved = require.resolve(requiredModulePath);
  const cache = require.cache[resolved];
  delete require.cache[resolved];
  try {
    return require(requiredModulePath);
  } catch (err) {
    console.error('Error occurred while reloading module, rollback to cached one.\n =>', err.stack || err);
    require.cache[resolved] = cache || (() => {});
    return require(requiredModulePath);
  }
};

class HomeController extends Controller {
  async index() {
    const jsVersion = reload('../../version.json').version;
    console.log(jsVersion);
    await this.ctx.render('index.ejs', {
      appName: 'hi skylor',
      version: jsVersion,
      appVersion,
    });
    // this.ctx.body = 'hi skylor';
  }

  async login() {
    console.log(this.ctx);
  }
}


module.exports = HomeController;
