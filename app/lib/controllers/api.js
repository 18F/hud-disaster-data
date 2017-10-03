const express = require('express')
const router = express.Router()
const request = require('request')
const moment = require('moment')
const _ = require('lodash')
const querystring = require('querystring')
const csv = require('express-csv')
const hudApi = require('../middleware/hudApi')
const localAPI = require('../middleware/localAPI')
const fema = require('../middleware/fema')
const version = require('../../package.json').version
const requestPromise = require('request-promise')
const isHUDHQUser = require('../middleware/auth').isHUDHQUser

const validLocaleTypes = ['city', 'county', 'congrdist', 'zipcode', 'township', 'tract']

/**
* Creates the routes for the backend functionality. <br/>
*
* @module lib/controllers/api
*/

/**
* router.get('/version') <br/>
* @returns  will display the version number of the application <br/>
* @function /version
*
**/
router.get('/version', function (req, res) {
  res.send(version)
})

/**
* router.get('/states/:state/disasters') <br/>
*  will return a list of disasters for a state, optionally filtered by a list locales <br/>
* @function  /states/:state/disasters
* @returns array of disaster numbers
* @example // returns disaster array that is limited by the specified locales (in this case, the Wisconsin cities Madison and Monroe)
*  get /states/WI/disasters?city=Madison,Monroe
* @param {string} :state - a state id
* @param {string} localeType - (optional) a geographic level (city, county, congrdist, zipcode, township, tract )
* @param {string} locales - (optional) a comma separated list of locales by which to filter the disasters
**/
router.get('/states/:state/disasters', function (req, res, next) {
  const state = req.params.state
  const queryParams = req.query
  let localeType
  let locales = []
  let errMessage = 'Invalid parameters sent.  Use one of: city, county, congrdist, zipcode, township, or tract with a comma separated list of values. Not Acceptable.'
  if (!_.isEmpty(queryParams)) {
    localeType = _.keys(queryParams)
    if (localeType.length > 1) return res.status(400).send(errMessage)
    else localeType = localeType[0]
    if (_.indexOf(validLocaleTypes, localeType) > -1) locales = queryParams[localeType]
    else return res.status(400).send(errMessage)
    if (_.isEmpty(locales)) return res.status(400).send(errMessage)
  }

  const api = (process.env.DRDP_LOCAL) ? localAPI : hudApi
  api.getDisastersByLocale(req.params.state, localeType, locales)
      .then(disasters => res.json(disasters))
      .catch(next)
})

/**
* router.get('/states/:stateId/:localeType') <br/>
*  will return a list of disasters for a state, optionally filtered by a list locales <br/>
* @function  /states/:stateId/:localeType
* @returns array of locales
* @example // returns array of locales (in this case, the Texas Congressional Districts)
*  get /states/TX/congrdist
* @param {string} :stateId - a state id
* @param {string} :localeType - a geographic level (city, county, congrdist, zipcode, township, tract )
**/
router.get('/states/:stateId/:localeType', (req, res, next) => {
  var stateId = req.params.stateId.toUpperCase()
  let localeType = req.params.localeType

  if (process.env.DRDP_LOCAL) {
    res.json(localAPI.getLocales(stateId, localeType))
  } else {
    hudApi.getLocales(req.user, stateId, localeType)
      .then(locales => res.json(_.map(locales, 'name')))
      .catch(err => {
        console.log('Error calling getLocales:', err)
        next(err)
      })
  }
})

/**
* router.get('/disasterquery/:qry') <br/>
*  queries FEMA API  (https://www.fema.gov/api/open/v1), and returns disaster data
* @function  /disasterquery/:qry
* @param {string} :qry - one or more of: the disaster type, the disaster number, the state. If more than one, needs to start with disaster type,
* followed by a dash (-), followed by diaster number, optionally followed by another dash and the state abbreviation.
* @example // returns array of disasters (in this case, of disasterType DR)
*  get /disasterquery/DR
*
* // returns array of disasters (in this case, of disasterNumber 4311)
*  get /disasterquery/4311
*/
router.get('/disasterquery/:qry', function (req, res) {
  const hqUser = isHUDHQUser(req)
  const qryParts = req.params.qry.replace(/-$/, '').toUpperCase().split('-')
  let filter
  if (qryParts.length === 1 && /^\d+$/.test(qryParts[0])) filter = `disasterNumber eq ${qryParts[0]}`
  else if (qryParts.length === 1 && /^[A-Z]+$/.test(qryParts[0])) filter = `(disasterType eq '${qryParts[0]}' or state eq '${qryParts[0]}')`
  else if (qryParts.length === 2) filter = `disasterType eq '${qryParts[0]}' and disasterNumber eq ${qryParts[1]}`
  else filter = `disasterType eq '${qryParts[0]}' and disasterNumber eq ${qryParts[1]} and state eq '${qryParts[2]}' `
  console.log('*** Getting disasters for user: ', req.user)
  if (!req.user.disasterids.length && !hqUser) return res.json([])
  if (req.user.disasterids && !hqUser) {
    console.log('*** Adding a filter for user allowed disasters')
    filter += ` and (disasterNumber eq ${req.user.disasterids.join(' or disasterNumber eq ')})`
  }
  console.log('*** filter:', filter)
  fema.getDisasters({
    filter: filter,
    orderBy: 'declarationDate desc'
  }, (err, data) => {
    if (err) return res.send(503, {status: err.status, message: err.message})
    res.json(data)
  })
})

