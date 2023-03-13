#!/usr/bin/env node
const { program } = require('commander');
const pkg = require('../package.json');
const { default: generateTests } = require('../dist/generate-tests');

program
  .option('-V, --verbose', 'Print debug output', false)
  .option('-D, --cwd', 'Current working directory', process.cwd())
  .argument('<glob>', 'Glob pattern of source files')
  .description(pkg.description)
  .version(pkg.version)
  .parse(process.argv);

const [glob] = program.processedArgs;
const options = program.opts();

generateTests({ glob, ...options }).catch(console.error);
