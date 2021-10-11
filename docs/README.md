# node-scripts

[![node](https://github.com/nielse63/node-scripts/actions/workflows/node.js.yml/badge.svg)](https://github.com/nielse63/node-scripts/actions/workflows/node.js.yml) ![David](https://img.shields.io/david/nielse63/node-scripts) [![codecov](https://codecov.io/gh/nielse63/node-scripts/branch/main/graph/badge.svg?token=MENKEMT7YA)](https://codecov.io/gh/nielse63/node-scripts)

> Collection of useful node scripts and utilities

## Packages

- [@nielse63/helpers](../packages/helpers/)
- [@nielse63/copy-env](../packages/copy-env/)
- [@nielse63/generate-tests](../packages/generate-tests/)

## Usage

Install the individual package or packages you want to use in your project. See the packages for individual usage and documentation.

## Development

```
git clone https://github.com/nielse63/node-scripts.git
cd node-scripts
nvm use
npm ci
```

After making desired changes and writing the required tests:

```
npm run build
npm run lint
npm test
```

The commit and push the changes to your branch and open a new pull request.
