/* global describe, it, */
const request = require('supertest')
const should = require('should') // eslint-disable-line
const app = require('../../app.js')
const localAPI = require('../../lib/middleware/localAPI')
const thrownErrMsg = 'Improper query parameters sent. You must provide both localeType and values, or neither. Not Acceptable.'

describe('/api/applicants/export', function () {
  this.timeout(10000)

  it('should return data when specifying a state/disasters combination', (done) => {
    request(app).get('/api/applicants/export?states=IA&disasters=4187')
    .expect(function (res) {
      const body = res.body
      body.should.be.an.Array()
      body[0].should.be.an.Object().and.have.property('DSTER_ID').which.is.equal('4187')
      body[0].should.be.an.Object().and.have.property('DMGE_STATE_CD').which.is.equal('IA')
    })
    .expect(200)
    .expect('Content-Type', /json/, done)
  })

  it('should return only columns that are specified as cols', (done) => {
    request(app).get('/api/applicants/export?states=TX&cols=DMGE_CITY_NAME,DMGE_STATE_CD')
    .expect(function (res) {
      const body = res.body
      body.should.be.an.Array()
      body[0].should.be.an.Object().and.have.property('DMGE_STATE_CD').and.should.not.be.empty()
      body[0].should.be.an.Object().and.have.property('DMGE_CITY_NAME').and.should.not.be.empty()
      body[0].should.be.an.Object().and.not.have.property('DSTER_ID')
    })
    .expect(200)
    .expect('Content-Type', /json/, done)
  })

  it('should return failure code if specifying a localeType but not locales, or visa versa', (done) => {
    request(app).get('/api/applicants/export?states=TX&localeType=city')
    .expect(function (res) {
      const message = res.text
      message.should.be.equal(thrownErrMsg)
    })
    .expect(400)
    .expect('Content-Type', /text/, done)
  })

  it('should return failure code if specifying a locales but not localeType, or visa versa', (done) => {
    request(app).get('/api/applicants/export?states=TX&locales=Alamo')
    .expect(function (res) {
      const message = res.text
      message.should.be.equal(thrownErrMsg)
    })
    .expect(400)
    .expect('Content-Type', /text/, done)
  })
})

describe('/api/applicants/export summarizeCols', function () {
  this.timeout(10000)

  it('should return JSON with summarized column values', (done) => {
    let data = [{
      dster_id: '4269',
      damaged_city: 'HOUSTON',
      dmge_state_cd: 'TX',
      total_damages: 3789.92,
      hud_unmet_need: 1624.76
    },
    {
      dster_id: '4269',
      damaged_city: 'HOUSTON',
      dmge_state_cd: 'TX',
      total_damages: 3930.31,
      hud_unmet_need: 0
    },
    {
      dster_id: '4269',
      damaged_city: 'HOUSTON',
      dmge_state_cd: 'TX',
      total_damages: 270.65,
      hud_unmet_need: 270.65
    }]
    let summaryCols = ['total_damages', 'hud_unmet_need']
    let summarizedCols = localAPI.summarizeCols(data, summaryCols)
    summarizedCols.TOTAL_DAMAGES.should.be.equal(3789.92 + 3930.31 + 270.65)
    summarizedCols.HUD_UNMET_NEED.should.be.equal(1624.76 + 0 + 270.65)
    done()
  })
  it('should return false no data is passed in', (done) => {
    let data = null
    let summaryCols = ['total_damages', 'hud_unmet_need']
    let summarizedCols = localAPI.summarizeCols(data, summaryCols)
    summarizedCols.should.be.equal(false)
    done()
  })
})
