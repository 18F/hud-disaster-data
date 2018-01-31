require('../../config/env')
const sinon = require('sinon')
const should = require('should')
const rewire = require('rewire')
const fema = rewire('../../lib/middleware/fema')

describe('fema', () => {
  describe('getDisasters', done => {
    it('should send error to the callback if request receives an error', done => {
      const filter = {state: 1234}
      const cb = sinon.spy()
      const revert = fema.__set__('request', function (url, next) {
        next('kaabbooom')
      })
      fema.getDisasters({filter}, cb)
      should(cb.called).be.true()
      revert()
      done()
    })
  })
})
