import cp from 'child_process';
import util from 'util';

const execPromise = util.promisify(cp.exec);

const exec = async (cmd: string, options = {}): Promise<string> => {
  try {
    const { stdout, stderr } = await execPromise(cmd, {
      cwd: process.cwd(),
      ...options,
    });
    return `${stdout}${stderr}`.trim();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.stdout) {
      return `${error.stdout}`.trim();
    }
    return Promise.reject(error);
  }
};

export default exec;
