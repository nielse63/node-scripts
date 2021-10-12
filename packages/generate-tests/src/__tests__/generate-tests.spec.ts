import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import cp from 'child_process';
import generateTests from '../generate-tests';
import pkg from '../../package.json';

const root = path.resolve(os.tmpdir(), 'node-script-tests/generate-tests');
const srcdir = path.join(root, 'src');
const packagejson = path.join(root, 'package.json');
const srcfile = path.join(srcdir, 'file.js');
const testfile = path.join(srcdir, '__tests__/file.spec.js');
const srccontent = `export default () => {}`;

const exec = async (cmd = ''): Promise<string> => {
  const binpath = path.resolve(__dirname, '../../bin/generate-tests');
  const output = cp.execSync(`${binpath} ${cmd}`.trim()).toString();
  return Promise.resolve(output.trim());
};

describe('generate-tests', () => {
  let cwd;
  beforeAll(() => {
    cwd = process.cwd();
  });

  afterAll(() => {
    process.chdir(cwd);
  });

  beforeEach(async () => {
    await fs.ensureDir(root);
    await fs.ensureDir(srcdir);
    await fs.ensureFile(packagejson);
    await fs.writeJSON(packagejson, { name: 'test' }, { spaces: 2 });
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

  describe('cli', () => {
    beforeEach(async () => {
      process.chdir(root);
    });

    it('should print help', async () => {
      const output = await exec('--help');
      expect(output).toBeString();
      expect(output.includes(pkg.description)).toBeTrue();
    });

    it('should generate test files', async () => {
      expect(fs.existsSync(testfile)).toBeFalse();
      await exec();
      expect(fs.existsSync(testfile)).toBeTrue();
    });

    it('should not run when no src files found', async () => {
      await exec('**/lib/**.{js,ts}');
      expect(fs.existsSync(testfile)).toBeFalse();
    });
  });
});
