const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const packages = path.join(ROOT, 'packages');
const cache = path.join(ROOT, '.cache');

module.exports = {
  ROOT,
  packages,
  cache,
};
