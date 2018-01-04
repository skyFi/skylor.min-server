'use strict';

const Service = require('egg').Service;

class AuthorizationService extends Service {

  /**
   * 创建或查找 authorization
   *
   * @param {Object} authorization 新的或需要查找的 authorization
   * @return {Object} authorization
   */
  async findOrCreate(authorization) {
    let oldAuthorization = await this.app.mysql.get('authorization', { user_id: authorization.user_id });
    if (!oldAuthorization) {
      oldAuthorization = await this.app.mysql.insert('authorization', authorization);
    }
    return oldAuthorization;
  }
}

module.exports = AuthorizationService;
