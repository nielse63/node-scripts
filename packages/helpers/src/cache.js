import path from 'path';
import fs from 'fs-extra';
import paths from './paths';

export default {
  async create(name) {
    const filepath = path.join(paths.cache, path.basename(name));
    await fs.ensureFile(filepath);
    return filepath;
  },
  async write(name, content) {
    const filepath = path.join(paths.cache, path.basename(name));
    await fs.writeFile(filepath, content, 'utf8');
  },
};
