import util from 'util';
import cp from 'child_process';

const exec = util.promisify(cp.exec);

export default async (cmd) => {
  const { stdout, stderr } = await exec(cmd);
  if (stderr) {
    throw new Error(stderr);
  }
  return stdout.trim();
};
