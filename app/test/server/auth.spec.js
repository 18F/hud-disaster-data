/* global describe, it, */
const should = require('should')
const auth = require('../../lib/middleware/auth')
const hudApi = require('../../lib/middleware/hudApi')
const sinon = require('sinon')

describe('middleware/auth', () => {
  describe('isHUDHQUser', () => {
    it(`should return true if user type = 'HUD' and hq = true`, (done) => {
      const result = auth.isHUDHQUser({user: {type: 'HUD', hq: true}})
      result.should.be.true()
      done()
    })
    it(`should return false if user type != 'HUD' or hq != true`, (done) => {
      const result = auth.isHUDHQUser({user: {type: 'HUD', hq: false}})
      result.should.be.false()
      done()
    })
  })

  describe('authenticate', () => {
    it(`should set the user to the session user in req and return`, (done) => {
      var req = {
        session: {user: 'Somebody'},
        user: 'nobody'
      }
      auth.authenticate(req, null, function () {
        should(req.session.user).be.equal('Somebody')
        should(req.user).be.equal('Somebody')
        done()
      })
    })
    it(`should set the session user and user in req`, (done) => {
      const grantee = { "type": "Grantee" }
      var req = { headers: { 'dr-userid': 'T071GA' },
        session: {}
      }
      const getUserStub = sinon.stub(hudApi, 'getUser').resolves(grantee)
      auth.authenticate(req, null, function () {
        should(getUserStub.called).be.true()
        should(req.session.user.type).be.equal(grantee.type)
        should(req.user.type).be.equal(grantee.type)
        getUserStub.restore()
        done()
      })
    })
    it(`should return 401 if Unauthorized`, (done) => {
      const grantee = { 'type': 'Unauthorized' }
      var req = { headers: { 'dr-userid': 'T071GA' },
        session: {}
      }
      const getUserStub = sinon.stub(hudApi, 'getUser').resolves(grantee)
      const sendStatus = sinon.stub().callsFake((status) => {
        should(status).be.equal(401)
        getUserStub.restore()
        done()
      })
      const next = sinon.spy()
      const res = { sendStatus }
      auth.authenticate(req, res, next)
    })
  })
})
