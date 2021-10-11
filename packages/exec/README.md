# `@nielse63/exec`

> Run child process asynchronously

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
