import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import generateTests from '../generate-tests';

const root = path.resolve(os.tmpdir(), 'node-script-tests/generate-tests');
const srcdir = path.join(root, 'src');
const srcfile = path.join(srcdir, 'file.js');
const testfile = path.join(srcdir, '__tests__/file.spec.js');
const srccontent = `export default () => {}`;

describe('generate-tests', () => {
  beforeEach(async () => {
    await fs.ensureDir(srcdir);
    await fs.ensureFile(srcfile);
    await fs.writeFile(srcfile, srccontent, 'utf8');
  });

  afterEach(async () => {
    await fs.remove(root);
  });

  it('should create test files', async () => {
    expect(fs.existsSync(testfile)).toBeFalse();
    await generateTests(root);
    expect(fs.existsSync(testfile)).toBeTrue();
  });
});
