'use strict';

module.exports = options => {
  return async function needlogin(ctx, next) {
    if (ctx.isAuthenticated()) {
      console.log('已经登录', ctx.user);
      await next();
    } else {
      ctx.session.returnTo = ctx.path;
      ctx.redirect('/passport/github');
    }
  };
};
