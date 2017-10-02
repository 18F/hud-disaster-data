require('../../config/env')
const sinon = require('sinon')
const should = require('should')
const mock = require('mock-require')
mock('request', function (url, next) {
  debugger
  next('kaabbooom')
})
const fema = require('../../lib/middleware/fema')

describe('fema', () => {
  describe('getDisasters', done => {
    it('should send error to the callback if request receives an error', done => {
      const filter = {state: 1234}
      const cb = sinon.spy()
      fema.getDisasters({filter}, cb)
      should(cb.called).be.true()
      mock.stopAll()
      done()
    })
  })
})
