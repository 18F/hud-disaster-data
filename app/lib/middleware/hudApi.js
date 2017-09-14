const _ = require('lodash')
const axios = require('axios')
const low = require('lowdb')
const fileAsync = require('lowdb/lib/storages/file-async')
const https = require('https')
const fs = require('fs')
const path = require('path')
const certPath = path.join(__dirname,'..','..','certs','esbapi-dev.hhq.hud.dev.cer')
console.log(`*** cert path: ${certPath} ***`)
const cert = fs.readFileSync(certPath)
console.log(`*** cert:\n ${cert} \n***`)

const SERVICE_CONSUMER_DATA = {
    "auditCorrelationId":"17f24136-2494-4bf8-9d3b-9baafaae0cc9",
    "serviceRequestTimestamp":"2017-01-01T12:00:00.000Z",
    "sourceSystem":"DRDP",
    "endUserId":"drdp_user",
    "authenticationId":"DRDPAccount",
    "tenantId":"DRDP",
    "locale":"English"
  }

const getUser = function(userid, cb) {
  let config = {
    headers: {
      serviceConsumerData: JSON.stringify(SERVICE_CONSUMER_DATA)
    },
    cert
  }
  client.get(`${process.env.HUD_API_BASE}/user/${userid}`, config)
    .then(res => cb(null, res.data))
    .catch(err => {
      console.log('Error getting user', err)
      cb(err)
    })
}

// const getLocales = function(user, state, type) {
//
// }

// Start database using file-async storage
// For ease of use, read is synchronous
const db = low('mock-data/REAC Modified Database.json', {
  storage: fileAsync
})

const databaseFieldReference = {
  disaster: 'dster_id',
  state: 'dmge_state_cd',
  city: 'dmge_city_name',
  county: 'cnty_name',
  congrdist: 'fcd_fips91_cd'
}

const decodeField = (fieldname) => {
  return databaseFieldReference[fieldname]
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
  const localeField = decodeField(localeType)
  return db.get('disasterRecs').filter(rec => {
    if (rec.dmge_state_cd !== state) return false
    if (!localeField || !locales) return true
    return locales.includes(rec[localeField])
  })
  .map('dster_id')
  .uniq()
  .value()
}

module.exports = { getData, summarizeCols, getDisasters, decodeField, getUser }
