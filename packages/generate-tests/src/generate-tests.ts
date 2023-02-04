import fg from 'fast-glob';
import fs from 'fs-extra';
import camelCase from 'lodash/camelCase';
import path from 'path';
import log from 'signale';

interface FileObject {
  file: string;
  abspath: string;
  testpath: string;
  basename: string;
  classname: string;
}

interface Options {
  debug: boolean;
}

export class GenerateTests {
  cwd: string;
  glob: string;
  fileobjects: FileObject[];
  options: Options;

  constructor(cwd: string, glob = '**/src/**.{js,ts}', options = {}) {
    this.cwd = cwd;
    this.glob = glob;
    this.fileobjects = [];
    this.options = {
      debug: false,
      ...options,
    };
  }

  async run(): Promise<FileObject[]> {
    const files = await this.findFiles();
    this.fileobjects = this.createFileObjects(files);
    await this.ensureFiles();
    await this.writeFiles();
    log.success('Generated test files');
    return this.fileobjects;
  }

  debug(message = ''): void {
    if (this.options.debug) {
      log.debug(message);
    }
  }

  async findFiles(): Promise<string[]> {
    const files = await fg([this.glob], {
      cwd: this.cwd,
      ignore: [
        '**/node_modules/**',
        '**/*.spec.*',
        '**/*.test.*',
        '**/dist/**',
        '**/coverage/**',
        '**/__tests__/**',
        '**/__mocks__/**',
        '**/*.config.js',
      ],
    });
    this.debug(`files: \n  ${files.join('  \n')}`);
    return files;
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
  cwd = process.cwd(),
  glob = '**/src/**.{js,ts}',
  options = {}
): Promise<FileObject[]> => {
  const generateTestst = new GenerateTests(cwd, glob, options);
  return generateTestst.run();
};
