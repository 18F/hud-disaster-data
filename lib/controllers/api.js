const express = require('express')
const router = express.Router()
const request = require('request')
const moment = require('moment')
const querystring = require('querystring')

router.get('/disasters/:qry', function (req, res) {
  const validCols = ['id', 'disasterNumber', 'state', 'declarationDate', 'disasterType', 'placeCode', 'incidentType']
  const qryParts = req.params.qry.split('-')
  const tenYearsAgo = moment().subtract(10, 'years')
  const filter = (qryParts.length > 1 && qryParts[1] !== '')
    ? `disasterType eq '${qryParts[0]}' and disasterNumber eq '${qryParts[1]}' and declarationDate gt '${tenYearsAgo.toString()}'`
    : `disasterType eq '${qryParts[0]}' and declarationDate gt '${tenYearsAgo.toString()}'`

  const qs = querystring.stringify({
    $filter: filter,
    $orderby: 'declarationDate desc',
    $top: 20
  })
  const selectCols = `$select=${validCols.join()}` // Left out of stringify because it's excaping commas and FEMA API doesn't like it
  const url = `https://www.fema.gov/api/open/v1/DisasterDeclarationsSummaries?${qs}&${selectCols}`
  console.log(url)
  request(url, function(err, response, body) {
    // TODO handle error
    const data = JSON.parse(body)
    res.json(data.DisasterDeclarationsSummaries)
  });
});

module.exports = router;
