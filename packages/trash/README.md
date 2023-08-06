# `@nielse63/trash`

> Move files to trash (instead of rm -rf)

![npm (scoped)](https://img.shields.io/npm/v/@nielse63/trash?style=for-the-badge) ![npm](https://img.shields.io/npm/dt/@nielse63/trash?style=for-the-badge) ![GitHub issues by-label](https://img.shields.io/github/issues/nielse63/node-scripts/trash?style=for-the-badge)

## Installation

```bash
npm install --save @nielse63/trash
```

## Usage

### CLI

```bash
$ trash --help

Usage: trash [options] <arguments>

Move files to trash (instead of rm -rf)

Arguments:
  ...

Options:
  -V, --version  output the version number
  -h, --help     display help for command
```

### API

```js
import trash from '@nielse63/trash';

const results = await trash(['file.md', 'directory'], {
  cwd: process.cwd(),
  trash: path.join(os.homedir(), '.Trash'),
});

// results:
// [
//   {
//     "old": "/path/to/file.md",
//     "new": "/Users/username/.Trash/file_1691311838573_dUGBD6dd.md"
//   },
//   {
//     "old": "/path/to/directory",
//     "new": "/Users/username/.Trash/directory_1691311838573_nsRcsJWf"
//   }
// ]
```
