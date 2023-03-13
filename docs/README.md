# node-scripts

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/nielse63/node-scripts/node.js.yml?style=for-the-badge) ![Depfu](https://img.shields.io/depfu/dependencies/github/nielse63/node-scripts?style=for-the-badge) ![Codecov](https://img.shields.io/codecov/c/github/nielse63/node-scripts?style=for-the-badge) ![GitHub issues](https://img.shields.io/github/issues-raw/nielse63/node-scripts?style=for-the-badge) ![GitHub](https://img.shields.io/github/license/nielse63/node-scripts?style=for-the-badge)

> Collection of useful node scripts and utilities

## Packages

- [@nielse63/copy-env](https://github.com/nielse63/node-scripts/blob/main/packages/copy-env)
- [@nielse63/eslint-config](https://github.com/nielse63/node-scripts/blob/main/packages/eslint-config)
- [@nielse63/exec](https://github.com/nielse63/node-scripts/blob/main/packages/exec)
- [@nielse63/generate-tests](https://github.com/nielse63/node-scripts/blob/main/packages/copy-env)
- [@nielse63/prettier-config](https://github.com/nielse63/node-scripts/blob/main/packages/prettier-config)
- [@nielse63/tsconfig](https://github.com/nielse63/node-scripts/blob/main/packages/tsconfig)
- [@nielse63/tsconfig-eslint](https://github.com/nielse63/node-scripts/blob/main/packages/tsconfig-eslint)

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
