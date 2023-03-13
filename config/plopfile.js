const path = require('path');
const fg = require('fast-glob');
const uniq = require('lodash/uniq');
const kebabCase = require('lodash/kebabCase');
const cp = require('child_process');

const templates = path.resolve(__dirname, '../.bin/templates/package');
const packages = path.resolve(__dirname, '../packages');

module.exports = (plop) => {
  /** @type {import('plop').NodePlopAPI} */

  plop.setActionType('npmInstall', (_, config) => {
    const {
      dependencies = [],
      devDependencies = [],
      flags = [],
      path: cwd = process.cwd(),
    } = config;
    const root = path.resolve(__dirname, '..');
    const args = ['install', ...flags];
    if (dependencies) {
      args.push(...dependencies, '--save');
    } else if (devDependencies) {
      args.push(...devDependencies, '--save-dev');
    }
    args.push('--workspace', path.relative(root, cwd));
    return new Promise((resolve, reject) => {
      cp.execFile('npm', args, { cwd: root }, (error, stdout, stderr) => {
        if (error) {
          return reject(stderr);
        }
        resolve(stdout);
      });
    });
  });

  plop.setActionType('prettier', (_, config) => {
    const { path: cwd } = config;
    console.log(`npx prettier --write ${cwd}`);
    return new Promise((resolve, reject) => {
      cp.execFile(
        'npx',
        ['npx', 'prettier', '--write', cwd],
        (error, stdout, stderr) => {
          if (error) {
            return reject(stderr);
          }
          resolve(stdout);
        }
      );
    });
  });

  plop.setGenerator('package', {
    description: 'Generate a new package',
    prompts: [
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
            version: '0.0.1',
            keywords: uniq(keywords)
              .map((keyword) => `"${keyword}"`)
              .join(',\n    '),
          },
        };
      });

      if (data.cli) {
        actions.push(
          {
            type: 'add',
            path: path.join(packages, '{{kebabCase name}}/cli.js'),
            templateFile: path.join(templates, 'cli.js.hbs'),
            abortOnFail: true,
          },
          {
            type: 'npmInstall',
            path: path.join(packages, kebabCase(data.name)),
            dependencies: ['commander'],
          }
        );
      }

      // run prettier
      actions.push({
        type: 'prettier',
        path: path.join(packages, kebabCase(data.name)),
      });

      return actions;
    },
  });
};
