'use strict';

const path = require('path');

module.exports = () => {
  const skipExt = [ '.png', '.jpeg', '.jpg', '.ico', '.gif', '.js' ];
  return async (ctx, next) => {
    const start = new Date().getTime();
    await next();

    const rs = Math.ceil(new Date().getTime() - start);

    ctx.set('X-Response-Time', rs);

    const ext = path.extname(ctx.url).toLocaleLowerCase();
    const isSkip = skipExt.indexOf(ext) !== -1 && ctx.status < 400;

    if (!isSkip) {
      const ip = ctx.get('X-Real-IP') || ctx.ip;
      const port = ctx.get('X-Real-Port');
      const protocol = ctx.protocol.toUpperCase();
      const method = ctx.method;
      const url = ctx.url;
      const status = ctx.status;
      const length = ctx.length || '-';
      const referrer = ctx.get('referrer') || '-';
      const ua = ctx.get('user-agent') || '-';
      const serverTime = ctx.response.get('X-Server-Response-Time') || '-';
      ctx.logger.info('[access] %s:%s - %s %s %s/%s %s %s %sms %s %s',
        ip, port, method, url, protocol, status, length, referrer, rs, serverTime, ua);
    }
  };
};