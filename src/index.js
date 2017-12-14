var GitHubApi = require('github')
var debug = require('debug')('make-empty-github-commit')

var getReferenceCommit = function (data) {
  return new Promise((resolve, reject) => {
    data.github.gitdata.getReference(
      {
        owner: data.owner,
        repo: data.repo,
        ref: data.fullyQualifiedRef
      },
      (err, res) => {
        if (err) {
          debug('getReferenceCommit', JSON.stringify(err, null, '  '))
          return reject(err)
        }
        const result = res.data.object
        return resolve(Object.assign(data, { referenceCommitSha: result.sha }))
      }
    )
  })
}

var getCommitData = function (data) {
  console.log('getting commit', data.referenceCommitSha)
  return new Promise((resolve, reject) => {
    data.github.repos.getCommit(
      {
        owner: data.owner,
        repo: data.repo,
        sha: data.referenceCommitSha
      },
      (err, res) => {
        if (err) {
          debug('getCommitData', JSON.stringify(err, null, '  '))
          return reject(err)
        }
        const result = res.data
        return resolve(Object.assign(data, { tree: result.commit.tree.sha }))
      }
    )
  })
}

var createCommit = function (data) {
  console.log('creating commit')
  return new Promise((resolve, reject) => {
    data.github.gitdata.createCommit(
      {
        owner: data.owner,
        repo: data.repo,
        message: data.commitMessage,
        tree: data.tree,
        parents: [data.referenceCommitSha]
      },
      (err, res) => {
        if (err) {
          debug('createCommit', JSON.stringify(err, null, '  '))
          return reject(err)
        }
        console.log('new commit sha', res.data.sha)
        return resolve(Object.assign(data, { newCommitSha: res.data.sha }))
      }
    )
  })
}

var updateReference = function (data) {
  console.log('updating reference')
  return new Promise((resolve, reject) => {
    data.github.gitdata.updateReference(
      {
        owner: data.owner,
        repo: data.repo,
        ref: data.fullyQualifiedRef,
        sha: data.newCommitSha,
        force: data.forceUpdate
      },
      (err, res) => {
        if (err) {
          debug('updateReference', JSON.stringify(err, null, '  '))
          return reject(err)
        }
        return resolve(res.data)
      }
    )
  })
}

function emptyGitHubCommit (opts) {
  opts = opts || {}
  if (!opts.owner || !opts.repo) {
    const e = new Error('missing owner or repo')
    return Promise.reject(e)
  }
  var data = {}
  data.github = new GitHubApi()
  if (opts.token) {
    data.github.authenticate({
      type: 'oauth',
      token: opts.token
    })
  }
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

  return new Promise((resolve, reject) => {
    getReferenceCommit(data)
      .then(getCommitData)
      .then(createCommit)
      .then(updateReference)
      .then(data => {
        console.log('new commit SHA', data.object.sha)
        resolve({ sha: data.object.sha })
      })
      .catch(error => reject(error))
  })
}

module.exports = emptyGitHubCommit

if (!module.parent) {
  console.log('demo commit')
  emptyGitHubCommit({
    owner: 'bahmutov',
    repo: 'commit-to-github',
    token: process.env.TOKEN,
    branch: 'master'
  }).then(console.log, e => {
    console.error(e)
    process.exit(1)
  })
}
