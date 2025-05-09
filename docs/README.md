<!-- THIS FILE HAS BEEN AUTOGENERATED - DO NOT UPDATE IT DIRECTLY -->
<!-- EDIT .bin/templates/README.md.hbs INSTEAD -->

# node-scripts

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/nielse63/node-scripts/node.js.yml?style=for-the-badge) ![Depfu](https://img.shields.io/depfu/dependencies/github/nielse63/node-scripts?style=for-the-badge) ![Codecov](https://img.shields.io/codecov/c/github/nielse63/node-scripts?style=for-the-badge) ![GitHub issues by-label](https://img.shields.io/github/issues-raw/nielse63/node-scripts/bug?label=open%20issues&style=for-the-badge) ![GitHub](https://img.shields.io/github/license/nielse63/node-scripts?style=for-the-badge)

> Collection of useful node scripts and utilities

## Packages

| Package | Description |
| --- | --- |
| [@nielse63/eslint-config](https://github.com/nielse63/node-scripts/blob/main/packages/eslint-config) | Shared eslint-config |
| [@nielse63/exec](https://github.com/nielse63/node-scripts/blob/main/packages/exec) | Run child process asynchronously |
| [@nielse63/generate-tests](https://github.com/nielse63/node-scripts/blob/main/packages/generate-tests) | Automatically generate jest specs for uncovered source files |
| [@nielse63/is-numeric](https://github.com/nielse63/node-scripts/blob/main/packages/is-numeric) | Determines if a given value is a number (even if it's a string) |
| [@nielse63/prettier-config](https://github.com/nielse63/node-scripts/blob/main/packages/prettier-config) | Shared prettier config |
| [@nielse63/reset](https://github.com/nielse63/node-scripts/blob/main/packages/reset) | Quickly clean your project of unwanted files and folders |
| [@nielse63/trash](https://github.com/nielse63/node-scripts/blob/main/packages/trash) | Move files to trash (instead of rm -rf) |
| [@nielse63/tsconfig](https://github.com/nielse63/node-scripts/blob/main/packages/tsconfig) | Shared TypeScript config for basic projects |
| [@nielse63/tsconfig-eslint](https://github.com/nielse63/node-scripts/blob/main/packages/tsconfig-eslint) | Shareable TypeScript config to be used with ESLint |

## Usage

Install the individual package or packages you want to use in your project. See the [packages](#packages) for individual usage and documentation.

## Contributing

### Setting Up

```bash
git clone https://github.com/nielse63/node-scripts.git
cd node-scripts
nvm use
npm ci

# create a new branch
git checkout scratch/my-awesome-feature
```

### Development

Make your desired changes and run the tests:

```bash
npm run build
npm run lint
npm test
```

The commit and push the changes to your branch and open a new pull request.

### Releasing

```bash
npm run release
```

## Roadmap

See GitHub issues: [https://github.com/nielse63/node-scripts/issues](https://github.com/nielse63/node-scripts/issues).
