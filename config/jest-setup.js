const path = require('path');

if (!('JEST_STARTING_PWD' in process.env)) {
  process.env.JEST_STARTING_PWD = path.resolve(__dirname, '..');
}
