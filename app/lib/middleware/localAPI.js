const _ = require('lodash')
const request = require('request-promise')
const low = require('lowdb')
const fileAsync = require('lowdb/lib/storages/file-async')
const fs = require('fs')
const path = require('path')
const hudApi = require('./hudApi')
const fema = require('./fema')

const getLocales = function(stateId, localeType) {
  localeType = hudApi.decodeField(localeType)
  var selectCols = [localeType]
  var queryObj = []
  queryObj.push({'dmge_state_cd': [stateId]})
  var data = getData(queryObj, null, selectCols)
  return _.map(_.uniqBy(data, l => JSON.stringify(l)), localeType)
}

// Start database using file-async storage
// For ease of use, read is synchronous
const db = low('mock-data/REAC Modified Database.json', {
  storage: fileAsync
})

const getSummaryRecords = function ({state, localeType, locales, disasters, cols, queryType}) {
  var queryObj = []
  var summaryCols
  var selectCols
  cols = cols.join(',').toLowerCase().split(',')
  if (queryType === 'export') selectCols = cols
  else summaryCols = cols

  if (disasters) queryObj.push({[hudApi.decodeField('disaster')]: disasters})
  if (state) queryObj.push({[hudApi.decodeField('state')]: state})
  if (localeType && locales) {
    localeType = hudApi.decodeField(localeType)
    var arg = {}
    arg[localeType] = locales
    queryObj.push(arg)
  }

  return getData(queryObj, summaryCols, selectCols)
}

const getData = function (queryObj, summaryCols, selectCols) {
  console.log(JSON.stringify(queryObj))
  console.log(JSON.stringify(summaryCols))
  console.log(JSON.stringify(selectCols))
  var result = db.get('disasterRecs').value()
  for (var phrase in queryObj) {
    var query = queryObj[phrase]
    var column = _.keys(query)[0]
    console.log(`column: ${JSON.stringify(column)}`)
    var argument = query[column]
    console.log(`argument: ${JSON.stringify(argument)}`)
    console.log(`before applying arguments, result length: ${result.length}`)
    var compositeResult = []
    _.each(argument, val => {
      var arg = {}
      arg[column] = val
      console.log(`applying arg: ${JSON.stringify(arg)}`)
      compositeResult = _.concat(compositeResult, _.filter(result, arg))
      console.log(`compositeResult length after applying: ${compositeResult.length}`)
    })
    result = compositeResult
    console.log(`compositeResult length: ${compositeResult.length}`)
    console.log(`result length: ${result.length}`)
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
  var numberOfRecords = data.length
  var summary = {numberOfRecords}
  _.forEach(summaryCols, (col) => {
    summary[col] = _.sumBy(data, rec => rec[col])
  })
  return summary
}

const getDisasters = function({state, localeType, locales}, cb) {
  const localeField = hudApi.decodeField(localeType)
  return db.get('disasterRecs').filter(rec => {
    if (rec.dmge_state_cd !== state) return false
    if (!localeField || !locales) return true
    return locales.includes(rec[localeField])
  })
  .map('dster_id')
  .uniq()
  .value()
}

const getDisastersByLocale = function (state, localeType, locales) {
  let queryObj = {state}
  if (localeType) {
    queryObj.localeType = localeType
    queryObj.locales = locales
  }
  const disasterIds = this.getDisasters(queryObj)
  const disasterCond = `(disasterNumber eq ${disasterIds.join(' or disasterNumber eq ')})`
  let filter = `state eq '${state}' and ${disasterCond}`
  return new Promise((resolve, reject) => {
    fema.getDisasters({filter}, (err, disasters) => {
      if (err) return reject(err)
      resolve(disasters)
    })
  })
}


module.exports = { getData, getSummaryRecords, summarizeCols, getDisasters, getDisastersByLocale, getLocales }
