'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router } = app;

  // 中间键
  const needLogin = app.middlewares.needlogin();

  // 挂载鉴权路由
  app.passport.mount('github');

  // 接口路由
  router.get('/api/userinfo/:id', needLogin, 'user.userinfo');
  router.post('/login', 'user.login');

  // 页面路由
  router.get('*', require('./frontend/index'));
};
