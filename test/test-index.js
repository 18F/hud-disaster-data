const should = require('should')

describe('index', function () {
  it('should listen on port 3000 by default', function (done) {
    let server = require('../index')
    should(server.address().port).equal(3000)
    done()
  })
})
