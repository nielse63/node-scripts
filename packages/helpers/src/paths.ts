import fs from 'fs-extra';
import os from 'os';
import path from 'path';

export const findRoot = (cwd: string = process.cwd()): string => {
  const packageFile = path.resolve(cwd, 'package.json');
  if (fs.existsSync(packageFile)) {
    return cwd;
  }
  return findRoot(path.dirname(cwd));
};

const ROOT = findRoot(process.cwd());
const src = path.join(ROOT, 'src');
const cache = path.join(os.tmpdir(), path.basename(ROOT), '.cache');

export default {
  ROOT,
  src,
  cache,
};
