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
