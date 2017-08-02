const express = require('express')
const router = express.Router()
const request = require('request')
const moment = require('moment')
const _ = require('lodash')
const querystring = require('querystring')
const csv = require('express-csv')
const dbApi = require('./dbApi')

/**
* Creates the routes for the backend functionality.
* @module lib/controllers/api
*/
/**
* router.get('/disasterquery/:qry') <br/>
*  queries FEMA API  (https://www.fema.gov/api/open/v1), and returns disaster data
* @function get
* @param {qry} - one or more of: the disaster type, the disaster number, the state. If more than one, needs to start with disaster type,
* followed by a dash (-), followed by diaster number, optionally followed by another dash and the state abbreviation.
*/
router.get('/disasterquery/:qry', function (req, res) {
  const validCols = ['id', 'disasterNumber', 'state', 'declarationDate', 'disasterType', 'placeCode', 'incidentType', 'declaredCountyArea', 'title']
  const qryParts = req.params.qry.replace(/-$/, '').toUpperCase().split('-')
  const tenYearsAgo = moment().subtract(10, 'years')
  let filter = `declarationDate gt '${tenYearsAgo.toString()}'`
  if (qryParts.length === 1 && /^\d+$/.test(qryParts[0])) filter += ` and disasterNumber eq ${qryParts[0]}`
  else if (qryParts.length === 1 && /^[A-Z]+$/.test(qryParts[0])) filter += ` and ( disasterType eq '${qryParts[0]}' or state eq '${qryParts[0]}')`
  else if (qryParts.length === 2) filter += ` and disasterType eq '${qryParts[0]}' and disasterNumber eq ${qryParts[1]}`
  else filter += ` and disasterType eq '${qryParts[0]}' and disasterNumber eq ${qryParts[1]} and state eq '${qryParts[2]}' `

  const qs = querystring.stringify({
    $filter: filter,
    $orderby: 'declarationDate desc',
    $top: 250
  })
  const selectCols = `$select=${validCols.join()}` // Left out of stringify because it's excaping commas and FEMA API doesn't like it
  const url = `https://www.fema.gov/api/open/v1/DisasterDeclarationsSummaries?${qs}&${selectCols}`
  console.log(url)
  request(url, function (err, response, body) {
    // TODO handle error for cases when FEMA API responds with body starting wth '<!DOCTYPE html>' +bug id:2 gh:9
    var data
    try {
      data = JSON.parse(body, (key, value) => {
        return key === 'declarationDate' ? moment(value).format('MMMM DD, YYYY') : value
      })
    } catch (e) {
      return res.send(503, {status: response.statusCode, message: e.message})
    }
    var rolledUpData = rollUpData(data)
    res.json(rolledUpData)
  })
})

/**
* router.get('/export/:fileNamePart') <br/>
*  Generates a CSV file with all the columns from the database<br/>
* @function get
* @param {qry} - a comma separated list of disaster id's
*/
router.get('/export/:fileNamePart', function (req, res) {
  var fileName = `hud-fema-data-${req.params.fileNamePart}`
  var disasterNumbers = _.get(req, 'query.disasters').split(',')
  if (!disasterNumbers || disasterNumbers[0].length === 0) return res.status(406).send('No disaster numbers sent. Not Acceptable.')
  var states = _.uniq(_.map(disasterNumbers, d => d.split('-')[2]))
  var numbers = _.uniq(_.map(disasterNumbers, d => d.split('-')[1]))
  var results = dbApi.getData([{damaged_state: states}, {disaster_id: numbers}])
  if (!results || results.length === 0) return res.status(204).send('No data found.')
  var columns = []
  for (var key in results[0]) columns.push(key)
  var resultSet = [ columns ]
  _.map(results, rec => {
    resultSet.push(_.map(columns, col => { return rec[col] }))
  })
  res.setHeader('Content-disposition', `attachment; filename="${fileName}.csv"`)
  res.csv(resultSet)
})

/**
* router.get('/localequery/:fileNamePart') <br/>
*  queries our data to return locales within the selected state
* @function get
* @param {qry} - a 2 character state abbreviation
*/
router.get('/localequery/:state', function (req, res) {
  var state = req.params.state.toUpperCase()
  var level = _.get(req.query, 'level').toLowerCase()
  var desiredLocaleName
  if (level === 'city') desiredLocaleName = 'damaged_city'
  else if (level === 'county') desiredLocaleName = 'county_name'
  else {
    res.json(['no data found'])
    return
  }
  var queryObj = [{damaged_state: [state]}]
  var selectCols = [desiredLocaleName]
  var summaryCols
  console.log(JSON.stringify(queryObj))
  var data = dbApi.getData(queryObj, summaryCols, selectCols)
  var returnValue = ['no data found']
  if (data.length > 0) {
    var values = _.uniq(_.map(data, rec => rec[desiredLocaleName]))
    returnValue = _.sortBy(_.map(values, rec => { return {code: rec, name: rec} }), 'code')
  }
  res.json(returnValue)
})

