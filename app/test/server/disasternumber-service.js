/* global describe, it, */
const request = require('supertest')
const should = require('should') // eslint-disable-line
const app = require('../../app.js')

describe('/api/disasternumber/:qry', function () {
  this.timeout(10000)

  it('should return a disaster with a disaster number matching the first argument in the qry path parameter', (done) => {
    request(app).get('/api/disasternumber/DR-4311-UT')
    .expect(function (res) {
      const body = res.body
      body.should.be.an.Array()
      body[0].should.be.an.Object().and.have.property('disasterType').which.is.equal('DR')
      body[0].should.be.an.Object().and.have.property('disasterNumber').which.is.equal(4311)
      body[0].should.be.an.Object().and.have.property('state').which.is.equal('UT')
    })
    .expect(200)
    .expect('Content-Type', /json/, done)
  })

  it('should return 3 disasters with disaster numbers matching the 3 arguments in the qry path parameter', (done) => {
    request(app).get('/api/disasternumber/DR-4311-UT,FM-5130-UT,FM-5182-WA')
    .expect(function (res) {
      const body = res.body
      body.should.be.an.Array()
      body[0].should.be.an.Object().and.have.property('disasterType').which.is.equal('DR')
      body[0].should.be.an.Object().and.have.property('disasterNumber').which.is.equal(4311)
      body[0].should.be.an.Object().and.have.property('state').which.is.equal('UT')
    })
    .expect(200)
    .expect('Content-Type', /json/, done)
  })
})
