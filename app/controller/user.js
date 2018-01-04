'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async login() {
    this.ctx.rotateCsrfSecret();
    const body = this.ctx.request.body;
    this.ctx.validate({
      username: { type: 'string' },
      keywords: { type: 'string' },
    });
    this.ctx.session = {
      name: 'hi',
    };
    console.log(this.ctx);

    this.ctx.body = {
      success: true,
      params: body,
    };
  }

  async userinfo() {
    this.ctx.body = this.ctx.user;
  }

  async findOrCreate(user) {
    return this.service.user.findOrCreate(user);
  }
}

module.exports = UserController;
