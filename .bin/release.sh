#!/usr/bin/env bash
set -e

# checks
branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$branch" != "main" ]; then
  echo "Can only release on branch 'main'"
  exit 1
fi

changes=$(git rev-parse --abbrev-ref HEAD)
if [ "$changes" != "" ]; then
  echo "Working directory is not clean"
  exit 1
fi

# pre-release checks
npm run build
npx eslint .
npm test

# read version
echo ""
echo -n "Version: "
read -r tag

# update package versions
npm version "$tag" --workspaces --no-git-tag-version --include-workspace-root

# create git tag
git tag "v$tag" -m "Release v$tag"

# generate changelog
npx generate-changelog --allow-unknown

# push to remote
git add .
git commit -m "Release: v$tag"
git push --follow-tags

# publish to npm
npm publish --workspaces

# create a github release
gh release create "v$tag" --generate-notes
