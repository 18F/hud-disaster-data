/* global describe, it, */
const should = require('should')
const localAPI = require('../../lib/middleware/localAPI')

describe('localAPI', () => {
  describe('getDisasters', () => {
    it('should return all disaster for a state', () => {
      const result = localAPI.getDisasters({state: 'TX'})
      result.should.be.an.Array().and.should.not.be.empty
    })
    it('should return all disasters for a county', () => {
      const result = localAPI.getDisasters({state: 'TX', localeType: 'county', locales: ['Harris (County)']})
      result.should.be.an.Array().and.should.not.be.empty
    })
    it('should return all disasters for congressional districts', () => {
      const result = localAPI.getDisasters({state: 'TX', localeType: 'congrdist', locales: ['4818115', '4810115']})
      result.should.be.an.Array().and.should.not.be.empty
    })
  })
})
