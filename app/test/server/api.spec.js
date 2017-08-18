/* global describe, it, */
const request = require('supertest')
const should = require('should') // eslint-disable-line
const app = require('../../app.js')

describe('/api/states/:state/disasters', function () {
  this.timeout(10000)

  it('should return a liist of disasters', (done) => {
    request(app).get('/api/states/TX/disasters')
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      res.body.should.be.an.Array()
      done()
    })
  })
})
