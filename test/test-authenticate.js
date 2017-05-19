const request = require('supertest');
const app = require('../app.js');
const should = require('should');
const authenticate = require('../lib/services/authenticate');
const sinon = require('sinon');

describe('authenticate', () => {

  describe('init', () => {
    it('should only initialize once', () => {
      var mockApp = {use: ()=>{}};
      authenticate.init(mockApp);
      (authenticate.init(mockApp)).should.be.false();
    });
  });

  describe('isAuthenticated' , () => {
    it('should call next() if req is authenticated', (done) => {
      var req = {
        isAuthenticated: () => { return true; }
      };
      authenticate.isAuthenticated(req, null, done);
    });

    it('should redirect to /login if req is not authenticated', (done) => {
      var req = {
        isAuthenticated: () => { return false },
        flash: () => {}
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
        if (err) return done(err);
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

  describe('authenticate', () => {
    it('should redirect to /login if authentication is unsuccessful', (done) => {
      var req = {
        body: {
          username: 'test',
          password: 'jjhgasf'
        },
        flash: () => {}
      };
      var res = {
        redirect: (page) => {
          (page).should.equal('/login');
          done();
        }
      };
      authenticate.authenticate(req, res, done);
    });

    it('should redirect to /start if authentication is successful', (done) => {
      var req = {
        body: {
          username: 'test',
          password: 'test'
        },
        logIn: (user, cb) => {
          cb();
        }
      };
      var res = {
        redirect: (page) => {
          (page).should.equal('/start');
          done();
        }
      };
      authenticate.authenticate(req, res, done);
    });

    it('should call next(err) if an error ocurs durring logIn', (done) => {
      var req = {
        body: {
          username: 'test',
          password: 'test'
        },
        logIn: (user, cb) => {
          cb(new Error('Kaboom'));
        }
      };
      var res = {
        redirect: (page) => {
          (page).should.equal('/start');
          done();
        }
      };

      authenticate.authenticate(req, res, (err) => {
        should.exist(err);
        done();
      });
    });

    it('should call next(err) if an error ocurs durring auth', (done) => {
      var _localAuth = authenticate.localAuthenticate;
      authenticate.localAuthenticate = (user, pass, cb) => { return cb(new Error('Kaboom'));};
      var req = {
        body: {
          username: 'test',
          password: 'test'
        },
        logIn: (user, cb) => {
          cb(err);
        }
      };
      var res = {
        redirect: (page) => {
          (page).should.equal('/start');
          done();
        }
      };

      authenticate.authenticate(req, res, (err) => {
        should.exist(err);
        authenticate.localAuthenticate = _localAuth;
        done();
      });
    });
  });
});
