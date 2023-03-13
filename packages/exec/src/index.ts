import cp from 'child_process';
import util from 'util';

const execPromise = util.promisify(cp.exec);

const exec = async (cmd: string, options = {}): Promise<string> => {
  try {
    const { stdout } = await execPromise(cmd, {
      cwd: process.cwd(),
      ...options,
    });
    return stdout.trim();
  } catch (error: unknown) {
    // @ts-expect-error: error is of string | undefined type
    return Promise.reject(new Error(error));
  }
};

export default exec;
