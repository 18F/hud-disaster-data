const express = require('express')
const router = express.Router()
const request = require('request')
const moment = require('moment')
const _ = require('lodash')
const querystring = require('querystring')
const csv = require('express-csv')

const txDummyData = ['Houston city', 'San Antonio city', 'Dallas city', 'Austin city', 'Fort Worth city', 'El Paso city', 'Arlington city', 'Corpus Christi city', 'Plano city', 'Laredo city', 'Lubbock city', 'Garland city', 'Irving city', 'Amarillo city', 'Grand Prairie city', 'Brownsville city', 'Pasadena city', 'Mesquite city', 'McKinney city', 'McAllen city', 'Killeen city', 'Waco city', 'Carrollton city', 'Beaumont city', 'Abilene city', 'Frisco city', 'Denton city', 'Midland city', 'Wichita Falls city', 'Odessa city', 'Round Rock city', 'Richardson city', 'Tyler city', 'Lewisville city', 'College Station city', 'The Woodlands CDP', 'San Angelo city', 'Pearland city', 'Allen city', 'League City city', 'Longview city', 'Sugar Land city', 'Edinburg city', 'Mission city', 'Bryan city', 'Baytown city', 'Pharr city', 'Missouri City city', 'Temple city', 'Atascocita CDP', 'Harlingen city', 'Flower Mound town', 'North Richland Hills city', 'Victoria city', 'New Braunfels city', 'Mansfield city', 'Conroe city', 'Rowlett city', 'Spring CDP', 'Port Arthur city', 'Euless city', 'DeSoto city', 'Cedar Park city', 'Galveston city', 'Georgetown city', 'Bedford city', 'Pflugerville city', 'Grapevine city', 'Texas City city', 'Cedar Hill city', 'San Marcos city', 'Haltom City city', 'Wylie city', 'Keller city', 'Coppell city', 'Huntsville city', 'Duncanville city', 'Sherman city', 'Channelview CDP', 'Rockwall city', 'Hurst city', 'Burleson city', 'Mission Bend CDP', 'Texarkana city', 'Lancaster city', 'The Colony city', 'Friendswood city', 'Weslaco city', 'Del Rio city', 'Lufkin city', 'San Juan city', 'La Porte city', 'Nacogdoches city', 'Copperas Cove city', 'Socorro city', 'Deer Park city', 'Schertz city', 'Rosenberg city', 'Waxahachie city', 'Fort Hood CDP', 'Cleburne city', 'Farmers Branch city', 'Kyle city', 'Big Spring city', 'Lake Jackson city', 'Harker Heights city', 'Southlake city', 'Leander city', 'Eagle Pass city', 'Kingsville city', 'Little Elm city', 'Greenville city', 'Weatherford city', 'Seguin city', 'Paris city', 'San Benito city', 'Alvin city', 'Corsicana city', 'Balch Springs city', 'Marshall city', 'Watauga city', 'University Park city', 'Cloverleaf CDP', 'Colleyville city', 'West Odessa CDP', 'Denison city', 'Kerrville city', 'Plainview city', 'Brushy Creek CDP', 'Canyon Lake CDP', 'Benbrook city', 'Sachse city', 'Corinth city', 'Saginaw city', 'Brownwood city', 'Alice city', 'Fresno CDP', 'Angleton city', 'Palestine city', 'Dickinson city', 'Orange city', 'Universal City city', 'Ennis city', 'Alamo city', 'Cinco Ranch CDP', 'Belton city', 'Converse city', 'Midlothian city', 'Pampa city', 'Murphy city', 'Stafford city', 'Bay City city', 'Nederland city', 'Stephenville city', 'South Houston city', 'Bellaire city', 'Mineral Wells city', 'Horizon City city', 'Jollyville CDP', 'Groves city', 'White Settlement city', 'Gainesville city', 'Pecan Grove CDP', 'Aldine CDP', 'Terrell city', 'Donna city', 'Gatesville city', 'Uvalde city', 'Brenham city', 'Mercedes city', 'Mount Pleasant city', 'Sulphur Springs city', 'Hereford city', 'Cibolo city', 'Taylor city', 'New Territory CDP', 'Humble city', 'Portland city', 'Highland Village city', 'Seagoville city', 'West University Place city', 'Hutto city', 'Dumas city', 'Forney city', 'Jacksonville city', 'La Marque city', 'Katy city', 'Rio Grande City city', 'Sienna Plantation CDP', 'Henderson city', 'San Elizario CDP', 'Hewitt city', 'Levelland city', 'Timberwood Park CDP', 'Canyon city', 'Borger city', 'Live Oak city', 'Addison town', 'Port Neches city', 'Kilgore city', 'Beeville city', 'Crowley city', 'Athens city', 'Lockhart city', 'Rendon CDP', 'Four Corners CDP', 'Forest Hill city', 'Alton city', 'Port Lavaca city', 'Santa Fe city', 'Wells Branch CDP', 'Freeport city', 'La Homa CDP', 'Seabrook city', 'Lumberton city', 'Richmond city', 'El Campo city', 'Greatwood CDP', 'Robstown city', 'Lakeway city', 'Raymondville city', 'Glenn Heights city', 'Clute city', 'Snyder city', 'Hidalgo city', 'Andrews city', 'Vernon city', 'Azle city', 'Sweetwater city', 'Galena Park city', 'Burkburnett city', 'Red Oak city', 'Tomball city', 'Vidor city', 'Jacinto City city', 'Fredericksburg city', 'Robinson city', 'Boerne city', 'Webster city']
const wiDummyData = ['Milwaukee city', 'Madison city', 'Green Bay city', 'Kenosha city', 'Racine city', 'Appleton city', 'Waukesha city', 'Oshkosh city', 'Eau Claire city', 'Janesville city', 'West Allis city', 'La Crosse city', 'Sheboygan city', 'Wauwatosa city', 'Fond du Lac city', 'New Berlin city', 'Wausau city', 'Brookfield city', 'Beloit city', 'Greenfield city', 'Menomonee Falls village', 'Franklin city', 'Oak Creek city', 'Manitowoc city', 'West Bend city', 'Sun Prairie city', 'Superior city', 'Stevens Point city', 'Mount Pleasant village', 'Neenah city', 'Fitchburg city', 'Caledonia village', 'Muskego city', 'Watertown city', 'De Pere city', 'Mequon city', 'South Milwaukee city', 'Germantown village', 'Pleasant Prairie village', 'Marshfield city', 'Wisconsin Rapids city', 'Cudahy city', 'Onalaska city', 'Middleton city', 'Howard village', 'Menasha city', 'Ashwaubenon village', 'Menomonie city', 'Beaver Dam city', 'Oconomowoc city', 'Kaukauna city', 'River Falls city']
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
  if (!state) return res.status(406).send('No state abbreviation sent. Not Acceptable.')
  if (state === 'TX') {
    res.json(txDummyData)
  } else if (state === 'WI') {
    res.json(wiDummyData)
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
