/* global describe, it, */
const request = require('supertest')
const should = require('should') // eslint-disable-line
const app = require('../../app.js')

describe('/api/dataDictionary/:fileName', function () {
  this.timeout(10000)

  it('should return a document with a xlsx attachment', (done) => {
    request(app).get(`/api/dataDictionary/My_Document_Name.xlsx`)
    .expect(function (res) {
      const headers = res.headers
      headers['content-type'].should.be.equal('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      headers['content-length'].should.be.greaterThan(0)
      headers['content-disposition'].should.be.equal('attachment; filename="My_Document_Name.xlsx"')
    })
    .expect(200, done)
  })
})
