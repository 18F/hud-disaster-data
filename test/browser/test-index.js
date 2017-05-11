const should = require('should')
const index = require('../../lib/browser')

describe.only('index', function () {
  describe('validateEmail', function () {
    it('should return false if email is invalid', function () {
      should(index.validateEmail('notgood')).be.false()
    })

    it('should return true if email is invalid', function () {
      should(index.validateEmail('jerry.seinfeld@flexion.us')).be.true()
    })
  })
})
