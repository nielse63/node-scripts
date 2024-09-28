import fg from 'fast-glob';
import fs from 'fs';
import log from 'npmlog';
import os from 'os';
import path from 'path';
import xdgTrashdir from 'xdg-trashdir';

log.enableColor();

export type Options = {
  cwd?: string;
  trash?: string;
};
export type TrashItem = {
  src: string;
  dest: string;
};

export const getTrashPath = async () => {
  if (process.platform === 'darwin') {
    return path.join(os.homedir(), '.Trash');
  }
  return xdgTrashdir();
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
  trashPath?: string
): Promise<TrashItem> => {
  const trash = trashPath || (await getTrashPath());
  if (!fs.existsSync(filepath)) {
    log.warn('trash', `${filepath} does not exist`);
    return { src: filepath, dest: '' };
  }
  const basename = path.basename(filepath);
  const extension = path.extname(filepath);
  const basenameNoExtension = basename.replace(new RegExp(`${extension}$`), '');
  const newBasename = `${basenameNoExtension}_${Date.now()}_${rand()}${extension}`;
  const newpath = path.join(trash, newBasename);
  try {
    log.info('trash', `moving ${filepath} to ${newpath}`);
    await fs.promises.rename(filepath, newpath);
  } catch (error: unknown) {
    log.error('trash', `${error}`);
  }
  return { src: filepath, dest: newpath };
};

export const trash = async (
  filepaths: string | string[],
  options: Options = {}
): Promise<TrashItem[]> => {
  // define config object
  const config = {
    cwd: options.cwd || process.cwd(),
    trash: options.trash || (await getTrashPath()),
  };
  const files = Array.isArray(filepaths) ? filepaths.flat() : [filepaths];

  // check that cwd value is a valid directory
  if (!fs.existsSync(config.cwd)) {
    log.error('trash', `cwd '${config.cwd}' does not exist - exiting`);
    return [];
  }

  // check that trash directory exists - only works on mac
  if (!fs.existsSync(config.trash)) {
    log.error('trash', `trash '${config.trash}' does not exist - exiting`);
    return [];
  }

  // find files
  const foundFiles = await fg(files, {
    cwd: config.cwd,
    absolute: true,
    onlyFiles: false,
  });

  // exclude nested paths
  const parentPaths = foundFiles.filter((file) => {
    return !foundFiles.some((otherFile) => isPathInside(file, otherFile));
  });
  const promises = parentPaths.map((filepath) =>
    trashItem(filepath, config.trash)
  );
  const results = await Promise.all(promises);
  return results;
};

export default trash;
