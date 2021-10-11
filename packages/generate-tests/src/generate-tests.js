#!/usr/bin/env node
import fs from 'fs-extra';
import log from 'signale';
import path from 'path';
import _ from 'lodash';
import fg from 'fast-glob';

const createTestTemplate = (classname) => {
  const imnportName = classname.includes('-')
    ? _.camelCase(classname)
    : classname;
  return `import ${imnportName} from '../${classname}';

describe('${classname}', () => {
  it('needs tests', () => {
    expect(${imnportName}).toBeDefined();
  });
});
`;
};

export default async (cwd = process.cwd()) => {
  const files = await fg(['**/*.js', '**/*.ts'], {
    cwd,
    ignore: [
      '**/node_modules/**',
      '**/*.spec.*',
      '**/*.test.*',
      '**/dist/**',
      '**/coverage/**',
    ],
  });
  files
    .map((file) => path.resolve(cwd, file))
    .map((file) => {
      const basename = path.basename(file);
      const dirname = path.dirname(file);
      const extension = path.extname(file);
      const extrgx = new RegExp(`${extension}$`);
      const classname = basename.replace(extrgx, '');

      const testpath = path
        .join(dirname, '__tests__', basename)
        .replace(extrgx, `.spec${extension}`);
      console.log({ file, testpath, basename, classname });
      return { file, testpath, basename, classname };
    })
    .filter(
      ({ testpath, classname }) =>
        !fs.existsSync(testpath) && classname !== 'index'
    )
    .forEach(async ({ classname, testpath }) => {
      const template = createTestTemplate(classname);
      await fs.ensureFile(testpath);
      await fs.writeFile(testpath, template, 'utf8');
      log.success(`Created ${path.relative(cwd, testpath)}`);
    });
};
