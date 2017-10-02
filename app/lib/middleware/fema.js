const request = require('request')
const moment = require('moment')
const _ = require('lodash')
const querystring = require('querystring')

const getDisasters = function ({filter, orderBy}, cb) {
  const qry = {$filter: filter}
  if (orderBy) qry.$orderby = orderBy

  const qs = querystring.stringify(qry)
  const validCols = ['id', 'disasterNumber', 'state', 'declarationDate', 'disasterType', 'placeCode', 'incidentType', 'declaredCountyArea', 'title']
  const selectCols = `$select=${validCols.join()}` // Left out of stringify because it's excaping commas and FEMA API doesn't like it
  const url = `https://www.fema.gov/api/open/v1/DisasterDeclarationsSummaries?${qs}&${selectCols}`
  request(url, function (err, response, body) {
    if (err) return cb(err)
    var data
    try {
      data = JSON.parse(body, (key, value) => {
        return key === 'declarationDate' ? moment(value).format('MMMM DD, YYYY') : value
      })
    } catch (e) {
      e.status = response.statusCode
      return cb(e)
    }
    var rolledUpData = rollUpData(data)
    cb(null, rolledUpData)
  })
}

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

module.exports = {getDisasters}
