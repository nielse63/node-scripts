import cp from 'child_process';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import signale from 'signale';
import pkg from '../../package.json';
import generateTests, { GenerateTests } from '../generate-tests';

const root = path.resolve(os.tmpdir(), 'node-script-tests/generate-tests');
const srcdir = path.join(root, 'src');
const packagejson = path.join(root, 'package.json');
const srcfile = path.join(srcdir, 'file.js');
const testfile = path.join(srcdir, '__tests__/file.spec.js');
const srccontent = `export default () => {}`;

const exec = async (cmd = ''): Promise<string> => {
  const binpath = path.resolve(__dirname, '../../bin/generate-tests.js');
  const output = cp.execSync(`${binpath} ${cmd}`.trim()).toString();
  return Promise.resolve(output.trim());
};

jest.mock('signale');

describe('generate-tests', () => {
  let cwd;
  beforeAll(() => {
    cwd = process.env.JEST_STARTING_PWD || process.cwd();
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
    process.chdir(cwd);
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

  describe('#debug', () => {
    it('should call debug only when specified', async () => {
      await generateTests(root, '**/src/**.{js,ts}', { debug: true });
      expect(signale.debug).toHaveBeenCalled();
    });

    it('should not call debug when not in config', async () => {
      await generateTests(root);
      expect(signale.debug).not.toHaveBeenCalled();
    });
  });

  describe('#createFileObjects', () => {
    it('should return empty array if not file objects created', async () => {
      const gt = new GenerateTests(root, '**/does-not-exist/**.{js,ts}');
      const files = await gt.findFiles();
      const output = gt.createFileObjects(files);
      expect(output).toEqual([]);
    });
  });

  describe('#createTestTemplate', () => {
    it('should convert kebabCase to snakeCase', () => {
      const template = GenerateTests.createTestTemplate('snake-case');
      expect(template.includes('import snakeCase')).toBeTrue();
    });
  });
});
