/* global describe, it, */
const request = require('supertest')
const should = require('should') // eslint-disable-line
const app = require('../../app.js')

describe('/api/export/:fileNamePart', function () {
  this.timeout(10000)

  it('should return a document with a csv attachment', (done) => {
    request(app).get('/api/export/My_Document_Name?disasters=DR-4272-TX')
    .expect(function (res) {
      const headers = res.headers
      headers['content-type'].should.be.equal('text/csv; charset=utf-8')
      headers['content-length'].should.be.greaterThan(0)
      headers['content-disposition'].should.be.equal('attachment; filename="hud-fema-data-My_Document_Name.csv"')
    })
    .expect(200, done)
  })

  it('should return a 406 code if no disasters were sent', (done) => {
    request(app).get('/api/export/My_Document_Name?disasters=')
    .expect(406, done)
  })

  it('should return a 406 code and message that invalid disaster numbers were sent if bad disasters in query', (done) => {
    request(app).get('/api/export/My_Document_Name?disasters=0')
    .expect(function (res) {
      const text = res.text
      text.should.be.equal('Invalid disaster numbers sent. Not Acceptable.')
    })
    .expect(406)
    .expect('Content-Type', /text/, done)
  })

  it('should return a 200 code and message that no data was found if no data is returned', (done) => {
    request(app).get('/api/export/My_Document_Name?disasters=XX-1111-XX,YY-2222-YY')
    .expect(function (res) {
      const text = res.text.split('\r')[0]
      text.should.be.equal('"No data found for any of the following: XX-1111-XX, YY-2222-YY"')
    })
    .expect(200)
    .expect('Content-Type', /csv/, done)
  })
})
