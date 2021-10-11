import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import paths, { findRoot } from '../paths';

describe('paths', () => {
  describe('findRoot', () => {
    const tmpdir = os.tmpdir();
    const fakemodule = path.resolve(tmpdir, 'node-scripts/test-module');
    const pkgfile = path.join(fakemodule, 'package.json');
    const nesteddir = path.join(fakemodule, 'nested/directory');

    beforeAll(async () => {
      await fs.ensureDir(fakemodule);
      await fs.ensureFile(pkgfile);
      await fs.ensureDir(nesteddir);
    });

    afterAll(async () => {
      await fs.remove(fakemodule);
    });

    it('should find module root', () => {
      const root = findRoot(nesteddir);
      expect(root).toEqual(fakemodule);
    });

    it('should accept undefined arguments', () => {
      const root = findRoot();
      expect(root).toEqual(process.cwd());
    });
  });

  it('should be defined', () => {
    expect(paths).toBeObject();
    expect(paths).toContainKeys(['ROOT', 'src', 'cache']);
  });
});
