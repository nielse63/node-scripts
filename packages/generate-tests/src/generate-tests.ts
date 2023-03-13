import fg from 'fast-glob';
import fs from 'fs-extra';
import gitignore, { Ignore } from 'ignore';
import camelCase from 'lodash/camelCase';
import os from 'os';
import path from 'path';

interface FileObject {
  file: string;
  abspath: string;
  testpath: string;
  basename: string;
  classname: string;
}

interface Options {
  cwd: string;
  glob?: string;
  verbose?: boolean;
}

export const defaults = {
  cwd: process.cwd(),
  glob: '**/src/**.{js,ts}',
  verbose: false,
};

export class GenerateTests {
  cwd: string;
  glob: string;
  verbose: boolean;
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
    this.cwd = config.cwd;
    this.glob = config.glob;
    this.verbose = config.verbose;
    this.fileobjects = [];
    this.ignoredPatterns = [];
    this.ignore = gitignore();
  }

  async run(): Promise<FileObject[]> {
    const files = await this.findFiles();
    this.fileobjects = this.createFileObjects(files);
    await this.ensureFiles();
    await this.writeFiles();
    this.debug('Generated test files');
    return this.fileobjects;
  }

  debug(message = ''): void {
    if (this.verbose) {
      console.debug(message);
    }
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
    this.debug(`files: \n  ${filteredFiles.join('  \n')}`);
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
      this.debug('No tests to generate');
      return [];
    }
    this.debug(`fileobjects: \n  ${fileobjects.join('  \n')}`);
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

export default async (
  options: Options | string = { ...defaults }
): Promise<FileObject[]> => {
  const generateTests = new GenerateTests(options);
  const output = await generateTests.run();
  return output;
};