/**
* router.get('/disasternumber/:qry') <br/>
*  queries FEMA API  (https://www.fema.gov/api/open/v1), and returns disaster data for specific disasters
* @function get
* @param {qry}- a comma separated list of disaster id's
*/
router.get('/disasternumber/:qry', function (req, res) {
  const disasterNbrs = req.params.qry.toUpperCase().split(',')
  var filter = ''
  for (var arg in disasterNbrs) {
    var qryParts = disasterNbrs[arg].split('-')
    if (arg > 0) filter += ' or '
    filter += `( disasterType eq '${qryParts[0]}' and disasterNumber eq ${qryParts[1]} and state eq '${qryParts[2]}' )`
  }
  const qs = querystring.stringify({
    $filter: `${filter}`
  })
  const url = `https://www.fema.gov/api/open/v1/DisasterDeclarationsSummaries?${qs}`
  console.log(url)
  request(url, function (err, response, body) {
    // TODO handle error for cases when FEMA API responds with body starting wth '<!DOCTYPE html>' +bug id:2 gh:9
    var data
    try {
      data = JSON.parse(body, (key, value) => {
        return key === 'declarationDate' ? moment(value).format('MMMM DD, YYYY') : value
      })
    } catch (e) {
      return res.send(503, {status: response.statusCode, message: e.message})
    }
    var rolledUpData = rollUpData(data)
    res.json(rolledUpData)
  })
})

/**
* router.get('/db') <br/>
* @function get
* @param {disasterId}- a comma separated list of disaster id's
* @param {stateId}- a comma separated list of state id's
* @param {geoArea}- a comma separated list of geographic area's, requires specifying geoName
* @param {selectCols}- a comma separated list of columns to be returned
* @param {summaryCols}- a comma separated list of columns to be returned with the summed values
**/
router.get('/db', (req, res) => {
  var disasterId = _.get(req.query, 'disasterId')
  if (disasterId) disasterId = disasterId.split(',')
  var stateId = _.get(req.query, 'stateId')
  if (stateId) stateId = stateId.toUpperCase().split(',')
  else {
    res.status(406).send('Invalid parameters sent. You must provide at least a stateId. Not Acceptable.')
    return
  }
  var selectCols = _.get(req.query, 'selectCols')
  if (selectCols) selectCols = selectCols.split(',')
  var geoArea = _.get(req.query, 'geoArea')
  if (geoArea) {
    geoArea = _.map(geoArea.split(','), area => {
      return area
    })
  }
  var geoName = _.get(req.query, 'geoName')
  if ((geoName && !geoArea) || (!geoName && geoArea)) {
    res.status(406).send('Improper query parameters sent. You must provide both geoName and values, or neither. Not Acceptable.')
    return
  }
  var summaryCols = _.get(req.query, 'summaryCols')
  summaryCols = summaryCols ? summaryCols.split(',') : null
  var queryObj = []
  if (disasterId) queryObj.push({'disaster_id': disasterId})
  if (stateId) queryObj.push({'damaged_state': stateId})
  if (geoName && geoArea) {
    var arg = {}
    arg[geoName] = geoArea
    queryObj.push(arg)
  }
  var results = dbApi.getData(queryObj, summaryCols, selectCols)
  res.json(results)
})

const rollUpData = (data) => {
  var rolledUpData = []
  if (_.get(data, 'DisasterDeclarationsSummaries')) {
    data.DisasterDeclarationsSummaries.forEach((record) => {
      var disasterRecFound = false
      for (var x in rolledUpData) {
        var existingRecord = rolledUpData[x]
        if (record.disasterNumber === existingRecord.disasterNumber) disasterRecFound = x
      }
      if (!disasterRecFound) {
        record.declaredCountyArea = [record.declaredCountyArea]
        rolledUpData.push(record)
      } else rolledUpData[disasterRecFound].declaredCountyArea.push(record.declaredCountyArea)
    })
  }
  return rolledUpData
}
module.exports = router
