# `@nielse63/eslint-config`

> Shared eslint-config

## Installation

```bash
npm install --save @nielse63/eslint-config
```

## Usage

### CLI

```bash
$ eslint-config --help

Usage: eslint-config [options] <arguments>

Shared eslint-config

Arguments:
  ...

Options:
  -V, --version  output the version number
  -h, --help     display help for command
```

### API

```js
import generateTests from '@nielse63/eslint-config';

const results = await generateTests({
  cwd: '/path/to/project',
  glob: '**/src/**.{js,ts}',
  verbose: true,
});

// results:
// [
//       {
//         file: 'src/file.js',
//         abspath: '/path/to/project/src/file.js',
//         testpath: '/path/to/project/src/__tests__/file.spec.js',
//         basename: 'file.js',
//         classname: 'file'
//       }
//     ]
```
