#!/usr/bin/env node
const fs = require('fs-extra');
const path = require('path');
const fg = require('fast-glob');
const exec = require('./helpers/exec');
const cp = require('child_process');

const root = path.resolve(__dirname, '..');
const packagesDir = path.join(root, 'packages');

const readReadmeTemplate = async () => {
  const content = await fs.promises.readFile(
    path.join(__dirname, 'templates/README.md.hbs'),
    'utf-8'
  );
  return content;
};

const getPackages = async () => {
  const packageJsonFiles = await fg('packages/*/package.json', {
    absolute: true,
  });
  const promises = packageJsonFiles.map(async (file) => {
    const dirname = path.dirname(file);
    const basename = path.basename(dirname);
    const packageJson = await fs.readJSON(file);
    const { name, description } = packageJson;
    return { name, description, dirname, basename };
  });
  return Promise.all(promises);
};

const copyPackageReadmes = async () => {
  const packages = await getPackages();
  const readmes = packages
    .map(({ dirname }) => {
      return path.join(packagesDir, dirname, 'README.md');
    })
    .filter((file) => fs.existsSync(file));
  const destFolder = path.join(root, 'docs/packages');
  if (!fs.existsSync(destFolder)) {
    await fs.promises.mkdir(destFolder);
  }
  const promises = readmes.map(async (src) => {
    const pkg = path.basename(path.dirname(src));
    console.log(`cp packages/${pkg}/README.md -> docs/packages/${pkg}.md`);
    const dest = path.join(destFolder, `${pkg}.md`);
    await fs.promises.copyFile(src, dest);
  });
  await Promise.all(promises);
};

const updateReadme = async () => {
  const content = await readReadmeTemplate();
  const packages = await getPackages();
  const header = '| Package | Description |';
  const rows = packages.map(({ name, basename, description }) => {
    return `| [${name}](https://github.com/nielse63/node-scripts/blob/main/packages/${basename}) | ${description} |`;
  });
  const table = [header, '| --- | --- |', ...rows].join('\n');
  const newContent = content.replace(/{{packagesList}}/g, table);
  console.log('updating README.md');
  await fs.promises.writeFile(path.join(root, 'README.md'), newContent);
};

const copyReadme = async () => {
  console.log(`cp README.md -> docs/README.md`);
  const src = path.join(root, 'README.md');
  const dest = path.join(root, 'docs/README.md');
  await fs.promises.copyFile(src, dest);
};

const runPrettier = async () => {
  const output = await exec('git diff --name-only');
  const changedMarkdown = output
    .split('\n')
    .filter(Boolean)
    .filter((file) => file.endsWith('.md'));
  if (!changedMarkdown.length) {
    console.log('No markdown files to format');
    return;
  }
  const child = cp.spawn('npx', ['prettier', '--write', ...changedMarkdown], {
    stdio: 'inherit',
  });
  return new Promise((resolve, reject) => {
    child.on('exit', (code) => {
      if (code === 0) {
        console.log('prettier ran successfully');
        resolve();
      } else {
        console.error(`prettier failed: ${code}`);
        reject();
      }
    });
  });
};

const main = async () => {
  await updateReadme();
  await copyReadme();
  await copyPackageReadmes();
  await runPrettier();
};

main().catch(console.error);
