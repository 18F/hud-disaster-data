/* global describe, it, */
const request = require('supertest')
const should = require('should') // eslint-disable-line
const app = require('../../app.js')

describe('/api/db', function () {
  this.timeout(10000)

  it('should return failure code if not specifying a stateId', (done) => {
    request(app).get('/api/db?disasterId=4269')
    .expect(function (res) {
      const message = res.text
      message.should.be.equal('Invalid parameters sent. You must provide at least a stateId. Not Acceptable.')
    })
    .expect(406)
    .expect('Content-Type', /text/, done)
  })

  it('should return data when specifying a stateId/disasterId combination', (done) => {
    request(app).get('/api/db?stateId=Tx&disasterId=4269')
    .expect(function (res) {
      const body = res.body
      body.should.be.an.Array()
      body[0].should.be.an.Object().and.have.property('disaster_id').which.is.equal('4269')
      body[0].should.be.an.Object().and.have.property('damaged_state').which.is.equal('TX')
    })
    .expect(200)
    .expect('Content-Type', /json/, done)
  })

  it('should return only columns that are specified as selectCols', (done) => {
    request(app).get('/api/db?stateId=Tx&selectCols=damaged_city,damaged_state')
    .expect(function (res) {
      const body = res.body
      body.should.be.an.Array()
      body[0].should.be.an.Object().and.have.property('damaged_state').and.should.not.be.empty()
      body[0].should.be.an.Object().and.have.property('damaged_city').and.should.not.be.empty()
      body[0].should.be.an.Object().and.not.have.property('disaster_id')
    })
    .expect(200)
    .expect('Content-Type', /json/, done)
  })

  it('should return failure code if specifying a geoName but not geoArea, or visa versa', (done) => {
    request(app).get('/api/db?stateId=TX&geoName=damaged_city')
    .expect(function (res) {
      const message = res.text
      message.should.be.equal('Improper query parameters sent. You must provide both geoName and values, or neither. Not Acceptable.')
    })
    .expect(406)
    .expect('Content-Type', /text/, done)
  })

  it('should return failure code if specifying a geoArea but not geoName, or visa versa', (done) => {
    request(app).get('/api/db?stateId=TX&geoArea=Alamo')
    .expect(function (res) {
      const message = res.text
      message.should.be.equal('Improper query parameters sent. You must provide both geoName and values, or neither. Not Acceptable.')
    })
    .expect(406)
    .expect('Content-Type', /text/, done)
  })
})
