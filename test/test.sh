#!/usr/bin/env bash

set -e

node bin/empty.js \
  --repo bahmutov/test-make-empty-github-commit \
  --message "empty commit message from build $TRAVIS_BUILD_NUMBER"
