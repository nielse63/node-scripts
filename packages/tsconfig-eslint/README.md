# `@nielse63/tsconfig-eslint`

> Shareable TypeScript config to be used with ESLint

![npm (scoped)](https://img.shields.io/npm/v/@nielse63/tsconfig-eslint?style=for-the-badge) ![npm](https://img.shields.io/npm/dt/@nielse63/tsconfig-eslint?style=for-the-badge) ![GitHub issues by-label](https://img.shields.io/github/issues/nielse63/node-scripts/tsconfig-eslint?style=for-the-badge)

## Installation

```bash
npm install --save-dev \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  eslint \
  typescript \
  @nielse63/tsconfig-eslint
```

## Usage

Create a file called `tsconfig.eslint.json` in your project root with the following content:

```jsonc
{
  "extends": "@nielse63/tsconfig-eslint",
  // you can customize your include and exclude values
  "include": ["**/*.ts", "**/*.js", ".*.js", ".bin/**/*"],
  "exclude": ["**/node_modules/**", "**/dist/**"]
}
```

Update your `.eslintrc.js` file:

```js
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.eslint.json'],
  },
};
```
