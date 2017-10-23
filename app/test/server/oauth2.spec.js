/* global describe, it, */
const should = require('should')
const oauth2 = require('../../lib/middleware/oauth2')
const requestpromise = require('request-promise')
const sinon = require('sinon')
const url = require('url')
// const _ = require('lodash')

describe('middleware/oauth2', () => {
  describe('getOAuth2TokenParam', () => {
    it(`should reject if scope is neither DRGR or DRDP`, (done) => {
      oauth2.getOAuth2TokenParam('DONT WORK')
      .then(
        success => {
          console.log('should not make it here!!')
        })
      .catch(
        failure => {
          should(failure.message).be.equal('DONT WORK is not valid.  Should be DRGR or DRDP')
          done()
        })
    })
    it(`should get token for authentication and use it get an access token`, (done) => {
      let requestStub = sinon.stub(requestpromise, 'post').callsFake(opts => {
        should(opts.url).exist
        const parsedUrl = url.parse(opts.url, true)
        const path = parsedUrl.path
        if (path === '/openam/json/authenticate?realm=/') {
          const tokenId = 'MyToken'
          return new Promise(resolve => resolve({tokenId}))
        } else {
          const err = {response: {headers: {location: 'somthing#MyAccess&otherParms'}, statusCode: 302}}
          return new Promise((resolve, reject) => reject(err))
        }
      })
      oauth2.getOAuth2TokenParam('DRGR')
      .then(
        success => {
          should(success.DRGR).be.equal('MyAccess')
          done()
          requestStub.restore()
        })
      .catch(
        failure => {
          console.log('should not make it here!!')
        })
    })
    it(`should run reject when not getting a 302 (redirect) statusCode`, (done) => {
      let requestStub = sinon.stub(requestpromise, 'post').callsFake(opts => {
        should(opts.url).exist
        const parsedUrl = url.parse(opts.url, true)
        const path = parsedUrl.path
        if (path === '/openam/json/authenticate?realm=/') {
          const tokenId = 'MyToken'
          return new Promise(resolve => resolve({tokenId}))
        } else {
          const err = {response: {headers: {location: 'somthing#MyAccess&otherParms'}, statusCode: 999}}
          return new Promise((resolve, reject) => reject(err))
        }
      })
      oauth2.getOAuth2TokenParam('DRGR')
      .then(
        success => {
          console.log('should not make it here!!')
        })
      .catch(
        failure => {
          should(failure.response.headers.location).be.equal('somthing#MyAccess&otherParms')
          should(failure.response.statusCode).be.equal(999)
          done()
          requestStub.restore()
        })
    })
    it(`should run reject when not error from authentication request`, (done) => {
      let requestStub = sinon.stub(requestpromise, 'post').callsFake(opts => {
        should(opts.url).exist
        const parsedUrl = url.parse(opts.url, true)
        const path = parsedUrl.path
        if (path === '/openam/json/authenticate?realm=/') {
          const tokenId = 'MyToken'
          return new Promise(resolve => resolve({tokenId}))
        } else {
          const err = {response: {headers: {location: 'somthing#StrangeAccess&otherParms'}}}
          return new Promise((resolve, reject) => resolve(err))
        }
      })
      oauth2.getOAuth2TokenParam('DRGR')
      .then(
        success => {
          console.log('should not make it here!!')
        })
      .catch(
        failure => {
          should(failure.response.headers.location).be.equal('somthing#StrangeAccess&otherParms')
          done()
          requestStub.restore()
        })
    })
  })
})
