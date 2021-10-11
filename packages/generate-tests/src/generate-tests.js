import fs from 'fs-extra';
import log from 'signale';
import path from 'path';
import camelCase from 'lodash/camelCase';
import fg from 'fast-glob';

const createTestTemplate = (classname) => {
  const imnportName = classname.includes('-')
    ? camelCase(classname)
    : classname;
  return `import ${imnportName} from '../${classname}';

describe('${classname}', () => {
  it('needs tests', () => {
    expect(${imnportName}).toBeDefined();
  });
});
`;
};

const createFileObjects = (files, cwd) =>
  files
    .map((file) => {
      const abspath = path.resolve(cwd, file);
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

const ensureFiles = async (fileObjects) => {
  const promises = fileObjects.map(async ({ testpath }) =>
    fs.ensureFile(testpath)
  );
  await Promise.all(promises);
};

const writeFiles = async (fileObjects) => {
  const promises = fileObjects.map(async ({ classname, testpath }) => {
    const template = createTestTemplate(classname);
    return fs.writeFile(testpath, template, 'utf8');
  });
  await Promise.all(promises);
};

export default async (cwd = process.cwd(), glob = '**/src/**.{js,ts}') => {
  // find files using glob patters
  const files = await fg([glob], {
    cwd,
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

  const fileObjects = createFileObjects(files, cwd);

  await ensureFiles(fileObjects);
  await writeFiles(fileObjects);
  log.success('Generated test files');
};
