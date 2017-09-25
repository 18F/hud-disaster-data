/* global describe, it, */
const should = require('should')
const hudApi = require('../../lib/middleware/hudApi')

describe('hudApi', () => {
  describe('getDisasters', () => {
    it('should return all disaster for a state', () => {
      const result = hudApi.getDisasters({state: 'TX'})
      result.should.be.an.Array().and.should.not.be.empty
    })
    it('should return all disasters for a county', () => {
      const result = hudApi.getDisasters({state: 'TX', localeType: 'county', locales: ['Harris (County)']})
      result.should.be.an.Array().and.should.not.be.empty
    })
    it('should return all disasters for congressional districts', () => {
      const result = hudApi.getDisasters({state: 'TX', localeType: 'congrdist', locales: ['4818115', '4810115']})
      result.should.be.an.Array().and.should.not.be.empty
    })
  })
})
