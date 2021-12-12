import cp from 'child_process';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import pkg from '../../package.json';
import copyEnv, { CopyEnv } from '../copy-env';

const testdir = path.resolve(os.tmpdir(), 'node-script-tests/copy-env');
const packagejson = path.join(testdir, 'package.json');
const envfile = path.join(testdir, '.env');
const envsamplefile = path.join(testdir, '.env.sample');

const exec = async (cmd = ''): Promise<string> => {
  const binpath = path.resolve(__dirname, '../../bin/copy-env');
  const output = cp.execSync(`${binpath} ${cmd}`.trim()).toString();
  return Promise.resolve(output.trim());
};

describe('copy-env', () => {
  let cwd;
  beforeAll(() => {
    cwd = process.env.JEST_STARTING_PWD || process.cwd();
  });

  beforeEach(async () => {
    await fs.ensureDir(testdir);
    await fs.ensureFile(packagejson);
    await fs.writeJSON(packagejson, { name: 'test' }, { spaces: 2 });
  });

  afterEach(async () => {
    process.chdir(cwd);
    await fs.remove(testdir);
  });

  describe('no .env file', () => {
    it('should fail silently if no .env file is found', async () => {
      expect(fs.existsSync(envfile)).toBeFalse();
      await expect(copyEnv(testdir)).toResolve();
    });

    it('should prevent formatting non-existing file', async () => {
      const object = new CopyEnv(testdir);
      const output = await object.formatEnv('/does/not/exist/.env');
      expect(output).toEqual('');
    });
  });

  describe('.env file exists', () => {
    beforeEach(async () => {
      await fs.ensureFile(envfile);
      const content = `ENV_VAR='123'`;
      await fs.writeFile(envfile, content, 'utf8');
    });

    it('should format content', async () => {
      await copyEnv(testdir);
      const newContent = await fs.readFile(envfile, 'utf8');
      expect(/'/.test(newContent)).toBeFalse();
      expect(/"/.test(newContent)).toBeTrue();
    });

    it('should copy and format file', async () => {
      expect(fs.existsSync(envsamplefile)).toBeFalse();
      await copyEnv(testdir);
      expect(fs.existsSync(envsamplefile)).toBeTrue();
      const sampleContent = await fs.readFile(envsamplefile, 'utf8');
      expect(sampleContent).toEqual(`ENV_VAR="123"`);
    });
  });

  describe('cli', () => {
    beforeEach(async () => {
      await fs.ensureFile(envfile);
      const content = `ENV_VAR='123'`;
      await fs.writeFile(envfile, content, 'utf8');
      process.chdir(testdir);
    });

    it('should print help', async () => {
      const output = await exec('--help');
      expect(output).toBeString();
      expect(output.includes(pkg.description)).toBeTrue();
    });

    it('should format .env file', async () => {
      await exec(testdir);
      const newContent = await fs.readFile(envfile, 'utf8');
      expect(/'/.test(newContent)).toBeFalse();
      expect(/"/.test(newContent)).toBeTrue();
    });

    it('should copy .env file', async () => {
      expect(fs.existsSync(envsamplefile)).toBeFalse();
      await exec();
      expect(fs.existsSync(envsamplefile)).toBeTrue();
    });
  });
});
