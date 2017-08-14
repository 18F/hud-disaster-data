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
*       disaster_id:
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
*       damaged_state:
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
