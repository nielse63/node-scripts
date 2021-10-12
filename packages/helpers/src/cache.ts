import path from 'path';
import fs from 'fs-extra';
import paths from './paths';

export const create = async (name) => {
  await fs.ensureDir(paths.cache);
  const filepath = path.join(paths.cache, path.basename(name));
  await fs.ensureFile(filepath);
  return filepath;
};

export const write = async (name, content) => {
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
