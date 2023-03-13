#!/usr/bin/env node
const fg = require('fast-glob');
const fs = require('fs');

const main = async () => {
  const files = await fg(['packages/*/dist/cjs/**/*.js'], {
    ignore: ['node_modules'],
  });
  const promises = files.map(async (file) => {
    const content = fs.promises.readFile(file, 'utf-8');
    const newContent = (await content).replace(
      /exports\.default/g,
      'module.exports'
    );
    await fs.promises.writeFile(file, newContent);
  });
  await Promise.all(promises);
};

main().catch(console.error);