/**
* router.get('/disasternumber/:qry') <br/>
*  queries FEMA API  (https://www.fema.gov/api/open/v1), and returns disaster data for specific disasters
* @function /disasternumber/:qry
* @param {string} :qry - a comma separated list of disaster id's
* @example // returns disaster array that is limited by the specified disasters (in this case, the Wisconsin cities Madison and Monroe)
*  get /disasternumber/DR-4311-UT,FM-5130-UT,FM-5182-WA
*/
router.get('/disasternumber/:qry', function (req, res) {
  let disasterNbrs = req.params.qry.toUpperCase().split(',')
  if (req.user.disasterids && !isHUDHQUser(req)) {
    disasterNbrs = _.filter(disasterNbrs, disasterNumber => {
      let parts = disasterNumber.split('-')
      let id = parts[1]
      if (req.user.disasterids.includes(id)) return true
      return false
    })
  }
  if (!disasterNbrs.length) return res.json([])
  var filter = ''
  for (var arg in disasterNbrs) {
    var qryParts = disasterNbrs[arg].split('-')
    if (arg > 0) filter += ' or '
    filter += `( disasterType eq '${qryParts[0]}' and disasterNumber eq ${qryParts[1]} and state eq '${qryParts[2]}' )`
  }
  fema.getDisasters({
    filter: `${filter}`
  }, (err, data) => {
    if (err) return res.send(503, {status: err.status, message: err.message})
    res.json(data)
  })
})

/**
* router.get('/export/:fileNamePart') <br/>
*  Generates a CSV file with all the columns from the database<br/>
* @function /export/:fileNamePart
* @param {string} :fileNamePart - a string that will be appended to 'hud-fema-data-' to form the download filename
* @param {string} disasters - a comma separated list of disaster id's
* @example // returns CSV for disasters DR-4311-UT,FM-5130-UT, and FM-5182-WA with download filename set to hud-fema-data-MY_FILE_NAME
*  get /export/MY_FILE_NAME?disasters=DR-4311-UT,FM-5130-UT,FM-5182-WA
*/
router.get('/export/:fileNamePart', function (req, res) {
  var fileName = `hud-fema-data-${req.params.fileNamePart}`
  var disasterNumbers = _.get(req, 'query.disasters').split(',')
  if (!disasterNumbers || disasterNumbers[0].length === 0) return res.status(406).send('No disaster numbers sent. Not Acceptable.')
  var states = _.uniq(_.map(disasterNumbers, d => d.split('-')[2]))
  var numbers = _.uniq(_.map(disasterNumbers, d => d.split('-')[1]))
  if (states[0] === undefined || numbers[0] === undefined) return res.status(406).send('Invalid disaster numbers sent. Not Acceptable.')
  var query = `states=${states.join(',')}&disasters=${numbers.join(',')}`
  const uri = `http://${req.headers.host}/api/applicants/export?${query}`
  console.log(`url: ${uri}`)
  requestPromise({ method: 'GET', uri, json: true })
  .then(function (results) {
    if (!results || results.length === 0) return res.status(200).csv([[`No data found for any of the following: ${disasterNumbers.join(', ')}`]])
    var columns = []
    for (var key in results[0]) columns.push(key)
    var resultSet = [ columns ]
    _.map(results, rec => {
      resultSet.push(_.map(columns, col => { return rec[col] }))
    })
    res.setHeader('Content-disposition', `attachment; filename="${fileName}.csv"`)
    res.csv(resultSet)
  })
})

/**
* router.get('/applicants/:queryType') <br/>
*
* @function /applicants/:queryType
* @returns {JSON} - household level data or summary data, filtered by other parameters
* @param {string} :queryType - either summary or export
* @param {string} disasters - a comma separated list of disaster id's
* @param {string} state - a state id
* @param {string} localeType - a type of geographic area
* @param {string} locales - a comma separated list of geographic area's, requires specifying geoName
* @param {string} cols - a comma separated list of columns to be returned, or to be returned with the summed values
* @example // returns JSON with all columns of household level data for disasters 4311,5130, and 5182
*  get /applicants/export?disasters=4311,5130,5182
* // returns JSON with summarized columns numberOfRecords (automatically added to returned columns for summary), total_dmge_amnt, and hud_unmt_need_amnt of household level data for Wisconsin cities Madison and Monroe
*  get /applicants/summary?states=WI&localeType=city&locales=Madison,Monroe&cols=total_dmge_amnt,hud_unmt_need_amnt
**/
router.get('/applicants/:queryType', (req, res, next) => {
  var queryType = req.params.queryType
  if (queryType !== 'export' && queryType !== 'summary') {
    return res.status(406).send('Invalid url. Not Acceptable.')
  }
  var queryString = req.query
  if (_.isEmpty(queryString)) return res.status(400).send('A query string is required')

  var validKeys = ['disasters', 'states', 'locales', 'localeType', 'cols']
  var passedKeys = _.keys(queryString)

  passedKeys.forEach(key => {
    if (!validKeys.includes(key)) return res.status(400).send(`Improper query parameters sent. You must only use ${validKeys}. Not Acceptable.`)
  })

  var cols = queryString.cols
  if (cols) cols = cols.split(',')

  var disasters = queryString.disasters
  if (disasters) disasters = disasters.split(',')

  var state = queryString.states
  if (state) state = state.toUpperCase().split(',')

  var locales = queryString.locales
  if (locales) locales = _.map(locales.split(','), area => area)

  var localeType = queryString.localeType
  if ((localeType && !locales) || (!localeType && locales)) {
    return res.status(400).send('Improper query parameters sent. You must provide both localeType and values, or neither. Not Acceptable.')
  }

  if (process.env.DRDP_LOCAL) {
    return res.json(localAPI.getSummaryRecords({state, localeType, locales, disasters, cols, queryType}))
  }

  hudApi.getSummaryRecords({state, localeType, locales, disasters, cols})
      .then(results => res.json(results))
      .catch(next)
})

module.exports = router
