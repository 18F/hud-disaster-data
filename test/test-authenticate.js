const request = require('supertest');
const app = require('../app.js');
const should = require('should');
const authenticate = require('../lib/services/authenticate');

describe('authenticate', () => {
  describe('isAuthenticated' , () => {
    it('should call next() if req is authenticated', (done) => {
      var req = {
        isAuthenticated: () => { return true; }
      };
      authenticate.isAuthenticated(req, null, done);
    });

    it('should redirect to /login if req is not authenticated', (done) => {
      var req = {
        isAuthenticated: () => { return false; }
      };
      var res = {
        redirect: (page) => {
          (page).should.equal('/login');
          done();
        }
      };
      authenticate.isAuthenticated(req, res);
    });
  });

  describe('localAuthenticate', () => {
    it('should call cb(null, false) if authentication is not successful', (done) => {
      authenticate.localAuthenticate('test', 'jkahsd', (err, user) => {
        should.not.exist(err);
        (user).should.be.false();
        done();
      });
    });
    it('should call cb(null, user) if authentication is successful', (done) => {
      authenticate.localAuthenticate('test', 'test', (err, user) => {
        should.not.exist(err);
        (user).should.be.an.Object().and.have.property('username').which.is.a.String().and.equal('test');
        done();
      });
    });
  });
});
