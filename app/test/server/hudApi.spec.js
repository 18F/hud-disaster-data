require('../../config/env')
const hudApi = require('../../lib/middleware/hudApi')
const fema = require('../../lib/middleware/fema')
const requestpromise = require('request-promise')
const sinon = require('sinon')
const should = require('should')
const async = require('async')
const url = require('url')
const _ = require('lodash')

describe('hudApi', () => {
  describe('getDisastersByLocale', done => {
    it('should only return disasters for the state unless localeType is a String and locales is an Array with at least one value', done => {
      const disasters = ['12345', '23456']
      const state = 'CO'
      const types = [[], 1, undefined, null, {}, true, false, [1,2,3]]
      const localesTypes = [[],'a', 1, undefined, null, {}, true, false, [1,2,3]]

      async.eachSeries(types, (type, next) => {
        async.eachSeries(localesTypes, (locales, cb) => {
          console.log(`Testing with localType: ${type} and locales: ${locales}`)
          const getDisastersStub = sinon.stub(fema, 'getDisasters').callsFake(function ({filter, orderBy, top}, cb) {
            should(/CO/.test(filter)).be.true()
            cb(null, disasters)
          })
          const getStub = sinon.stub(requestpromise, 'get').callsFake(opts => {
            should(opts.url).exist
            const parsedUrl = url.parse(opts.url, true)
            should(parsedUrl.query).not.exist
            const disasterObjects = _.map(disasters, disaster => {return {id:disaster}})
            return new Promise(resolve => resolve(disasterObjects))
          })

          hudApi.getDisastersByLocale(state, type, locales).then(disasters => {
            sinon.assert.calledOnce(getStub)
            sinon.assert.calledOnce(getDisastersStub)

            getStub.restore()
            getDisastersStub.restore()
            cb()
          }).catch(err => {
            getStub.restore()
            getDisastersStub.restore()
            cb(err)
          })
        }, next)
      }, done)
    })
    it('should return empty array if no disasters are returned', done => {
      const disasters = []
      const state = 'CO'
      const type = 'city'
      const locales = ['Nowhere', 'Boondocks', 'Ghosttown']

      const getStub = sinon.stub(requestpromise, 'get').callsFake(opts => {
        should.exist(opts.url)
        const parsedUrl = url.parse(opts.url, true)
        should(parsedUrl.pathname).equal(`/hud-esb/drdp/api/v1.0/states/${state}/disasters`)
        should(parsedUrl.query.localeType).equal(type)
        should(parsedUrl.query.locales).equal(locales.join(','))
        const disasterObjects = _.map(disasters, disaster => { return {id: disaster} })
        return new Promise(resolve => resolve(disasterObjects))
      })

      hudApi.getDisastersByLocale(state, type, locales).then(disasters => {
        sinon.assert.calledOnce(getStub)
        should(disasters.length).be.equal(0)
        getStub.restore()
        done()
      }).catch(done)
    })
    it('should call the HUD API with the correct url pattern', done => {
      const disasters = ['12345', '23456']
      const state = 'CO'
      const type = 'city'
      const locales = ['Boulder', 'Fort Collins', 'Denver']

      const getDisastersStub = sinon.stub(fema, 'getDisasters').callsFake(function ({filter, orderBy, top}, cb) {
        should(/CO/.test(filter)).be.true()
        should(/12345/.test(filter)).be.true()
        should(/23456/.test(filter)).be.true()
        cb(null, disasters)
      })
      const getStub = sinon.stub(requestpromise, 'get').callsFake(opts => {
        should.exist(opts.url)
        const parsedUrl = url.parse(opts.url, true)
        should(parsedUrl.pathname).equal(`/hud-esb/drdp/api/v1.0/states/${state}/disasters`)
        should(parsedUrl.query.localeType).equal(type)
        should(parsedUrl.query.locales).equal(locales.join(','))
        const disasterObjects = _.map(disasters, disaster => {return {id:disaster}})
        return new Promise(resolve => resolve(disasterObjects))
      })

      hudApi.getDisastersByLocale(state, type, locales).then(disasters => {
        sinon.assert.calledOnce(getStub)
        sinon.assert.calledOnce(getDisastersStub)

        getStub.restore()
        getDisastersStub.restore()
        done()
      }).catch(done)
    })
    it('should be rejected if the fema api errors', done => {
      const disasters = ['12345', '23456']
      const state = 'CO'
      const type = 'city'
      const locales = ['Boulder', 'Fort Collins', 'Denver']

      const getDisastersStub = sinon.stub(fema, 'getDisasters').callsFake(function ({filter, orderBy, top}, cb) {
        should(/CO/.test(filter)).be.true()
        should(/12345/.test(filter)).be.true()
        should(/23456/.test(filter)).be.true()
        cb('boom')
      })
      const getStub = sinon.stub(requestpromise, 'get').callsFake(opts => {
        should.exist(opts.url)
        const parsedUrl = url.parse(opts.url, true)
        should(parsedUrl.pathname).equal(`/hud-esb/drdp/api/v1.0/states/${state}/disasters`)
        should(parsedUrl.query.localeType).equal(type)
        should(parsedUrl.query.locales).equal(locales.join(','))
        const disasterObjects = _.map(disasters, disaster => {return {id:disaster}})
        return new Promise(resolve => resolve(disasterObjects))
      })

      hudApi.getDisastersByLocale(state, type, locales).catch(err => {
        should(err).equal('boom')
        getStub.restore()
        getDisastersStub.restore()
        done()
      })
    })
    it('should be rejected if the state is not provided', done => {
      const disasters = ['12345', '23456']

      hudApi.getDisastersByLocale().catch(err => {
        should(err).exist
        done()
      })
    })
  })
  describe('getSummaryRecords', () => {
    it('should call /applicants/summary with no parameters other than oauth', done => {
      const getStub = sinon.stub(requestpromise, 'get').callsFake(opts => {
        should.exist(opts.url)
        const parsedUrl = url.parse(opts.url, true)
        should(parsedUrl.pathname).equal(`/hud-esb/drdp/api/v1.0/applicants/summary`)
        return new Promise(resolve => resolve({one: 1}))
      })
      hudApi.getSummaryRecords({}).then(result => {
        should(result).be.empty()
        getStub.restore()
        done()
      }).catch(err => {
        getStub.restore()
        done(err)
      })
    })
    it('should call /applicants/summary with a state parameter', done => {
      const query = {state: 'TX'}
      const getStub = sinon.stub(requestpromise, 'get').callsFake(opts => {
        should.exist(opts.url)
        const parsedUrl = url.parse(opts.url, true)
        should(parsedUrl.pathname).equal(`/hud-esb/drdp/api/v1.0/applicants/summary`)
        should(parsedUrl.query.state).be.equal(query.state)
        return new Promise(resolve => resolve({one: 1}))
      })
      hudApi.getSummaryRecords(query).then(result => {
        should(result).be.empty()
        getStub.restore()
        done()
      }).catch(err => {
        getStub.restore()
        done(err)
      })
    })
    it('should call /applicants/summary with a state parameter and disasters parameter', done => {
      const query = {state: 'TX', disasters: [1234, 5678, 9012]}
      const getStub = sinon.stub(requestpromise, 'get').callsFake(opts => {
        should.exist(opts.url)
        const parsedUrl = url.parse(opts.url, true)
        should(parsedUrl.pathname).equal(`/hud-esb/drdp/api/v1.0/applicants/summary`)
        should(parsedUrl.query.state).be.equal(query.state)
        should(parsedUrl.query.disasters).be.equal(query.disasters.join(','))
        return new Promise(resolve => resolve({one: 1}))
      })
      hudApi.getSummaryRecords(query).then(result => {
        should(result).be.empty()
        getStub.restore()
        done()
      }).catch(err => {
        getStub.restore()
        done(err)
      })
    })
    it('should call /applicants/summary with state, localeType, and locales parameters', done => {
      const query = {state: 'TX', localeType: 'somewhere', locales: ['one', 'two', 'three']}
      const getStub = sinon.stub(requestpromise, 'get').callsFake(opts => {
        should.exist(opts.url)
        const parsedUrl = url.parse(opts.url, true)
        should(parsedUrl.pathname).equal(`/hud-esb/drdp/api/v1.0/applicants/summary`)
        should(parsedUrl.query.state).be.equal(query.state)
        should(parsedUrl.query.localeType).be.equal(query.localeType)
        should(parsedUrl.query.locales).be.equal(query.locales.join(','))
        return new Promise(resolve => resolve({one: 1}))
      })
      hudApi.getSummaryRecords(query).then(result => {
        should(result).be.empty()
        getStub.restore()
        done()
      }).catch(err => {
        getStub.restore()
        done(err)
      })
    })
  })

  describe('getExport', () => {
    it('should set the headers required for authentication', (done) => {
      const getSpy = sinon.spy(require('request-promise'), 'get')
      const ids = ['123','456']
      hudApi.getExport(ids)
      should(getSpy.calledOnce).be.true()
      const consumerData = _.get(getSpy.getCall(0).args[0], 'headers.serviceConsumerData')
      should(consumerData).not.be.null
      getSpy.restore()
      done()
    })

    it('should return error if no disasters passed in', (done) => {
      const emptyDisasterArray = []
      hudApi.getExport(emptyDisasterArray).should.be.rejectedWith(Error, { message: 'disasterIds is required' })
      done()
    })
  })
})
