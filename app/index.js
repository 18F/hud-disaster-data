'use strict'

const app = require('./app')
const port = process.env.PORT || 3000 // Azure will set this, otherwise we will

let server = app.listen(port, () => {
  let address = server.address().address

  if (address === '::') {
    address = 'localhost'
  }
  address += ':'

  console.log('Running hud-disaster-data app at', address + port)
})

module.exports = server
