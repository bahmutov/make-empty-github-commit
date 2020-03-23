'use strict'

const la = require('lazy-ass')
const is = require('check-more-types')
const makeEmptyGithubCommit = require('..')

/* eslint-env mocha */
describe('make-empty-github-commit', () => {
  // to work, requires GitHub token set via an environment variable
  // usually this token is set as part of semantic release setup
  const token =
    process.env.TOKEN || process.env.GITHUB_TOKEN || process.env.GH_TOKEN

  if (token) {
    it('adds empty commit', function () {
      this.timeout(10000)
      if (!token) {
        throw new Error('Cannot find TOKEN or GITHUB_TOKEN or GH_TOKEN')
      }

      return makeEmptyGithubCommit({
        owner: 'bahmutov',
        repo: 'test-make-empty-github-commit',
        message: 'this is a test',
        token: token
      }).then(result => {
        la(is.commitId(result.sha), 'expected to find sha in', result)
      })
    })
  }
})
