'use strict';

const fs = require('fs');
const path = require('path');

function VersionWebpackPlugin(opts = {}) {
  if (typeof opts.cb !== 'function') {
    throw new Error('You must set the cb option');
  }
  this.opts = opts;
}

VersionWebpackPlugin.prototype.apply = function(compiler) {
  const opts = this.opts;
  compiler.plugin('done', (compilation) => {
    const hash = compilation.hash;
    fs.writeFileSync(path.join(__dirname, '/hash.json'), `{"hash": "${hash}"}`, 'utf-8');
    opts.cb(hash);
  });
};

module.exports = VersionWebpackPlugin;
