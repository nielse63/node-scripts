# `@nielse63/reset`

> Quickly clean your project of unwanted files and folders

![npm (scoped)](https://img.shields.io/npm/v/@nielse63/reset?style=for-the-badge) ![npm](https://img.shields.io/npm/dt/@nielse63/reset?style=for-the-badge) ![GitHub issues by-label](https://img.shields.io/github/issues/nielse63/node-scripts/reset?style=for-the-badge)

## Installation

```bash
npm install --save @nielse63/reset
```

## Usage

### CLI

```bash
$ reset --help

Usage: reset [options] <arguments>

Quickly clean your project of unwanted files and folders

Arguments:
  ...

Options:
  -V, --version  output the version number
  -h, --help     display help for command
```

### API

```js
import reset from '@nielse63/reset';

const results = await reset({
  // ...
});

// results:
// [
//    {
//      // ...
//    }
//  ]
```
