import fg from 'fast-glob';
import fs from 'fs-extra';
import gitignore, { Ignore } from 'ignore';
import camelCase from 'lodash/camelCase';
import log from 'npmlog';
import os from 'os';
import path from 'path';

log.enableColor();

export interface FileObject {
  file: string;
  abspath: string;
  testpath: string;
  basename: string;
  classname: string;
}

export interface Options {
  cwd?: string;
  glob?: string;
}

export const defaults = {
  glob: '**/src/**.{js,ts}',
};

export class GenerateTests {
  cwd: string;
  glob: string;
  fileobjects: FileObject[];
  ignoredPatterns: string[];
  ignore: Ignore;

  constructor(options: Options | string) {
    const config =
      typeof options === 'string'
        ? {
            ...defaults,
            glob: options,
          }
        : {
            ...defaults,
            ...options,
          };
    this.cwd = config.cwd || process.cwd();
    this.glob = config.glob;
    this.fileobjects = [];
    this.ignoredPatterns = [];
    this.ignore = gitignore();
  }

  async run(): Promise<FileObject[]> {
    const files = await this.findFiles();
    this.fileobjects = this.createFileObjects(files);
    await this.ensureFiles();
    await this.writeFiles();
    return this.fileobjects;
  }

  async findGitignoreFiles(filepath = this.cwd): Promise<string[]> {
    const gitignoreFile = path.join(filepath, '.gitignore');
    if (fs.existsSync(gitignoreFile)) {
      const content = await fs.readFile(gitignoreFile, 'utf-8');
      const lines = content.split('\n').filter((line) => {
        return line && !line.startsWith('#') && gitignore.isPathValid(line);
      });
      this.ignore.add(lines);
      this.ignoredPatterns.push(...lines);
    }
    if (filepath === '/' || filepath === os.homedir()) {
      return this.ignoredPatterns;
    }
    return this.findGitignoreFiles(path.dirname(filepath));
  }

  async findFiles(): Promise<string[]> {
    await this.findGitignoreFiles();
    const files = await fg([this.glob], {
      cwd: this.cwd,
      ignore: ['**/node_modules', '**/flow-typed', '**/coverage', '**/.git'],
    });
    const filteredFiles = files.filter((file) => !this.ignore.ignores(file));
    return filteredFiles;
  }

  createFileObjects(files: string[]): FileObject[] {
    const fileobjects = files
      .map((file) => {
        const abspath = path.resolve(this.cwd, file);
        const basename = path.basename(abspath);
        const dirname = path.dirname(abspath);
        const extension = path.extname(abspath);
        const extrgx = new RegExp(`${extension}$`);
        const classname = basename.replace(extrgx, '');

        const testpath = path
          .join(dirname, '__tests__', basename)
          .replace(extrgx, `.spec${extension}`);
        return { file, abspath, testpath, basename, classname };
      })
      .filter(
        ({ testpath, classname }) =>
          !fs.existsSync(testpath) && classname !== 'index'
      );
    if (!fileobjects.length) {
      log.warn('generate-tests', 'No tests to generate');
      return [];
    }
    return fileobjects;
  }

  async ensureFiles(): Promise<void> {
    const promises = this.fileobjects.map(async ({ testpath }) =>
      fs.ensureFile(testpath)
    );
    await Promise.all(promises);
  }

  async writeFiles(): Promise<void> {
    const promises = this.fileobjects.map(async ({ classname, testpath }) => {
      const template = GenerateTests.createTestTemplate(classname);
      return fs.writeFile(testpath, template, 'utf8');
    });
    await Promise.all(promises);
  }

  static createTestTemplate(classname: string): string {
    const importName = classname.includes('-')
      ? camelCase(classname)
      : classname;
    return `import ${importName} from '../${classname}';

  describe('${classname}', () => {
    it('needs tests', () => {
      expect(${importName}).toBeDefined();
    });
  });
  `;
  }
}
