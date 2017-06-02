const express = require('express')
const router = express.Router()
const request = require('request')
const moment = require('moment')
const _ = require('lodash')
const querystring = require('querystring')

router.get('/disasters/:qry', function (req, res) {
  const validCols = ['id', 'disasterNumber', 'state', 'declarationDate', 'disasterType', 'placeCode', 'incidentType', 'declaredCountyArea', 'title']
  const qryParts = req.params.qry.toUpperCase().split('-')
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
    res.json(rolledUpData)
  })
})

module.exports = router
