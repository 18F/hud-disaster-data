/* global describe, it, */
const request = require('supertest')
const should = require('should') // eslint-disable-line
const app = require('../../app.js')

describe('/api/exportReport/:fileName', function () {
  this.timeout(10000)

  it('should return a document with a csv attachment', (done) => {
    var data = '{"First":"1","Second":"2"}'
    request(app).get(`/api/exportReport/My_Document_Name.csv?data=${data}`)
    .expect(function (res) {
      const headers = res.headers
      headers['content-type'].should.be.equal('text/csv; charset=utf-8')
      headers['content-length'].should.be.greaterThan(0)
      headers['content-disposition'].should.be.equal('attachment; filename="My_Document_Name.csv"')
    })
    .expect(200, done)
  })

  it('should return a 406 code if no data was sent', (done) => {
    request(app).get('/api/exportReport/My_Document_Name.csv')
    .expect(406, done)
  })
})
