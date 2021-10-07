require('dotenv').config();
const log = require('signale');

module.exports = (input = '') => {
  log.debug('executing node module');
  return `module says: ${input}`;
};
