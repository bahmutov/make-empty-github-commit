#!/usr/bin/env node

const parse = require('parse-github-repo-url')
const emptyGitHubCommit = require('..')

const token = process.env.TOKEN || process.env.GITHUB_TOKEN
if (!token) {
  console.error('Cannot find TOKEN or GITHUB_TOKEN')
  process.exit(1)
}
const repoWhat = process.argv[2]
const message = process.argv[3]
if (!repoWhat || !message) {
  repoWhat.log('usage: empty-commit <repo url> <commit message>')
  process.exit(1)
}
console.log('Making empty commit in', repoWhat)
console.log('message:', message)

const parsed = parse(repoWhat)
const user = parsed[0]
const repo = parsed[1]
if (!user || !repo) {
  console.error('Could not parse repo', repoWhat)
  process.exit(1)
}

emptyGitHubCommit({
  owner: user,
  repo: repo,
  token: process.env.TOKEN,
  fullyQualifiedRef: 'heads/master'
}).then(console.log, e => {
  console.error(e)
  process.exit(1)
})
