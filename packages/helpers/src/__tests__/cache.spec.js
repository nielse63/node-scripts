import fs from 'fs-extra';
import { create, write } from '../cache';
import paths from '../paths';

const filename = 'test';
const filecontent = 'content';

describe('cache', () => {
  beforeEach(async () => {
    await fs.remove(paths.cache);
  });

  afterAll(async () => {
    await fs.remove(paths.cache);
  });

  describe('create', () => {
    it('should create directory and file', async () => {
      expect(fs.existsSync(paths.cache)).toBeFalse();
      const cachefile = await create(filename);
      expect(fs.existsSync(cachefile)).toBeTrue();
    });
  });

  describe('write', () => {
    it('should write to file', async () => {
      const cachefile = await write(filename, filecontent);
      expect(fs.existsSync(cachefile)).toBeTrue();
      const content = await fs.readFile(cachefile, 'utf8');
      expect(content).toEqual(filecontent);
    });

    it('should create file if it doesnt exists', async () => {
      const cachefile = await write(`test-${Date.now()}`, filecontent);
      expect(fs.existsSync(cachefile)).toBeTrue();
    });

    it('should noot create file if exists', async () => {
      await create(filename);
      const cachefile = await write(filename, filecontent);
      expect(fs.existsSync(cachefile)).toBeTrue();
    });
  });
});
