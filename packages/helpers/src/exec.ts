import util from 'util';
import cp from 'child_process';

const exec = util.promisify(cp.exec);

export default async (cmd, options = {}) => {
  try {
    const { stdout } = await exec(cmd, {
      cwd: process.cwd(),
      ...options,
    });
    return stdout.trim();
  } catch (error) {
    return Promise.reject(new Error(error));
  }
};
