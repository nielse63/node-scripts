import util from 'util';
import cp from 'child_process';

const exec = util.promisify(cp.exec);

export default async (cmd: string, options = {}): Promise<string> => {
  try {
    const { stdout } = await exec(cmd, {
      cwd: process.cwd(),
      ...options,
    });
    return stdout.trim();
  } catch (error: any) {
    return Promise.reject(new Error(error));
  }
};
