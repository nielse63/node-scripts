#!/usr/bin/env node
const fg = require('fast-glob');
const fs = require('fs');
const path = require('path');
const flatten = require('lodash/flatten');
const pkg = require('../package.json');
const trash = require('./helpers/trash');

const packageLock = process.argv.includes('--package-lock');

// paths
const root = path.resolve(__dirname, '../');

// functions
const getPaths = async () => {
  const options = ['**/node_modules', '**/dist', '**/coverage'];
  if (packageLock) {
    options.push('**/package-lock.json');
  }
  const paths = pkg.workspaces
    .map((item) => {
      return path.join(root, item.replace(/\/\*$/, ''));
    })
    .concat(root);
  const promises = paths.map(async (dir) => {
    const results = await fg(options, {
      onlyFiles: false,
      deep: dir === root ? 1 : 2,
      cwd: dir,
    });
    return results.map((item) => path.join(dir, item));
  });
  const results = await Promise.all(promises);
  return flatten(results).filter((dir) => fs.existsSync(dir));
};

const main = async () => {
  const paths = await getPaths();
  const promises = paths.map((dir) => {
    return trash(dir);
  });
  await Promise.all(promises);
};

main().catch(console.error);
