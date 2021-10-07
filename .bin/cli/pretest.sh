#!/usr/bin/env bash
set -e

files=( "README.md" "package.json" )
cli_dir=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$cli_dir"

# remove and copy files
for file in "${files[@]}"
do
  rm -f "__tests__/fake-repo/$file"
  cp "../../$file" "__tests__/fake-repo/$file"
done
