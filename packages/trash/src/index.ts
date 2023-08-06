import fg from 'fast-glob';
import fs from 'fs';
import os from 'os';
import path from 'path';
import xdgTrashdir from 'xdg-trashdir';

const trash =
  process.platform === 'darwin'
    ? path.join(os.homedir(), '.Trash')
    : await xdgTrashdir();

export type Options = {
  cwd?: string;
  trash?: string;
};
export type ReturnObject = {
  src: string;
  dest: string;
};

// source: https://github.com/sindresorhus/is-path-inside/blob/main/index.js
export const isPathInside = (childPath: string, parentPath: string) => {
  const relation = path.relative(parentPath, childPath);
  return Boolean(
    relation &&
      relation !== '..' &&
      !relation.startsWith(`..${path.sep}`) &&
      relation !== path.resolve(childPath)
  );
};

// source: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
export const rand = (length = 8) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charlen = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charlen));
    counter += 1;
  }
  return result;
};

export const trashItem = async (
  filepath: string,
  trashPath = trash
): Promise<ReturnObject | undefined> => {
  if (!fs.existsSync(filepath)) {
    console.debug(`${filepath} does not exist`);
    return;
  }
  const basename = path.basename(filepath);
  const extension = path.extname(filepath);
  const basenameNoExtension = basename.replace(new RegExp(`${extension}$`), '');
  const newBasename = `${basenameNoExtension}_${Date.now()}_${rand()}${extension}`;
  const newpath = path.join(trashPath, newBasename);
  await fs.promises.rename(filepath, newpath);
  return { src: filepath, dest: newpath };
};

export const main = async (
  filepaths: string | string[],
  options: Options = {}
): Promise<ReturnObject[] | undefined> => {
  // define config object
  const config = {
    cwd: options.cwd || process.cwd(),
    trash: options.trash || trash,
  };

  // check that cwd value is a valid directory
  if (!fs.existsSync(config.cwd)) {
    console.error(`${config.cwd} does not exist - exiting`);
    return;
  }

  // check that trash directory exists - only works on mac
  if (!fs.existsSync(config.trash)) {
    console.error(`${config.trash} does not exist - exiting`);
    return;
  }

  // find files
  const files = await fg(filepaths, {
    cwd: config.cwd,
    absolute: true,
    onlyFiles: false,
  });

  // exclude nested paths
  const parentPaths = files.filter((file) => {
    return !files.some((otherFile) => isPathInside(file, otherFile));
  });
  // .filter((file) => fs.existsSync(file));
  const promises = parentPaths.map((filepath) =>
    trashItem(filepath, config.trash)
  );
  const results = await Promise.all(promises);
  // @ts-ignore
  return results.filter(Boolean);
};

export default main;
