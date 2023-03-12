# `@nielse63/tsconfig`

> Shared TypeScript config for basic projects

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
