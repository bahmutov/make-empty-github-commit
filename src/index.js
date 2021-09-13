var { Octokit } = require('@octokit/rest')
var debug = require('debug')('make-empty-github-commit')

var getReferenceCommit = async function (data) {
  const res = await data.octokit.rest.git.getRef({
    owner: data.owner,
    repo: data.repo,
    ref: data.fullyQualifiedRef
  })

  return Object.assign(data, { referenceCommitSha: res.data.object.sha })
}

var getCommitData = async function (data) {
  const res = await data.octokit.rest.git.getCommit({
    owner: data.owner,
    repo: data.repo,
    commit_sha: data.referenceCommitSha
  })

  console.log('commit data:', res.data)

  return Object.assign(data, { tree: res.data.tree.sha })
}

var createCommit = async function (data) {
  const res = await data.octokit.rest.git.createCommit({
      owner: data.owner,
      repo: data.repo,
      message: data.commitMessage,
      tree: data.tree,
      parents: [data.referenceCommitSha]
    })

  console.log('new commit sha', res.data.sha)
  return Object.assign(data, { newCommitSha: res.data.sha })
}

var updateReference = async function (data) {
  const res = await data.octokit.rest.git.updateRef({
    owner: data.owner,
    repo: data.repo,
    ref: data.fullyQualifiedRef,
    sha: data.newCommitSha,
    force: data.forceUpdate
  })

  return res.data
}

function emptyGitHubCommit (opts) {
  opts = opts || {}
  if (!opts.owner || !opts.repo) {
    const e = new Error('missing owner or repo')
    return Promise.reject(e)
  }
  var data = {}
  data.octokit = new Octokit({
    auth: opts.token
  })
  data.owner = opts.owner
  data.repo = opts.repo

  if (opts.branch) {
    data.fullyQualifiedRef = `heads/${opts.branch}`
  } else {
    const defaultRef = 'heads/master'
    data.fullyQualifiedRef = opts.fullyQualifiedRef || defaultRef
  }

  data.forceUpdate = opts.forceUpdate || false
  data.commitMessage =
    opts.message ||
    opts.commitMessage ||
    'AutoCommit - ' + new Date().getTime().toString()

  return getReferenceCommit(data)
    .then(getCommitData)
    .then(createCommit)
    .then(updateReference)
    .then(data => {
      console.log('new commit SHA', data.object.sha)
      return { sha: data.object.sha }
    })
}

module.exports = emptyGitHubCommit

if (!module.parent) {
  console.log('demo commit')
  emptyGitHubCommit({
    owner: 'bahmutov',
    repo: 'make-empty-github-commit',
    token: process.env.TOKEN,
    branch: 'test-branch'
  }).then(console.log, e => {
    console.error(e)
    process.exit(1)
  })
}
