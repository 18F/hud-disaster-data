/* global describe, it, */
const async = require('async')
const request = require('supertest')
const should = require('should') // eslint-disable-line
const app = require('../../app.js')
const requestpromise = require('request-promise')
const sinon = require('sinon')
const _ = require('lodash')
const USERS = require('../../lib/middleware/auth').TEST_USERS
const femaAPI = require('../../lib/middleware/fema')


describe('/api/states/:state/disasters', function () {
  this.timeout(10000)

  it('should return a list of disasters', (done) => {
    request(app).get('/api/states/TX/disasters')
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      res.body.should.be.an.Array()
      done(err)
    })
  })

  it('should return a 400 if the querystring is present, but incorrect', (done) => {
    const queries = ['badstuff', 'badderstuff=2', 'realbadstuff=-,,||2', 'bad=123&stuff=poiq}{}', 'city=', 'city', 'CITY=county']
    async.eachSeries(queries, (query, next) => {
      console.log(`Testing with query: ${query}`)
      request(app).get(`/api/states/TX/disasters?${query}`)
      .expect(400)
      .end(next)
    }, done)
  })

  it('should call hudApi.getDisastersByLocale if DRDP_LOCAL is not set', (done) => {
    delete process.env.DRDP_LOCAL
    const disasters = [{id:1, name: 'abc'}, {id:2, name: 'def'}]
    const stub = sinon.stub(requestpromise, 'get').callsFake(opts => {
      should.exist(opts.url)
      if (/users/.test(opts.url)) return new Promise(resolve => resolve(USERS.GRANTEE))
      return new Promise(resolve => resolve(disasters))
    })
    const femaStub = sinon.stub(femaAPI, 'getDisasters').callsFake((filter, cb) => cb(null, disasters))
    request(app).get('/api/states/TX/disasters')
    .expect(function (res) {
      const body = res.body
      body.should.be.an.Array()
      (body[0].name).should.equal(disasters[0].name)
      stub.restore()
      femaStub.restore()
      process.env.DRDP_LOCAL = true
    })
    .expect(200)
    .expect('Content-Type', /json/, done)
  })
})

describe('/api/states/:state/disasters?[localeparams]', function () {
  this.timeout(10000)
  const errorMessage = 'Invalid parameters sent.  Use one of: city, county, congrdist, zipcode, township, or tract with a comma separated list of values. Not Acceptable.'
  it('should return a list of disasters for city of Houston', (done) => {
    request(app).get('/api/states/TX/disasters?city=Houston')
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      res.body.should.be.an.Array()
      'Harris (County)'.should.be.oneOf(res.body[0].declaredCountyArea)
      done(err)
    })
  })
  it('should return an error if providing an incorrect parameter', (done) => {
    request(app).get('/api/states/TX/disasters?wrongParameter=Houston')
    .expect(400)
    .expect('Content-Type', /text/)
    .end((err, res) => {
      res.text.should.be.equal(errorMessage)
      done(err)
    })
  })
  it('should return an error if providing a correct parameter but no arguments', (done) => {
    request(app).get('/api/states/TX/disasters?city=')
    .expect(400)
    .expect('Content-Type', /text/)
    .end((err, res) => {
      res.text.should.be.equal(errorMessage)
      done(err)
    })
  })
})
