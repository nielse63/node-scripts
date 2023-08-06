#!/usr/bin/env node
const { program } = require('commander');
const pkg = require('./package.json');
const trash = require('./dist/cjs');

program
  .option('--cwd <string>', 'current working directory')
  .option('--trash <string>', 'path to trash folder')
  .argument('<arg>', 'Required arg')
  .description(pkg.description)
  .version(pkg.version)
  .parse(process.argv);

const args = program.processedArgs;
const options = program.opts();

trash(args, { ...options }).catch(console.error);
