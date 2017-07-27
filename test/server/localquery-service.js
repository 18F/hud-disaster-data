/* global describe, it, */
const request = require('supertest')
const should = require('should') // eslint-disable-line
const app = require('../../app.js')

describe('/api/localequery/:state', function () {
  this.timeout(10000)

  it('should return a JSON document with locale data', (done) => {
    request(app).get('/api/localequery/WI?level=city')
    .expect(function (res) {
      const body = res.body
      body.should.be.an.Array()
      body[0].code.should.be.a.String().and.not.be.null
    })
    .expect(200)
    .expect('Content-Type', /json/, done)
  })
})
