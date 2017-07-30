const _ = require('lodash')
const low = require('lowdb')
const fileAsync = require('lowdb/lib/storages/file-async')

// Start database using file-async storage
// For ease of use, read is synchronous
const db = low('mock-data/FEMA_Test_Data.json', {
  storage: fileAsync
})

const getData = function (queryObj, summaryCols, selectCols) {
  // console.log(JSON.stringify(queryObj))
  // console.log(JSON.stringify(summaryCols))
  // console.log(JSON.stringify(selectCols))
  var result = db.get('disasterRecs').value()
  // debugger
  // console.log(`result[0]: ${result[0]}`)
  for (var i in queryObj) {
    var query = queryObj[i]
    var column = _.keys(query)[0]
    // console.log(JSON.stringify('column: ' + column))
    var argument = query[column]
    // console.log(JSON.stringify('argument: ' + argument))
    var queryIteration
    if (_.isString(argument)) {
      var arg = {}
      arg[column] = argument
      queryIteration = [arg]
    } else {
      queryIteration = _.map(argument, val => {
        var arg = {}
        arg[column] = val
        return arg
      })
    }
    // console.log(JSON.stringify('queryIteration: ' + JSON.stringify(queryIteration)))
    for (var argNbr in queryIteration) {
      // debugger
      // console.log(`queryIteration[${argNbr}]: ${JSON.stringify(queryIteration[argNbr])}`)
      result = _.filter(result, queryIteration[argNbr])
      // console.log(`result[0]: ${result[0]}`)
    }
  }
  if (summaryCols) return summarizeCols(result, summaryCols)
  if (selectCols) {
    result = _.map(result, rec => {
      var retValue = {}
      _.forEach(selectCols, col => { retValue[col] = rec[col] })
      return retValue
    })
  }
  return result
}

const summarizeCols = function (data, summaryCols) {
  if (!data || summaryCols.length === 0) return false
  var summary = {}
  _.forEach(summaryCols, (col) => {
    summary[col] = _.sumBy(data, rec => _.toNumber(rec[col]))
  })
  return summary
}

module.exports = { getData }
