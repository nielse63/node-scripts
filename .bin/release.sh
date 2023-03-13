#!/usr/bin/env bash
set -e

patch=
tag=

function release() {
  # checks
  branch=$(git rev-parse --abbrev-ref HEAD)
  if [ "$branch" != "main" ]; then
    echo "Can only release on branch 'main'"
    exit 1
  fi

  changes=$(git status --porcelain)
  echo "changes: $changes"
  if [ "$changes" != "" ]; then
    echo "Working directory is not clean"
    exit 1
  fi

  # pre-release checks
  npm run build
  npx eslint .
  npm test

  # read version
  if [ ! "$patch" ] && [ ! "$tag" ]; then
    echo ""
    echo -n "Version: "
    read -r tag
  fi

  # update package versions
  if [ $patch ]; then
    npm version patch
    version=$(grep '"version":' package.json)
    version=${version//  \"version\": \"/}
    version=${version//\",/}
    npm version patch --workspaces --no-git-tag-version --include-workspace-root=false
  else
    npm version "$tag" --workspaces --no-git-tag-version --include-workspace-root
  fi

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
}

# get args
if [ "$1" == "--patch" ]; then
  patch=true
elif [ "$1" ]; then
  tag="$1"
fi

release
