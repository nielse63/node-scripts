const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = async (cmd, options = {}) => {
  if (!cmd) return '';
  const { stdout, stderr } = await exec(cmd, options);
  if (stderr) {
    throw new Error(stderr);
  }
  return stdout.trim();
};
