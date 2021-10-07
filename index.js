const fn = require('./src');

module.exports = fn;

if (!module.parents) {
  fn();
}
