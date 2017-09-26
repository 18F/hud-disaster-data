/* global describe, it, */
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
    const locales = ['a', 'b']
    const stub = sinon.stub(requestpromise, 'get').callsFake(opts => {
      should.exist(opts.url)
      if (/users/.test(opts.url)) return new Promise(resolve => resolve(USERS.GRANTEE))
      return new Promise(resolve => resolve(locales))
    })
    request(app).get('/api/states/ia/congrdist?disasterId=4289')
    .expect(function (res) {
      const body = res.body
      body.should.be.an.Array()
      body[0].should.equal(locales[0])
      stub.restore()
      process.env.DRDP_LOCAL = true
    })
    .expect(200)
    .expect('Content-Type', /json/, done)

  })
})
