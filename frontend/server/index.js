import fs from 'fs';

module.exports = ctx => {
  console.log(fs);
  ctx.body = 'frontend';
};
