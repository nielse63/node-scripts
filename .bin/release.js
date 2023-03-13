#!/usr/bin/env node
// const npm = require('npm');
// const fs = require('fs');
// const path = require('path');
const exec = require('@nielse63/exec');

const getBranch = async () => {
  return exec('git rev-parse --abbrev-ref HEAD');
};

const getIsWorkingDirectoryClean = async () => {
  const output = await exec('git status --porcelain');
  return !!output.split('\n').length;
};

const main = async () => {
  const branch = await getBranch();
  const isWorkingDirectoryClean = await getIsWorkingDirectoryClean();
  console.log({ branch, isWorkingDirectoryClean });
};

main().catch(console.error);
// set -e

// # checks
// branch=$(git rev-parse --abbrev-ref HEAD)
// if [ "$branch" != "main" ]; then
//   echo "Can only release on branch 'main'"
//   exit 1
// fi

// # pre-release checks
// npm run build
// npm run lint
// npm test

// # read version
// echo ""
// echo -n "Version: "
// read -r tag

// # create git tag
// git tag "v$tag" -m "Release v$tag"

// # publish to npm
// npm version "$tag" --workspaces --no-git-tag-version --include-workspace-root
// git add .
// git commit -m "Release v$tag"
// npm publish --workspaces

// # push to repo
// git push --follow-tags

// # create a github release
//  gh release create "v$tag" --generate-notes
