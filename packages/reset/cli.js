#!/usr/bin/env node
const { program } = require('commander');
const pkg = require('./package.json');
const { default: reset } = require('./dist');

program
  .option('--paths <paths...>', 'paths to remove')
  .option('--config [config]', 'config file to use', 'reset.config.js')
  // .option('--gitignore', 'use .gitignore as a source of paths to remove')
  .description(pkg.description)
  .version(pkg.version)
  .parse(process.argv);

const options = program.opts();

reset({ ...options }).catch(console.error);
