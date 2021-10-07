#!/usr/bin/env node
import fs from 'fs-extra';
import log from 'signale';
import path from 'path';
import _ from 'lodash';
import { paths, exec } from '@nielse63/helpers';

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
  const string = await exec(
    `find ${cwd} -type f -name '*.js' -or -name '*.ts' ! -path "**/node_modules/**" ! -path "**/dist/**" ! -name '*.spec.*' ! -name '*.test.*'`
  );
  const files = string.split('\n').filter((file) => {
    if (
      file.includes('/node_modules/') ||
      file.includes('/dist/') ||
      file.includes('.spec.') ||
      file.includes('.test.')
    ) {
      return false;
    }
    return true;
  });
  files
    .map((file) => {
      const basename = path.basename(file);
      const dirname = path.dirname(file);
      const extension = path.extname(file);
      const extrgx = new RegExp(`${extension}$`);
      const classname = basename.replace(extrgx, '');

      const testpath = path
        .join(dirname, '__tests__', basename)
        .replace(extrgx, `.spec${extension}`);
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
      log.success(`Created ${path.relative(paths.ROOT, testpath)}`);
    });
};
