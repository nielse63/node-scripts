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

Usage: trash [options] <files...>

Move files to trash (instead of rm -rf)

Arguments:
  files             files/directories to move to trash

Options:
  --cwd <string>    current working directory
  --trash <string>  path to trash folder
  -V, --version     output the version number
  -h, --help        display help for command

Example:
  trash --cwd custom/working/directory folder1 nested/path/to/file
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
//     "src": "/path/to/file.md",
//     "dest": "/Users/username/.Trash/file_1691311838573_dUGBD6dd.md"
//   },
//   {
//     "src": "/path/to/directory",
//     "dest": "/Users/username/.Trash/directory_1691311838573_nsRcsJWf"
//   }
// ]
```
