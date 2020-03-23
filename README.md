# make-empty-github-commit ![CI status](https://github.com/bahmutov/make-empty-github-commit/workflows/ci/badge.svg?branch=master)

> Makes a new empty commit on GitHub using API

[![NPM][npm-icon] ][npm-url]

[![semantic-release][semantic-image] ][semantic-url]
[![js-standard-style][standard-image]][standard-url]

## Install

Requires [Node](https://nodejs.org/en/) version 6 or above.

```sh
npm install --save make-empty-github-commit
```

## Use

### CLI

From command line

```
$(npm bin)/empty-commit --repo <username/repo> --message "Empty commit message"
```

You can pass repo in different format, it will be parsed using
[parse-github-repo-url](https://github.com/repo-utils/parse-github-repo-url).

Optional arguments:

```
--branch <master>
```

Aliases: `--repo -r`, `--message -m`, `--branch -b`

For authentication, set environment variable with your GitHub personal token
under name `TOKEN`, `GH_TOKEN` or `GITHUB_TOKEN`

### API

```js
const emptyGitHubCommit = require('make-empty-github-commit')
emptyGitHubCommit({
  owner: 'username',
  repo: 'repo name',
  token: process.env.TOKEN,
  message: 'my message',
  branch: 'develop' // "master" is default
}).then(console.log, e => {
  console.error(e)
  process.exit(1)
})
```

Resolves with an object with at least `sha` property of the new commit.

Uses [http://mikedeboer.github.io/node-github](http://mikedeboer.github.io/node-github)
to make API calls.

### Testing

To test this project I created dummy repo
[test-make-empty-github-commit](https://github.com/bahmutov/test-make-empty-github-commit).
See its [commit history](https://github.com/bahmutov/test-make-empty-github-commit/commits/master)
to see empty commit messages created from this repository using
tests in [test](test) folder.

### Debugging

Run the tool with environment variable `DEBUG=make-empty-github-commit`

## Related

This code started as a fork of [commit-to-github](https://www.npmjs.com/package/commit-to-github),
but was simplified for creating just empty commits.

### Small print

Author: Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt; &copy; 2017

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](https://glebbahmutov.com)
* [blog](https://glebbahmutov.com/blog)

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/make-empty-github-commit/issues) on Github

## MIT License

Copyright (c) 2017 Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt;

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[npm-icon]: https://nodei.co/npm/make-empty-github-commit.svg?downloads=true
[npm-url]: https://npmjs.org/package/make-empty-github-commit
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/
