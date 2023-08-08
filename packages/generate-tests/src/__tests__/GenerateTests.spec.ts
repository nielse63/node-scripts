import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { GenerateTests } from '../GenerateTests';

const root = path.resolve(os.tmpdir(), 'node-scripts/generate-tests');
const srcdir = path.join(root, 'src');
const packagejson = path.join(root, 'package.json');
const srcfile = path.join(srcdir, 'file.js');
const gitignoreFile = path.join(root, '.gitignore');
const srccontent = `export default () => {}`;
const gitignoreContent = `ignored_dir

# ignore this line`;

describe('generate-tests', () => {
  let cwd: string;
  beforeAll(async () => {
    cwd = process.env.JEST_STARTING_PWD || process.cwd();
  });

  beforeEach(async () => {
    await fs.ensureDir(root);
    await fs.ensureDir(srcdir);
    await fs.ensureFile(packagejson);
    await fs.writeJSON(packagejson, { name: 'test' }, { spaces: 2 });
    await fs.ensureFile(srcfile);
    await fs.writeFile(srcfile, srccontent, 'utf8');
    await fs.writeFile(gitignoreFile, gitignoreContent, 'utf-8');
    await fs.ensureFile(path.join(root, 'node_modules/test.js'));
    await fs.ensureFile(path.join(root, 'ignored_dir/test.js'));
    await fs.writeFile(path.join(srcdir, '.gitignore'), 'nested', 'utf-8');
  });

  afterEach(async () => {
    process.chdir(cwd);
    await fs.remove(root);
  });

  describe('properties', () => {
    it('should define config object if given a string', () => {
      const gt = new GenerateTests('**/*/glob');
      expect(gt.glob).toEqual('**/*/glob');
    });
  });

  describe('#createFileObjects', () => {
    it('should return empty array if not file objects created', async () => {
      const gt = new GenerateTests({
        cwd: root,
        glob: '**/does-not-exist/*.{js,ts}',
      });
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

  describe('#findGitignoreFiles', () => {
    it('should read from gitignore files', async () => {
      const gt = new GenerateTests({ cwd: root });
      const output = await gt.findGitignoreFiles();
      expect(output).toIncludeAllMembers(['ignored_dir']);
    });

    it('should recursively read from gitignore files', async () => {
      const gt = new GenerateTests({ cwd: srcdir });
      const output = await gt.findGitignoreFiles();
      expect(output).toIncludeAllMembers(['nested', 'ignored_dir']);
    });
  });

  describe('#findFiles', () => {
    it('should ignore files', async () => {
      const gt = new GenerateTests({ cwd: root });
      const output = await gt.findFiles();
      expect(output).not.toIncludeAllMembers([
        'node_modules/test.js',
        'ignored_dir/test.js',
      ]);
    });
  });
});
