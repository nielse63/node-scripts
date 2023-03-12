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
  return flatten(results)
    .filter((dir) => fs.existsSync(dir))
    .sort((a, b) => {
      if (a.includes('node_modules') && !b.includes('node_modules')) return -1;
      if (b.includes('node_modules') > a.includes('node_modules')) return 1;
      return 0;
    })
    .sort((a, b) => {
      if (a.length > b.length) return -1;
      if (b.length > a.length) return 1;
      return 0;
    });
};

const main = async () => {
  const paths = await getPaths();
  await Promise.all(paths.map(trash));
};

main().catch(console.error);
