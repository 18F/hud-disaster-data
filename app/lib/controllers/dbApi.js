const _ = require('lodash')
const low = require('lowdb')
const fileAsync = require('lowdb/lib/storages/file-async')

// Start database using file-async storage
// For ease of use, read is synchronous
const db = low('mock-data/FEMA_Test_Data.json', {
  storage: fileAsync
})

const getData = function (queryObj, summarize, columns) {
  var result = db.get('disasterRecs').filter(queryObj).value()
  if (summarize) return summarizeCols(result, ['total_damages', 'total_asst_amt', 'unmet_need'])
  if (columns) {
    result = _.map(result, rec => {
      var retValue = {}
      _.forEach(columns, col => { retValue[col] = rec[col] })
      return retValue
    })
  }
  return result
}

const summarizeCols = function (data, summaryColumns) {
  if (!data || summaryColumns.length === 0) return false
  var summary = {}
  _.forEach(summaryColumns, (col) => {
    summary[col] = _.sumBy(data, rec => _.toNumber(rec[col]))
  })
  return summary
}

module.exports = { getData }
