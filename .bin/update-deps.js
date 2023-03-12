#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const fg = require('fast-glob');
const { default: exec } = require('@nielse63/exec');
const log = require('./helpers/log');

const dryRun = process.argv.includes('--dry-run');
const root = path.resolve(__dirname, '..');

const runCommand = async (flags) => {
  const cmd = `npm install ${flags.join(' ')}`;
  log(cmd);
  if (!dryRun) {
    exec(cmd);
  }
};

const updateDependencies = async ({
  workspace,
  dependencies = [],
  devDependencies = [],
}) => {
  const flags = [];
  if (workspace) {
    flags.push('--workspace', workspace);
  }
  if (dependencies.length) {
    await runCommand([...flags, '--save', ...dependencies]);
  }
  if (devDependencies.length) {
    await runCommand([...flags, '--save-dev', ...devDependencies]);
  }
};

const parseDependenciesObject = (object) => {
  const deps = Object.entries(object).reduce((output, [key, value]) => {
    if (!value.startsWith('file:')) {
      return [...output, key];
    }
    return [...output];
  }, []);
  return deps;
};

const updateFromFile = async (filepath) => {
  const content = await fs.promises.readFile(filepath, 'utf-8');
  const json = JSON.parse(content);
  const workspace = path
    .dirname(path.relative(root, filepath))
    .replace('.', '');
  const output = { workspace, dependencies: [], devDependencies: [] };
  ['dependencies', 'devDependencies'].forEach((key) => {
    if (key in json) {
      output[key] = parseDependenciesObject(json[key]);
    }
  });
  return output;
};

const main = async () => {
  const files = await fg(['**/package.json'], {
    deep: 3,
    cwd: root,
    ignore: ['node_modules'],
  });
  const paths = files.map((file) => path.join(root, file));
  const objects = await Promise.all(paths.map(updateFromFile));
  await Promise.all(objects.map(updateDependencies));
};

main().catch(console.error);
