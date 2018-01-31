/* global describe, it, */
const request = require('supertest')
const should = require('should') // eslint-disable-line
const app = require('../../app.js')
const sinon = require('sinon')

describe('/api/applicants/:queryType', function () {
  this.timeout(10000)

  it('should return a 400 error if not providing a query string', (done) => {
    request(app).get('/api/applicants/export')
    .expect(400)
    .expect('Content-Type', /text/)
    .end((err, res) => {
      res.text.should.be.equal('A query string is required')
      done()
    })
  })

  it('should return a 406 error if providing a parameter other than summary or export', (done) => {
    request(app).get('/api/applicants/badParameter')
    .expect(406)
    .expect('Content-Type', /text/)
    .end((err, res) => {
      res.text.should.be.equal('Invalid url. Not Acceptable.')
      done()
    })
  })

  it('should return a 406 error if providing a parameter other than disasters,states,locales,localeType,cols', (done) => {
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

  it('should run hudApi.getSummaryRecords() if process.env.DRDP_LOCAL not set to true', (done) => {
    delete process.env.DRDP_LOCAL
    let getSummaryRecordsStub = sinon.stub(require('../../lib/middleware/hudApi'), 'getSummaryRecords')
      .callsFake(({state, localeType, locales, disasters, cols}) => {
        return Promise.resolve({state, localeType, locales, ran: true})
      })
    const getUserStub = sinon.stub(require('../../lib/middleware/hudApi'), 'getUser').resolves({'login': 'T071GXX', 'disasterids': [], 'type': 'Grantee', 'hq': false})
    request(app).get('/api/applicants/export?states=TX&localeType=city&locales=Houston')
    .set('dr-userid', 'T071GXX')
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      should(res.body.state[0]).be.equal('TX')
      should(res.body.localeType).be.equal('city')
      should(res.body.locales[0]).be.equal('Houston')
      should(res.body.ran).be.equal(true)
      process.env.DRDP_LOCAL = true
      getSummaryRecordsStub.restore()
      getUserStub.restore()
      done()
    })
  })
})
