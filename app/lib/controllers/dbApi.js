const low = require('lowdb')
const fileAsync = require('lowdb/lib/storages/file-async')

// Start database using file-async storage
// For ease of use, read is synchronous
const db = low('mock-data/FEMA_Test_Data.json', {
  storage: fileAsync
})

const getData = function (queryObj) {
  var result = db.get('disasterRecs').filter(queryObj)
  // var result = db.get('disasterRecs').value()
  debugger
  return result
}

module.exports = { getData }
