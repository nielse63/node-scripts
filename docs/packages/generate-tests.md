# `@nielse63/generate-tests`

> Automatically generate jest specs for uncovered source files

![npm (scoped)](https://img.shields.io/npm/v/@nielse63/generate-tests?style=for-the-badge) ![npm](https://img.shields.io/npm/dt/@nielse63/generate-tests?style=for-the-badge) ![GitHub issues by-label](https://img.shields.io/github/issues/nielse63/node-scripts/generate-tests?style=for-the-badge)

## Installation

```bash
npm -g i @nielse63/generate-tests
```

## Usage

### CLI

```bash
$ generate-tests --help

Usage: generate-tests [options] <glob>

Automatically generate jest specs for uncovered source files

Arguments:
  glob           Glob pattern of source files

Options:
  -v, --verbose  Print debug output (default: false)
  -D, --cwd      Current working directory
  -V, --version  output the version number
  -h, --help     display help for command
```

### API

```js
import generateTests from '@nielse63/generate-tests';

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
