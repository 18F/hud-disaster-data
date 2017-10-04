/* global describe, it, */
const _ = require('lodash')
const request = require('supertest')
const should = require('should') // eslint-disable-line
const app = require('../../app.js')
const USERS = require('../../lib/middleware/auth').TEST_USERS
const requestpromise = require('request-promise')
const sinon = require('sinon')

describe('/states/:stateId/:localeType', function () {
  this.timeout(10000)

  it('should return nothing if not specifying a valid disasterId', (done) => {
    request(app).get('/api/states/wi/city?disasterId=45269')
    .expect(function (res) {
      const body = res.body
      body.should.be.an.Array().and.should.be.empty
    })
    .expect(200)
    .expect('Content-Type', /json/, done)
  })

  it('should return data if specifying a valid disasterId', (done) => {
    request(app).get('/api/states/ia/congrdist?disasterId=4289')
    .expect(function (res) {
      const body = res.body
      body.should.be.an.Array()
      body[0].should.not.be.empty
    })
    .expect(200)
    .expect('Content-Type', /json/, done)
  })

  it('should call hudApi.getLocales if DRDP_LOCAL is not set', (done) => {
    delete process.env.DRDP_LOCAL
    const locales = [{name:'a'}, {name:'b'}]
    const stub = sinon.stub(requestpromise, 'get').callsFake(opts => {
      should.exist(opts.url)
      if (/users/.test(opts.url)) return new Promise(resolve => resolve(USERS.GRANTEE))
      return new Promise(resolve => resolve(locales))
    })
    request(app).get('/api/states/ia/congrdist?disasterId=4289')
    .expect(function (res) {
      const body = res.body
      body.should.be.an.Array()
      body[0].should.equal(_.map(locales,'name')[0])
      stub.restore()
      process.env.DRDP_LOCAL = true
    })
    .expect(200)
    .expect('Content-Type', /json/, done)
  })

  it('should handle error returned by hudApi.getLocales', (done) => {
    delete process.env.DRDP_LOCAL
    const stub = sinon.stub(requestpromise, 'get').callsFake((resolve, reject) => {
      return new Promise((resolve, reject) => reject())
    })
    request(app).get('/api/states/ia/congrdist')
    .expect(function (res) {
      const error = res.error
      error.message.should.be.equal('cannot GET /api/states/ia/congrdist (404)')
      stub.restore()
      process.env.DRDP_LOCAL = true
    })
    .expect(404)
    .expect('Content-Type', /text/, done)
  })
})
