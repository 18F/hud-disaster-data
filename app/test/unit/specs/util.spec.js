import util from '@/util'
import should from 'should'
describe('util', function () {
  describe('isGecko', function () {
    it('should return false if browser is not gecko', function () {
      should(util.isGecko()).be.not.true()
    })
  })
})
