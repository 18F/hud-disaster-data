const express = require('express')
const router = express.Router()
const request = require('request')
const moment = require('moment')
const _ = require('lodash')
const querystring = require('querystring')
const csv = require('express-csv')

const txDummyCityData = ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Laredo', 'Lubbock', 'Garland', 'Irving', 'Amarillo', 'Grand Prairie', 'Brownsville', 'Pasadena', 'Mesquite', 'McKinney', 'McAllen', 'Killeen', 'Waco', 'Carrollton', 'Beaumont', 'Abilene', 'Frisco', 'Denton', 'Midland', 'Wichita Falls', 'Odessa', 'Round Rock', 'Richardson', 'Tyler', 'Lewisville', 'College Station', 'The Woodlands CDP', 'San Angelo', 'Pearland', 'Allen', 'League City', 'Longview', 'Sugar Land', 'Edinburg', 'Mission', 'Bryan', 'Baytown', 'Pharr', 'Missouri City', 'Temple', 'Atascocita CDP', 'Harlingen', 'Flower Mound town', 'North Richland Hills', 'Victoria', 'New Braunfels', 'Mansfield', 'Conroe', 'Rowlett', 'Spring CDP', 'Port Arthur', 'Euless', 'DeSoto', 'Cedar Park', 'Galveston', 'Georgetown', 'Bedford', 'Pflugerville', 'Grapevine', 'Texas City', 'Cedar Hill', 'San Marcos', 'Haltom City', 'Wylie', 'Keller', 'Coppell', 'Huntsville', 'Duncanville', 'Sherman', 'Channelview CDP', 'Rockwall', 'Hurst', 'Burleson', 'Mission Bend CDP', 'Texarkana', 'Lancaster', 'The Colony', 'Friendswood', 'Weslaco', 'Del Rio', 'Lufkin', 'San Juan', 'La Porte', 'Nacogdoches', 'Copperas Cove', 'Socorro', 'Deer Park', 'Schertz', 'Rosenberg', 'Waxahachie', 'Fort Hood CDP', 'Cleburne', 'Farmers Branch', 'Kyle', 'Big Spring', 'Lake Jackson', 'Harker Heights', 'Southlake', 'Leander', 'Eagle Pass', 'Kingsville', 'Little Elm', 'Greenville', 'Weatherford', 'Seguin', 'Paris', 'San Benito', 'Alvin', 'Corsicana', 'Balch Springs', 'Marshall', 'Watauga', 'University Park', 'Cloverleaf CDP', 'Colleyville', 'West Odessa CDP', 'Denison', 'Kerrville', 'Plainview', 'Brushy Creek CDP', 'Canyon Lake CDP', 'Benbrook', 'Sachse', 'Corinth', 'Saginaw', 'Brownwood', 'Alice', 'Fresno CDP', 'Angleton', 'Palestine', 'Dickinson', 'Orange', 'Universal City', 'Ennis', 'Alamo', 'Cinco Ranch CDP', 'Belton', 'Converse', 'Midlothian', 'Pampa', 'Murphy', 'Stafford', 'Bay City', 'Nederland', 'Stephenville', 'South Houston', 'Bellaire', 'Mineral Wells', 'Horizon City', 'Jollyville CDP', 'Groves', 'White Settlement', 'Gainesville', 'Pecan Grove CDP', 'Aldine CDP', 'Terrell', 'Donna', 'Gatesville', 'Uvalde', 'Brenham', 'Mercedes', 'Mount Pleasant', 'Sulphur Springs', 'Hereford', 'Cibolo', 'Taylor', 'New Territory CDP', 'Humble', 'Portland', 'Highland Village', 'Seagoville', 'West University Place', 'Hutto', 'Dumas', 'Forney', 'Jacksonville', 'La Marque', 'Katy', 'Rio Grande City', 'Sienna Plantation CDP', 'Henderson', 'San Elizario CDP', 'Hewitt', 'Levelland', 'Timberwood Park CDP', 'Canyon', 'Borger', 'Live Oak', 'Addison town', 'Port Neches', 'Kilgore', 'Beeville', 'Crowley', 'Athens', 'Lockhart', 'Rendon CDP', 'Four Corners CDP', 'Forest Hill', 'Alton', 'Port Lavaca', 'Santa Fe', 'Wells Branch CDP', 'Freeport', 'La Homa CDP', 'Seabrook', 'Lumberton', 'Richmond', 'El Campo', 'Greatwood CDP', 'Robstown', 'Lakeway', 'Raymondville', 'Glenn Heights', 'Clute', 'Snyder', 'Hidalgo', 'Andrews', 'Vernon', 'Azle', 'Sweetwater', 'Galena Park', 'Burkburnett', 'Red Oak', 'Tomball', 'Vidor', 'Jacinto City', 'Fredericksburg', 'Robinson', 'Boerne', 'Webster']
const wiDummyCityData = ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha', 'Racine', 'Appleton', 'Waukesha', 'Oshkosh', 'Eau Claire', 'Janesville', 'West Allis', 'La Crosse', 'Sheboygan', 'Wauwatosa', 'Fond du Lac', 'New Berlin', 'Wausau', 'Brookfield', 'Beloit', 'Greenfield', 'Menomonee Falls village', 'Franklin', 'Oak Creek', 'Manitowoc', 'West Bend', 'Sun Prairie', 'Superior', 'Stevens Point', 'Mount Pleasant village', 'Neenah', 'Fitchburg', 'Caledonia village', 'Muskego', 'Watertown', 'De Pere', 'Mequon', 'South Milwaukee', 'Germantown village', 'Pleasant Prairie village', 'Marshfield', 'Wisconsin Rapids', 'Cudahy', 'Onalaska', 'Middleton', 'Howard village', 'Menasha', 'Ashwaubenon village', 'Menomonie', 'Beaver Dam', 'Oconomowoc', 'Kaukauna', 'River Falls']
const iaDummyCountyData = ['Polk County', 'Linn County', 'Scott County', 'Black Hawk County', 'Johnson County', 'Woodbury County', 'Dubuque County', 'Pottawattamie County', 'Story County', 'Dallas County', 'Clinton County', 'Cerro Gordo County', 'Warren County', 'Muscatine County', 'Des Moines County', 'Marshall County', 'Webster County', 'Jasper County', 'Lee County', 'Wapello County', 'Marion County', 'Sioux County', 'Benton County', 'Boone County', 'Plymouth County', 'Bremer County', 'Mahaska County', 'Washington County', 'Winneshiek County', 'Buchanan County', 'Fayette County', 'Carroll County', 'Henry County', 'Jones County', 'Jackson County', 'Buena Vista County', 'Poweshiek County', 'Clayton County', 'Cedar County', 'Delaware County', 'Hardin County', 'Tama County', 'Clay County', 'Dickinson County', 'Crawford County', 'Floyd County', 'Iowa County', 'Hamilton County', 'Page County', 'Kossuth County', 'Harrison County', 'Jefferson County', 'Madison County', 'Butler County', 'Mills County', 'Allamakee County', 'O Brien County', 'Cass County', 'Wright County', 'Appanoose County', 'Chickasaw County', 'Shelby County', 'Grundy County', 'Cherokee County', 'Union County', 'Louisa County', 'Hancock County', 'Guthrie County', 'Lyon County', 'Winnebago County', 'Montgomery County', 'Keokuk County', 'Mitchell County', 'Sac County', 'Emmet County', 'Calhoun County', 'Franklin County', 'Humboldt County', 'Greene County', 'Palo Alto County', 'Howard County', 'Monona County', 'Lucas County', 'Clarke County', 'Davis County', 'Decatur County', 'Adair County', 'Pocahontas County', 'Van Buren County', 'Monroe County', 'Fremont County', 'Worth County', 'Ida County', 'Osceola County', 'Taylor County', 'Audubon County', 'Wayne County', 'Ringgold County', 'Adams County']
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
*  Generates a CSV file with the columns: 'Requested Disaster Type', 'Requested Disaster Number', and 'Requested Disaster State Abbr'<br/>
*  The records will contain the individual disaster type, disaster number, and disaster state abbreviation for each disaster passed in.
* @function get
* @param {qry} - a comma separated list of disaster id's
*/
router.get('/export/:fileNamePart', function (req, res) {
  var fileName = `hud-fema-data-${req.params.fileNamePart}`
  var disasterNumbers = _.get(req, 'query.disasters').split(',')
  if (!disasterNumbers || disasterNumbers[0].length === 0) return res.status(406).send('No disaster numbers sent. Not Acceptable.')
  var resultSet = [['Requested Disaster Type', 'Requested Disaster Number', 'Requested Disaster State Abbr']]
  _.map(disasterNumbers, disasterNumber => {
    var disasterNumberPieces = disasterNumber.split('-')
    resultSet.push([disasterNumberPieces[0], disasterNumberPieces[1], disasterNumberPieces[2]])
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
  if (state === 'TX' && level === 'city') {
    res.json(_.map(txDummyCityData, data => { return {code: data, name: data} }))
  } else if (state === 'WI' && level === 'city') {
    res.json(_.map(wiDummyCityData, data => { return {code: data, name: data} }))
  } else if (state === 'IA' && level === 'county') {
    res.json(_.map(iaDummyCountyData, data => { return {code: data, name: data} }))
  } else {
    res.json(['no data found'])
  }
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

// Routes
// GET /disaster_id/:id
router.get('/db', (req, res) => {
  const dbApi = require('./dbApi')
  var disasterId = _.get(req.query, 'disasterId')
  var stateId = _.get(req.query, 'stateId')
  var columns = _.get(req.query, 'columns')
  columns = columns ? columns.split(',') : null
  var summarize
  if (_.get(req.query, 'summarize') === 'true') summarize = true
  var queryObj
  if (disasterId) {
    queryObj = ['disaster_id', disasterId.toString()]
  } else if (stateId) {
    queryObj = ['damaged_state', stateId.toUpperCase()]
  } else {
    res.status(406).send('No query parameters sent. Not Acceptable.')
    return
  }
  var results = dbApi.getData(queryObj, summarize, columns)
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
