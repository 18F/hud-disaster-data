const request = require('supertest')

const app = require('../../app.js')

describe('swagger', function () {
  describe('GET /api-docs', function () {
    it('should return html content', function(done) {
      request(app).get('/api-docs')
      .expect('Content-Type', /html/)
      .expect('Content-Length', /\d{2}/).end(done)
    })
  })
  describe('GET /api-docs.yml', function () {
    it('should return yaml content', function(done) {
      request(app).get('/api-docs.yaml')
      .expect('Content-Type', /text\/x-yaml/)
      .expect('Content-Length', /\d{2}/).end(done)
    })
  })
  describe('GET /api-docs.json', function () {
    it('should return json content', function(done) {
      request(app).get('/api-docs.json')
      .expect('Content-Type', /application\/json/)
      .expect('Content-Length', /\d{2}/).end(done)
    })
  })

})
