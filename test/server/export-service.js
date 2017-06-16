/* global describe, it, */
const request = require('supertest')
const should = require('should') // eslint-disable-line
const app = require('../../app.js')

describe('/api/export/:fileNamePart', function () {
  this.timeout(10000)

  it('should return a document with a csv attachment', (done) => {
    request(app).get('/api/export/My_Document_Name')
    .expect(function (res) {
      const headers = res.headers
      headers['content-type'].should.be.equal('text/csv; charset=utf-8')
      headers['content-length'].should.be.greaterThan(0)
      headers['content-disposition'].should.be.equal('attachment; filename="hud-fema-data-My_Document_Name.csv"')
    })
    .expect(200, done)
  })
})
