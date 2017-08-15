/* global describe, it, */
const request = require('supertest')
const should = require('should') // eslint-disable-line
const app = require('../../app.js')

describe('/locales/:stateId/:localeType', function () {
  this.timeout(10000)

  it('should return nothing if not specifying a valid disasterId', (done) => {
    request(app).get('/api/locales/wi/city?disasterId=45269')
    .expect(function (res) {
      const body = res.body
      body.should.be.an.Array().and.should.be.empty
    })
    .expect(200)
    .expect('Content-Type', /json/, done)
  })

  it('should return data if specifying a valid disasterId', (done) => {
    request(app).get('/api/locales/ia/congrdist?disasterId=4289')
    .expect(function (res) {
      const body = res.body
      body.should.be.an.Array()
      body[0].should.have.property('fcd_fips91')
    })
    .expect(200)
    .expect('Content-Type', /json/, done)
  })
})
