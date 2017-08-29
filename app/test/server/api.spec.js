/* global describe, it, */
const request = require('supertest')
const should = require('should') // eslint-disable-line
const app = require('../../app.js')
const version = require('../../package.json').version

describe('/api/version', function () {
  this.timeout(10000)

  it(`should return version ${version}`, (done) => {
    request(app).get('/api/version')
    .expect(200)
    .expect('Content-Type', /text/)
    .end((err, res) => {
      res.text.should.be.equal(version)
      done()
    })
  })
})
