/* global describe, it, */
const request = require('supertest')
const should = require('should') // eslint-disable-line
const app = require('../../app.js')

describe('/api/disasternumber/:qry', function () {
  this.timeout(10000)

  it('should return a disaster with a disaster number matching the first argument in the qry path parameter', (done) => {
    request(app).get('/api/disasternumber/DR-1606-TX')
    .expect(function (res) {
      const body = res.body
      body.should.be.an.Array()
      body[0].should.be.an.Object().and.have.property('disasterType').which.is.equal('DR')
      body[0].should.be.an.Object().and.have.property('disasterNumber').which.is.equal(1606)
      body[0].should.be.an.Object().and.have.property('state').which.is.equal('TX')
    })
    .expect(200)
    .expect('Content-Type', /json/, done)
  })

  it('should return 3 disasters with disaster numbers matching the 3 arguments in the qry path parameter', (done) => {
    request(app).get('/api/disasternumber/DR-1999-TX,DR-4223-TX,DR-4266-TX')
    .expect(function (res) {
      const body = res.body
      body.should.be.an.Array()
      body[0].should.be.an.Object().and.have.property('disasterType').which.is.equal('DR')
      body[0].should.be.an.Object().and.have.property('disasterNumber').which.is.equal(1999)
      body[0].should.be.an.Object().and.have.property('state').which.is.equal('TX')
    })
    .expect(200)
    .expect('Content-Type', /json/, done)
  })
})
