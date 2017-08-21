const express = require('express')
const router = express.Router()
const request = require('request')
const moment = require('moment')
const _ = require('lodash')
const querystring = require('querystring')
const csv = require('express-csv')
const hudApi = require('../middleware/hudApi')
const fema = require('../middleware/fema')
const version = require('../../package.json').version
router.get('/version', function (req, res) {
  res.send(version)
})
router.get('/states/:state/disasters', function (req, res) {
  const state = req.params.state
  const queryParams = _.get(req, 'query')
  const validLocaleTypes = ['city', 'county', 'congrdist']
  let localeType
  let locales
  let errMessage = 'Invalid parameters sent.  Use one of: city, county, or congrdist, with a comma separated list of values. Not Acceptable.'
  if (!_.isEmpty(queryParams)) {
    localeType = _.findKey(queryParams)
    if (_.indexOf(validLocaleTypes, localeType) !== -1) locales = queryParams[localeType]
    else return res.status(406).send(errMessage)
    if (!locales) return res.status(406).send(errMessage)
  }
  let queryObj = {state: req.params.state}
  if (localeType) {
    queryObj.localeType = localeType
    queryObj.locales = locales
  }
  const disasterIds = hudApi.getDisasters(queryObj)
  const disasterCond = `(disasterNumber eq ${disasterIds.join(' or disasterNumber eq ')})`
  let filter = `state eq '${state}' and ${disasterCond}`
  fema.getDisasters({filter}, (err, disasters) => {
    if (err) return res.send(500, {err: err.message})
    res.json(disasters)
  })
})

/**
* router.get('/states/:stateId/:localeType') <br/>
* @function get
* @param {stateId}- a state id
* @param {localeType}- a geographic level (city, county, congrdist)
**/
router.get('/states/:stateId/:localeType', (req, res) => {
  var stateId = req.params.stateId.toUpperCase()
  var localeType = hudApi.decodeField(req.params.localeType)
  if (!localeType) return
  var selectCols = [localeType]
  var queryObj = []
  queryObj.push({'dmge_state_cd': [stateId]})
  var data = hudApi.getData(queryObj, null, selectCols)
  var results = _.map(_.uniqBy(data, l => JSON.stringify(l)), localeType)
  res.json(results)
})

