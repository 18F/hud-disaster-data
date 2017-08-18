/* global describe, it, */
const should = require('should')
const dbApi = require('../../lib/controllers/dbApi')

describe('dbApi', () => {
  describe('getDisasters', () => {
    it('should return all disaster for a state', () => {
      const result = dbApi.getDisasters({state: 'TX'})
      result.should.be.an.Array().and.should.not.be.empty
    })
    it('should return all disasters for a county', () => {
      const result = dbApi.getDisasters({state: 'TX', localeType: 'county', locales: ['Harris (County)']})
      result.should.be.an.Array().and.should.not.be.empty
    })
    it('should return all disasters for congressional districts', () => {
      const result = dbApi.getDisasters({state: 'TX', localeType: 'congrdist', locales: ['4818115', '4810115']})
      result.should.be.an.Array().and.should.not.be.empty
    })
  })
})
