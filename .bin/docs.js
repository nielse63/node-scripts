#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

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
  const dirs = await fs.promises.readdir(packagesDir);
  return dirs.filter((dir) => {
    const stat = fs.statSync(path.join(packagesDir, dir));
    return stat.isDirectory();
  });
};

const copyPackageReadmes = async () => {
  const packages = await getPackages();
  const readmes = packages
    .map((dir) => {
      return path.join(packagesDir, dir, 'README.md');
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
  const packagesList = packages
    .map((pkg) => {
      return `- [@nielse63/${pkg}](https://github.com/nielse63/node-scripts/blob/main/packages/${pkg})`;
    })
    .join('\n');
  const newContent = content.replace(/{{packagesList}}/g, packagesList);
  console.log('updating README.md');
  await fs.promises.writeFile(path.join(root, 'README.md'), newContent);
};

const copyReadme = async () => {
  console.log(`cp README.md -> docs/README.md`);
  const src = path.join(root, 'README.md');
  const dest = path.join(root, 'docs/README.md');
  await fs.promises.copyFile(src, dest);
};

const main = async () => {
  await updateReadme();
  await copyReadme();
  await copyPackageReadmes();
};

main().catch(console.error);
