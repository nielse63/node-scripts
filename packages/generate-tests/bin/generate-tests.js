#!/usr/bin/env node
const { program } = require('commander');
const pkg = require('../package.json');
const { default: generateTests } = require('../dist/generate-tests');

program
  .option('-q, --quiet', 'Disable console output', false)
  .option('--debug', 'Print debug output', false)
  .argument('[files]', 'Glob pattern to src files', '**/src/**.{js,ts}')
  .description(pkg.description)
  .version(pkg.version)
  .parse(process.argv);

const [glob] = program.processedArgs;
const options = program.opts();

generateTests(process.cwd(), glob, options).catch(console.error);
