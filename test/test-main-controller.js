const request = require('supertest');
const app = require('../app.js');
const cheerio = require('cheerio');
const should = require('should');


describe('GET /', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/')
      .expect(200, done);
  });
});

describe('GET /start', () => {
  it('should return 302 and redirect to /login', (done) => {
    request(app)
      .get('/start')
      .end((err, res) => {
        if (err) return done(err);
        (res.status).should.be.equal(302);
        (res.headers).should.have.property('location').which.is.a.String().and.is.equal('/login')
        done();
      });
  });
});

describe('GET /login', () => {
  it('should return 200 ok', (done) => {
    request(app)
      .get('/login')
      .expect(200, done);
  });
  it('should contain a _csrf hidden input field', (done) => {
    request(app)
      .get('/login')
      .end((err, res) => {
        if (err) return done(err);
        res.text.should.be.a.String();
        const $ = cheerio.load(res.text);
        const $csrfInput = $('form input[name=_csrf]');
        $csrfInput.attr('type').should.eql('hidden');
        const csrf = $csrfInput.val();
        should.exist(csrf);
        done();
      });
  });
  it('should contain a X-XSS-Protection header', (done) => {
    request(app)
      .get('/login')
      .end((err, res) => {
        if (err) return done(err);
        should.exist(res.headers['x-xss-protection']);
        done();
      });
  });
});

describe('POST /login', () => {
  it('should return 403 Forbidden if _csrf is empty', (done) => {
    request(app).post('/login')
    .type('form')
    .send({username: 'test', password: 'test'})
    .expect(403, done);
  });

  it('should return 302 and redirect to /login Unauthorized if username is empty', (done) => {
    var agent = request.agent(app);
    agent.get('/login')
    .end((err, res) => {
      const $ = cheerio.load(res.text);
      const csrf = $('form input[name=_csrf]').val();
      agent.post('/login')
      .type('form')
      .send({_csrf: csrf, password: 'test'})
      .end((err, res) => {
        if (err) return done(err);
        (res.status).should.be.equal(302);
        (res.headers).should.have.property('location').which.is.a.String().and.is.equal('/login')
        done();
      });
    });
  });

  it('should return 302 and redirect to /login if password is empty', (done) => {
    var agent = request.agent(app);
    agent.get('/login')
    .end((err, res) => {
      const $ = cheerio.load(res.text);
      const csrf = $('form input[name=_csrf]').val();
      agent.post('/login')
      .type('form')
      .send({_csrf: csrf, username: 'test'})
      .end((err, res) => {
        if (err) return done(err);
        (res.status).should.be.equal(302);
        (res.headers).should.have.property('location').which.is.a.String().and.is.equal('/login')
        done();
      });
    });
  });

  it('should return 302 and redirect to /login if username and password are empty', (done) => {
    var agent = request.agent(app);
    agent.get('/login')
    .end((err, res) => {
      const $ = cheerio.load(res.text);
      const csrf = $('form input[name=_csrf]').val();
      agent.post('/login')
      .type('form')
      .send({_csrf: csrf})
      .end((err, res) => {
        if (err) return done(err);
        (res.status).should.be.equal(302);
        (res.headers).should.have.property('location').which.is.a.String().and.is.equal('/login')
        done();
      });
    });
  });

  it('should return 302 and redirect to /start if username and password are valid', (done) => {
    var agent = request.agent(app);
    agent.get('/login')
    .end((err, res) => {
      const $ = cheerio.load(res.text);
      const csrf = $('form input[name=_csrf]').val();
      agent.post('/login')
      .type('form')
      .send({_csrf: csrf, username: 'test', password: 'test'})
      .end((err, res) => {
        if (err) return done(err);
        (res.status).should.be.equal(302);
        (res.headers).should.have.property('location').which.is.a.String().and.is.equal('/start')
        agent.get('/start').end((err, res) => {
          (res.status).should.be.equal(200);
          (res.req).should.have.property('path').which.is.a.String().and.is.equal('/start')
          done();
        });
      });
    });
  }).timeout(4000);
});
