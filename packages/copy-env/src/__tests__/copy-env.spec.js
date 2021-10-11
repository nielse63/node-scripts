import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import log from 'signale';
import copyEnv from '../copy-env';

const testdir = path.resolve(os.tmpdir(), 'node-script-tests/copy-env');
const envfile = path.join(testdir, '.env');
const envsamplefile = path.join(testdir, '.env.sample');

describe('copy-env', () => {
  beforeEach(async () => {
    await fs.ensureDir(testdir);
  });

  afterEach(async () => {
    await fs.remove(testdir);
  });

  describe('no .env file', () => {
    it('should fail silently if no .env file is found', async () => {
      expect(fs.existsSync(envfile)).toBeFalse();
      await expect(copyEnv(testdir)).toResolve();
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

    it('should print to console', async () => {
      await copyEnv(testdir, { print: true });
      expect(log.success).toHaveBeenCalledWith('.env updated');
    });
  });
});
