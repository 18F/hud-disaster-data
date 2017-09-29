require('../../config/env')
const hudApi = require('../../lib/middleware/hudApi')
const fema = require('../../lib/middleware/fema')
const requestpromise = require('request-promise')
const sinon = require('sinon')
const should = require('should')
const async = require('async')
const url = require('url')

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
            return new Promise(resolve => resolve(disasters))
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
        return new Promise(resolve => resolve(disasters))
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
        return new Promise(resolve => resolve(disasters))
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
})
