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
  compiler.plugin('done', () => {
    const jsPath = compiler.options.output.path;
    const jsVersionFileName = compiler.options.output.filename;
    const entry = compiler.options.entry;
    const version = Math.round(Math.random() * 10000000) + 10000000;

    fs.writeFileSync(path.join(__dirname, '/version.json'), `{"version": "${version}"}`, 'utf-8');
    const newjsFileName = jsVersionFileName.replace(/(\[version\])/, version);
    Object.keys(entry).forEach(name => {
      const oldFileName = jsVersionFileName.replace(/(\[name\])/, name);
      const newFileName = newjsFileName.replace(/(\[name\])/, name);
      const oldPath = path.resolve(jsPath, oldFileName);
      const newPath = path.resolve(jsPath, newFileName);
      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
      }
    });
    opts.cb(version);
  });
};

module.exports = VersionWebpackPlugin;
