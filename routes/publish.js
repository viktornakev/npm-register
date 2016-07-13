'use strict'

const r = require('koa-router')()
const packages = require('../lib/packages')
const parse = require('co-body')
const middleware = require('../middleware')

// npm publish
r.put('/:name', middleware.auth, function * () {
  let pkg = yield parse(this)
  try {
    yield packages(this.metric).upload(pkg)
    this.body = yield packages(this.metric).get(pkg.name)
  } catch (err) {
    if (err === packages(this.metric).errors.versionExists) {
      this.body = {error: err.toString()}
      this.status = 409
    } else {
      throw err
    }
  }
})

module.exports = r
