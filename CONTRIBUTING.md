# Contributing

## Setting Up

```bash
git clone https://github.com/nielse63/node-scripts.git
cd node-scripts
nvm use
npm ci

# create a new branch
git checkout scratch/my-awesome-feature
```

## Development

Make your desired changes and run the tests:

```bash
npm run build
npm run lint
npm test
```

The commit and push the changes to your branch and open a new pull request.

## Releasing

```bash
npm run release
```

## Branching

After cloning, create a new branch off `master` and make your changes. **No changes should be made directly to master.**

## Pull Requests

After making your changes, push your branch and open a [pull request](https://github.com/nielse63/node-scripts/pulls).

## Creating Issues

Issues can be tracked and created here - [https://github.com/nielse63/node-scripts/issues](https://github.com/nielse63/node-scripts/issues)
