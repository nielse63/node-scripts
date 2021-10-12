# `@nielse63/generate-tests`

> Automatically generate jest specs for uncovered source files

## Installation

```bash
npm -g i @nielse63/generate-tests
```

## Usage

### CLI

```bash
$ generate-tests --help

Usage: generate-tests [options] [files]

Automatically generate jest specs for uncovered source files

Arguments:
  files          Glob pattern to src files (default: "**/src/**.{js,ts}")

Options:
  -q, --quiet    Disable console output (default: false)
  --debug        Print debug output (default: false)
  -V, --version  output the version number
  -h, --help     display help for command
```

### API

```js
import generateTests from '@nielse63/generate-tests';

const path = '/path/to/project';
const pattern = '**/src/**.{js,ts}';
const options = {
  quiet: false,
  debug: false,
};

await generateTests(path, pattern, options);
```
