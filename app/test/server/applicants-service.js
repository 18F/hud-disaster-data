/* global describe, it, */
const request = require('supertest')
const should = require('should') // eslint-disable-line
const app = require('../../app.js')

describe('/api/applicants/:queryType', function () {
  this.timeout(10000)

  it('should return a 406 error if providing a parameter other than summary or export', (done) => {
    request(app).get('/api/applicants/badParameter')
    .expect(406)
    .expect('Content-Type', /text/)
    .end((err, res) => {
      res.text.should.be.equal('Invalid url. Not Acceptable.')
      done()
    })
  })

  it('should return a 406 error if providing a parameter other than summary or export', (done) => {
    request(app).get('/api/applicants/export?badParameter')
    .expect(406)
    .expect('Content-Type', /text/)
    .end((err, res) => {
      res.text.should.be.equal('Improper query parameters sent. You must only use disasters,states,locales,localeType,cols. Not Acceptable.')
      done()
    })
  })

  it('should return data for city of Houston', (done) => {
    request(app).get('/api/applicants/export?states=TX&localeType=city&locales=Houston')
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      res.body.should.be.an.Array()
      res.body[0].DMGE_CITY_NAME.should.be.equal('Houston')
      done()
    })
  })
})
