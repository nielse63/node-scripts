const path = require('path');
const fg = require('fast-glob');
const uniq = require('lodash/uniq');
const { version } = require('../lerna.json');

const templates = path.resolve(__dirname, '../.bin/templates');

module.exports = (plop) => {
  /** @type {import('plop').NodePlopAPI} */

  plop.setGenerator('controller', {
    description: 'application controller logic',
    prompts: [
      {
        type: 'list',
        name: 'type',
        message: 'Package Type',
        choices: [
          { name: 'Package', value: 'package', checked: true },
          { name: 'Config', value: 'config' },
        ],
      },
      {
        type: 'input',
        name: 'name',
        message: 'Package name',
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description',
      },
      {
        type: 'input',
        name: 'keywordsString',
        message: 'Keywords',
      },
      {
        type: 'confirm',
        name: 'cli',
        message: 'Add CLI',
        default: false,
      },
    ],
    actions: (data) => {
      console.log(data);
      const packages = path.resolve(__dirname, '..', `${data.type}s`);
      // console.log(packages);
      // return [];
      const files = fg
        .sync([path.join(templates, '**/*.hbs')], { dot: true })
        .filter((file) => !file.endsWith('cli.js.hbs'));
      const keywords = data.keywordsString
        .split(',')
        .map((keyword) => keyword.trim())
        .filter(Boolean)
        .concat('utils', 'helpers', 'utility', 'utilities');
      if (data.cli) {
        keywords.push('cli');
      }
      const actions = files.map((file) => {
        const relpath = file
          .replace(templates, '')
          .replace(/^\//, '')
          .replace(/\.hbs$/, '');
        return {
          type: 'add',
          path: path.join(packages, '{{kebabCase name}}', relpath),
          templateFile: file,
          abortOnFail: true,
          data: {
            version,
            keywords: uniq(keywords)
              .map((keyword) => `"${keyword}"`)
              .join(',\n    '),
          },
        };
      });

      if (data.cli) {
        actions.push({
          type: 'add',
          path: path.join(packages, '{{kebabCase name}}/cli.js'),
          templateFile: path.join(templates, 'cli.js.hbs'),
          abortOnFail: true,
        });
      }

      console.log(actions);
      return actions;
    },
  });
};
