# `@nielse63/tsconfig`

> Shared TypeScript config for basic projects

![npm (scoped)](https://img.shields.io/npm/v/@nielse63/tsconfig?style=for-the-badge) ![npm](https://img.shields.io/npm/dt/@nielse63/tsconfig?style=for-the-badge) ![GitHub issues by-label](https://img.shields.io/github/issues/nielse63/node-scripts/tsconfig?style=for-the-badge)

## Installation

```bash
npm install --save-dev @nielse63/tsconfig
```

## Usage

### `tsconfig.json`

```jsonc
{
  "extends": "@nielse63/tsconfig",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["./src/**/*.ts"]
}
```

See [`tsconfig.json`](https://github.com/nielse63/node-scripts/blob/main/configs/tsconfig/tsconfig.json) for all options.
