#!/bin/bash

set -o errexit -o nounset

rev=$(git rev-parse --short HEAD)

cd build

git init
git config user.name "jeetiss"
git config user.email "za5rubley@gmail.com"

git remote add upstream "https://$GH_TOKEN@github.com/jeetiss/madskillz.git"
git fetch upstream
git reset upstream/gh-pages

touch .

git add -A .
git commit -m "rebuild pages at ${rev}"
git push -q upstream HEAD:gh-pages