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

  // 前端路由
  router.post('/login', 'user.login');
  router.get('*', 'home.index');
};
