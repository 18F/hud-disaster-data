const request = require('supertest');
const app = require('../../app.js');
const should = require('should');
const moment = require('moment')

describe('/api/disasters/:qry', () => {
  it('should return disasters with a disaster type matching the first two characters in the qry path parameter', (done) => {
    request(app).get('/api/disasters/FM')
    .expect(function(res) {
      const body = res.body
      body.should.be.an.Array();
      body[0].should.be.an.Object().and.have.property('disasterType').which.is.equal('FM')
    })
    .expect(200)
    .expect('Content-Type', /json/, done);
  })

  it('should only return disasters occuring in the last ten years', (done) => {
    request(app).get('/api/disasters/DR')
    .expect(function(res) {
      const body = res.body
      const date = moment(body[0].declarationDate)
      const tenYearsAgo = moment().subtract(10, 'years')
      date.isSameOrAfter(tenYearsAgo).should.be.true()
    })
    .expect(200)
    .expect('Content-Type', /json/, done);
  })

  it('should only return disasters in descending order of declarationDate', (done) => {
    request(app).get('/api/disasters/DR')
    .expect(function(res) {
      const body = res.body
      body.forEach(function(disaster, i) {
        let disasterDate = moment(disaster.declarationDate)
        if (i == body.length-1) return
        let nextDisasterDate = moment(body[i+1].declarationDate)
        disasterDate.isSameOrAfter(nextDisasterDate).should.be.true()
      })
    })
    .expect(200)
    .expect('Content-Type', /json/, done);
  })

})
