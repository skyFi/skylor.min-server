'use strict';

module.exports = () => {
  return async function notFoundHandler(ctx, next) {
    await next();
    if (ctx.status === 404 && !ctx.body) {
      console.log(ctx.acceptJSON);
      if (ctx.acceptJSON) {
        ctx.body = { code: 404, errMsg: 'Not Found' };
      } else {
        ctx.body = '<h1>404</h1>';
      }
    }
  };
};
