/* global describe, it, */
const request = require('supertest')
const should = require('should') // eslint-disable-line
const app = require('../../app.js')
const moment = require('moment')
const sinon = require('sinon')

describe('/api/disasterquery/:qry', function () {
  this.timeout(10000)

  it('should return an empty array when the user has no disasters and is not Hud HQ', (done) => {
    const getUserStub = sinon.stub(require('../../lib/middleware/hudApi'), 'getUser').resolves({'login': 'T071GXX', 'disasterids': [], 'type': 'Grantee', 'hq': false})
    request(app).get('/api/disasterquery/DR')
    .set('dr-userid', 'T071GXX')
    .expect(function (res) {
      const body = res.body
      body.should.be.an.Array()
      body.length.should.be.equal(0)
      getUserStub.restore()
    })
    .expect(200)
    .expect('Content-Type', /json/, done)
  })

  it('should return disasters with a disaster type matching the first two characters in the qry path parameter', (done) => {
    request(app).get('/api/disasterquery/DR')
    .expect(function (res) {
      const body = res.body
      body.should.be.an.Array()
      body[0].should.be.an.Object().and.have.property('disasterType').which.is.equal('DR')
    })
    .expect(200)
    .expect('Content-Type', /json/, done)
  })

  it('should only return disasters occuring in the last ten years', (done) => {
    request(app).get('/api/disasterquery/DR')
    .expect(function (res) {
      const body = res.body
      const date = moment(body[0].declarationDate)
      const tenYearsAgo = moment().subtract(10, 'years')
      date.isSameOrAfter(tenYearsAgo).should.be.true()
    })
    .expect(200)
    .expect('Content-Type', /json/, done)
  })

  it('should only return disasters in descending order of declarationDate', (done) => {
    request(app).get('/api/disasterquery/DR')
    .expect(function (res) {
      const body = res.body
      body.forEach(function (disaster, i) {
        let disasterDate = moment(disaster.declarationDate)
        if (i === body.length - 1) return
        let nextDisasterDate = moment(body[i + 1].declarationDate)
        disasterDate.isSameOrAfter(nextDisasterDate).should.be.true()
      })
    })
    .expect(200)
    .expect('Content-Type', /json/, done)
  })

  const validCols = ['id', 'declaredCountyArea', 'disasterNumber', 'state', 'declarationDate', 'disasterType', 'placeCode', 'incidentType', 'title']

  it('should only return the columns: id (mandatory), declaredCountyArea, disasterNumber, state, declarationDate, disasterType, placeCode, incidentType, and title', (done) => {
    request(app).get('/api/disasterquery/DR')
    .expect(function (res) {
      const body = res.body
      const firstRecord = body[0]
      for (var column in firstRecord) {
        column.should.be.oneOf(validCols)
      }
    })
    .expect(200)
    .expect('Content-Type', /json/, done)
  })

  it('should return at least one record when passing in dr in lower case', (done) => {
    request(app).get('/api/disasterquery/dr')
    .expect(function (res) {
      const body = res.body
      body.length.should.be.aboveOrEqual(1)
    })
    .expect(200)
    .expect('Content-Type', /json/, done)
  })

  it('should return at least one record when passing in TX', (done) => {
    request(app).get('/api/disasterquery/TX')
    .expect(function (res) {
      const body = res.body
      body.length.should.be.aboveOrEqual(1)
    })
    .expect(200)
    .expect('Content-Type', /json/, done)
  })

  it('should return at least one record when passing in a valid number (ex: 4272)', (done) => {
    request(app).get('/api/disasterquery/4272')
    .expect(function (res) {
      const body = res.body
      body.length.should.be.aboveOrEqual(1)
    })
    .expect(200)
    .expect('Content-Type', /json/, done)
  })

  it('should return at least one record when passing in a valid disaster number and type (ex: DR-4272)', (done) => {
    request(app).get('/api/disasterquery/DR-4272')
    .expect(function (res) {
      const body = res.body
      body.length.should.be.aboveOrEqual(1)
    })
    .expect(200)
    .expect('Content-Type', /json/, done)
  })

  it('should return one record with concatenated counties when passing in a valid disaster number and type and state (ex: DR-1606-TX)', (done) => {
    request(app).get('/api/disasterquery/DR-1606-TX')
    .expect(function (res) {
      const body = res.body
      body.length.should.be.equal(1)
      body[0].declaredCountyArea.length.should.be.aboveOrEqual(254)
    })
    .expect(200)
    .expect('Content-Type', /json/, done)
  })

  it('should ignore trailing dashes', (done) => {
    request(app).get('/api/disasterquery/DR-')
    .expect(function (res) {
      const body = res.body
      body.length.should.be.aboveOrEqual(1)
      body[0].declaredCountyArea.length.should.be.aboveOrEqual(1)
    })
    .expect(200)
    .expect('Content-Type', /json/, done)
  })
})