/**
* Creates the routes for the backend functionality.
* @module lib/controllers/api
*/
/**
* @swagger
* /disasterquery/{qry}:
*   get:
*     description: queries [FEMA API](https://www.fema.gov/api/open/v1), and returns disaster data
*     produces:
*       - application/json
*     parameters:
*       - in: path
*         name: qry
*         description: one or more of the disaster type, the disaster number, the state. If more than one, needs to start with disaster type,
*           followed by a dash (-), followed by diaster number, optionally followed by another dash and the state abbreviation.
*         required: true
*         type: string
*     responses:
*       200:
*         description: A list of disasters
*         schema:
*           type: array
*           items:
*             $ref: '#/definitions/Disaster'
*/
/**
* router.get('/disasterquery/:qry') <br/>
*  queries FEMA API  (https://www.fema.gov/api/open/v1), and returns disaster data
* @function get
* @param {qry} - one or more of: the disaster type, the disaster number, the state. If more than one, needs to start with disaster type,
* followed by a dash (-), followed by diaster number, optionally followed by another dash and the state abbreviation.
*/
router.get('/disasterquery/:qry', function (req, res) {
  const qryParts = req.params.qry.replace(/-$/, '').toUpperCase().split('-')
  const tenYearsAgo = moment().subtract(10, 'years')
  let filter = `declarationDate gt '${tenYearsAgo.toString()}'`
  if (qryParts.length === 1 && /^\d+$/.test(qryParts[0])) filter += ` and disasterNumber eq ${qryParts[0]}`
  else if (qryParts.length === 1 && /^[A-Z]+$/.test(qryParts[0])) filter += ` and ( disasterType eq '${qryParts[0]}' or state eq '${qryParts[0]}')`
  else if (qryParts.length === 2) filter += ` and disasterType eq '${qryParts[0]}' and disasterNumber eq ${qryParts[1]}`
  else filter += ` and disasterType eq '${qryParts[0]}' and disasterNumber eq ${qryParts[1]} and state eq '${qryParts[2]}' `
  fema.getDisasters({
    filter: filter,
    orderBy: 'declarationDate desc',
    top: 250
  }, (err, data) => {
    if (err) return res.send(503, {status: err.status, message: err.message})
    res.json(data)
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
  var results = hudApi.getData([{[hudApi.decodeField('state')]: states}, {[hudApi.decodeField('disaster')]: numbers}])
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
  fema.getDisasters({
    filter: `${filter}`
  }, (err, data) => {
    if (err) return res.send(503, {status: err.status, message: err.message})
    res.json(data)
  })
})

/**
* router.get('/applicants/export') <br/>
* @function get
* @param {disasters}- a comma separated list of disaster id's
* @param {state}- a state id
* @param {localeType}- a type of geographic area
* @param {locales}- a comma separated list of geographic area's, requires specifying geoName
* @param {cols}- a comma separated list of columns to be returned, or to be returned with the summed values
**/
router.get('/applicants/:queryType', (req, res) => {
  var queryType = req.params.queryType
  if (queryType !== 'export' && queryType !== 'summary') {
    res.status(406).send('Invalid url. Not Acceptable.')
    return
  }
  var summaryCols
  var selectCols
  var cols = _.get(req.query, 'cols')
  if (cols) cols = cols.split(',')
  if (queryType === 'export') selectCols = cols
  else summaryCols = cols

  var disasters = _.get(req.query, 'disasters')
  if (disasters) disasters = disasters.split(',')
  var stateId = _.get(req.query, 'stateId')
  if (stateId) stateId = stateId.toUpperCase().split(',')
  var locales = _.get(req.query, 'locales')
  if (locales) {
    locales = _.map(locales.split(','), area => {
      return area
    })
  }
  var localeType = hudApi.decodeField(_.get(req.query, 'localeType'))
  if ((localeType && !locales) || (!localeType && locales)) {
    res.status(406).send('Improper query parameters sent. You must provide both localeType and values, or neither. Not Acceptable.')
    return
  }
  var queryObj = []
  if (disasters) queryObj.push({[hudApi.decodeField('disaster')]: disasters})
  if (stateId) queryObj.push({[hudApi.decodeField('state')]: stateId})
  if (localeType && locales) {
    var arg = {}
    arg[localeType] = locales
    queryObj.push(arg)
  }
  var results = hudApi.getData(queryObj, summaryCols, selectCols)
  res.json(results)
})

module.exports = router

/**
* @swagger
* definitions:
*   Disaster:
*     type: object
*     properties:
*       disasterNumber:
*         type: integer
*         format: int64
*       ihProgramDeclared:
*         type: boolean
*       iaProgramDeclared:
*         type: boolean
*       paProgramDeclared:
*         type: boolean
*       hmProgramDeclared:
*         type: boolean
*       state:
*         type: string
*         description: A valid 2 charcter state code
*       declarationDate:
*         type: string
*         format: date-time
*       disasterType:
*         type: string
*       incidentType:
*         type: string
*       title:
*         type: string
*       incidentBeginDate:
*         type: string
*         format: date-time
*       incidentEndDate:
*         type: string
*         format: date-time
*       declaredCountyArea:
*         type: string
*       hash:
*         type: string
*         description: A commit like hash with 32 chars
*       lastRefresh:
*         type: string
*         format: date-time
*       disasterCloseOutDate:
*         type: string
*         format: date-time
*       placeCode:
*         type: integer
*         format: int64
*       id:
*         type: string
*         description: A commit like hash with 24 chars
*   Grant:
*     type: object
*     properties:
*       dster_id:
*         type: integer
*         format: int64
*       disaster_type:
*         type: string
*       household_count:
*         type: integer
*       last_name:
*         type: string
*       first_name:
*         type: string
*       coapplicant_lname:
*         type: string
*       coapplicant_fname:
*         type: string
*       reg_id:
*         type: integer
*         format: int64
*       current_mailing_street:
*         type: string
*       current_mailing_city:
*         type: string
*       current_mailing_state:
*         type: string
*       current_mailing_zip:
*         type: integer
*       phone_area_code:
*         type: integer
*       phone_local:
*         type: integer
*       alt_phone_area_code:
*         type: integer
*       alt_phone_local:
*         type: integer
*       damaged_street:
*         type: string
*       damaged_city:
*         type: string
*       dmge_state_cd:
*         type: string
*       damaged_zip5:
*         type: integer
*       damaged_zip_plus4:
*         type: integer
*       county_name:
*         type: string
*       household_size:
*         type: integer
*       number_of_dependents:
*         type: integer
*       income:
*         type: number
*       special_needs:
*         type: boolean
*       residence_owned:
*         type: string
*       insurance:
*         type: string
*       hazard_insurance:
*         type: boolean
*       hazard_insurance_co:
*         type: string
*       hazard_insurance_amt:
*         type: number
*       flood_insurance:
*         type: boolean
*       flood_insurance_amt:
*         type: number
*       other_insurance:
*         type: boolean
*       other_insurance_amt:
*         type: number
*       fema_inspection:
*         type: string
*       single_family:
*         type: boolean
*       multifamily:
*         type: boolean
*       real_prop_loss:
*         type: number
*       destroyed:
*         type: boolean
*       water_level:
*         type: number
*       water_level_bsmt:
*         type: number
*       high_water_loc:
*         type: string
*       flooded:
*         type: boolean
*       flood_dmg_amt:
*         type: number
*       foundation_dmg:
*         type: boolean
*       foundation_dmg_amt:
*         type: number
*       roof_dmg:
*         type: boolean
*       roof_dmg_amt:
*         type: number
*       temp_shelter_eligible:
*         type: boolean
*       temp_shelter_amt:
*         type: number
*       mobile_home:
*         type: boolean
*       mobile_home_dt:
*         type: boolean
*       mobile_home_loc:
*         type: string
*       rent_asst:
*         type: boolean
*       rent_asst_amt:
*         type: number
*       rent_asst_ineligible:
*         type: string
*       repair:
*         type: boolean
*       repair_amt:
*         type: number
*       repair_ineligible:
*         type: string
*       replacement:
*         type: boolean
*       replacement_amt:
*         type: number
*       replacement_ineligible:
*         type: string
*       sba_eligible:
*         type: boolean
*       sba_amt:
*         type: number
*       personal_prop_asst:
*         type: boolean
*       personal_prop_asst_amt:
*         type: number
*       other_asst:
*         type: boolean
*       other_asst_amt:
*         type: number
*       urgent_repair_required:
*         type: boolean
*       rent_asst_end_dt:
*         type: string
*         format: date
*       rent_asst_street:
*         type: string
*       rent_asst_city:
*         type: string
*       rent_asst_state:
*         type: string
*       rent_asst_zip:
*         type: integer
*       total_damages:
*         type: number
*       total_asst_amt:
*         type: number
*       hud_unmet_need:
*         type: number
*       lat:
*         type: number
*       lon:
*         type: number
*       fcd_fips91:
*         type: integer
*       state2kx:
*         type: integer
*       cnt2kx:
*         type: integer
*       tract2kx:
*         type: string
*       bg2kx:
*         type: integer
*       place2kx:
*         type: integer
*       CORE_BASD_STSCL_AREA_CD:
*         type: integer
*       std_addr:
*         type: string
*       std_city:
*         type: string
*       std_st:
*         type: string
*       std_zip5:
*         type: integer
*       cnty_nm2kx:
*         type: string
*       cosub_nmcur:
*         type: string
*       place_nm2kx:
*         type: string
*       cbsa_nm:
*         type: string
*       c1pgcr:
*         type: string
*       c1pprb:
*         type: number
*       msgusps:
*         type: string
*       rc2kx:
*         type: string
*/
