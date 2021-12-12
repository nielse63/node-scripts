import fs from 'fs-extra';
import path from 'path';
import paths from './paths';

export const create = async (name: string): Promise<string> => {
  await fs.ensureDir(paths.cache);
  const filepath = path.join(paths.cache, path.basename(name));
  await fs.ensureFile(filepath);
  return filepath;
};

export const write = async (name: string, content: string): Promise<string> => {
  const filepath = path.join(paths.cache, path.basename(name));
  if (!fs.existsSync(filepath)) {
    await create(filepath);
  }
  await fs.writeFile(filepath, content, 'utf8');
  return filepath;
};

export default {
  create,
  write,
};
