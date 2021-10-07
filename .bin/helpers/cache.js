const path = require('path');
const fs = require('fs-extra');
const paths = require('./paths');

module.exports = {
  async create(name) {
    const filepath = path.join(paths.cache, path.basename(name));
    await fs.ensureFile(filepath);
    return filepath;
  },
  async write(name, content) {
    const filepath = path.join(paths.cache, path.basename(name));
    await fs.writeFile(filepath, content, 'utf8');
  },
};
