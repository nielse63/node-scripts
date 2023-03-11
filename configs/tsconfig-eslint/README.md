# `@nielse63/tsconfig-eslint`

> Shareable TypeScript config to be used with ESLint

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

Update your `.eslintrc.js` file:

```js
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./node_modules/@nielse63/tsconfig-eslint/tsconfig.json'],
  },
};
```
