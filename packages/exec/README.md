# `@nielse63/exec`

> Run child process asynchronously

![npm (scoped)](https://img.shields.io/npm/v/@nielse63/exec?style=for-the-badge) ![npm](https://img.shields.io/npm/dt/@nielse63/exec?style=for-the-badge) ![GitHub issues by-label](https://img.shields.io/github/issues/nielse63/node-scripts/exec?style=for-the-badge)

## Installation

```bash
npm install --save @nielse63/exec
```

## Usage

```js
import exec from '@nielse63/exec';

exec('echo "howdy!"').catch(console.error);
```

CommonJS:

```js
const exec = require('@nielse63/exec').default;

exec('echo "howdy!"').catch(console.error);
```
