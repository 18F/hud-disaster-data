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
});

describe('POST /login', () => {
  it('should return 403 Forbidden if _csrf is empty', (done) => {
    request(app).post('/login')
    .type('form')
    .send({username: 'test', password: 'test'})
    .expect(403, done);
  });
  
  it('should return 401 Unauthorized if username is empty', (done) => {
    var agent = request.agent(app);
    agent.get('/login')
    .end((err, res) => {
      const $ = cheerio.load(res.text);
      const csrf = $('form input[name=_csrf]').val();
      agent.post('/login')
      .type('form')
      .send({_csrf: csrf, password: 'test'})
      .expect(401, done);
    });
  });

  it('should return 401 Unauthorized if password is empty', (done) => {
    var agent = request.agent(app);
    agent.get('/login')
    .end((err, res) => {
      const $ = cheerio.load(res.text);
      const csrf = $('form input[name=_csrf]').val();
      agent.post('/login')
      .type('form')
      .send({_csrf: csrf, username: 'test'})
      .expect(401, done);
    });
  });

  it('should return 200 ok if username and password are valid', (done) => {
    var agent = request.agent(app);
    agent.get('/login')
    .end((err, res) => {
      const $ = cheerio.load(res.text);
      const csrf = $('form input[name=_csrf]').val();
      agent.post('/login')
      .type('form')
      .send({_csrf: csrf, username: 'test', password: 'test'})
      .expect(200, done);
    });
  });
});
