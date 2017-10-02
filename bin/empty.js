#!/usr/bin/env node

const token =
  process.env.TOKEN || process.env.GITHUB_TOKEN || process.env.GH_TOKEN
if (!token) {
  console.error('Cannot find TOKEN or GITHUB_TOKEN or GH_TOKEN')
  process.exit(1)
}

const parse = require('parse-github-repo-url')
const options = require('minimist')(process.argv, {
  alias: {
    repo: 'r',
    message: 'm',
    branch: 'b'
  },
  default: {
    branch: 'master'
  }
})
const emptyGitHubCommit = require('..')

if (!options.repo || !options.message) {
  console.log(
    'usage: empty-commit --repo <github repo> --message <commit message>'
  )
  console.log('optional args')
  console.log('  --branch <master>')
  process.exit(1)
}
console.log('Making empty commit in', options.repo)
console.log('message:', options.message)
console.log('branch:', options.branch)

const parsed = parse(options.repo)
const user = parsed[0]
const repo = parsed[1]
if (!user || !repo) {
  console.error('Could not parse GitHub repo', options.repo)
  process.exit(1)
}

emptyGitHubCommit({
  owner: user,
  repo: repo,
  token: token,
  fullyQualifiedRef: `heads/${options.branch}`
}).then(console.log, e => {
  console.error(e)
  process.exit(1)
})
