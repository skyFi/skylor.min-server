'use strict';

module.exports = {
  html(err, ctx) {
    ctx.body = `<h1>${err.code}: ${err.message}</h1>`;
    ctx.status = 500;
  },
  json(err, ctx) {
    ctx.body = {
      code: ctx.status,
      errMsg: `${err.code}: ${err.message}`,
      detail: err.errors,
    };
    ctx.status = 500;
  },
};
