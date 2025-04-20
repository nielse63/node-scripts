# `@nielse63/is-numeric`

> Determines if a given value is a number (even if it's a string)

![npm (scoped)](https://img.shields.io/npm/v/@nielse63/is-numeric?style=for-the-badge) ![npm](https://img.shields.io/npm/dt/@nielse63/is-numeric?style=for-the-badge) ![GitHub issues by-label](https://img.shields.io/github/issues/nielse63/node-scripts/is-numeric?style=for-the-badge)

## Installation

```bash
npm install --save @nielse63/is-numeric
```

## Usage

### API

```js
import isNumeric from '@nielse63/is-numeric';

isNumeric('1'); // true
isNumeric(1); // true
isNumeric(null); // false
isNumeric({}); // false
```
