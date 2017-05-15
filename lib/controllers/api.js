const express = require('express')
const router = express.Router()
const request = require('request')
const moment = require('moment')
const querystring = require('querystring')

router.get('/disasters/:qry', function (req, res) {
  const nbrRecords = 20
  const validCols = ['id', 'disasterNumber', 'state', 'declarationDate', 'disasterType', 'placeCode', 'incidentType']
  const qry = req.params.qry.substring(0, 2)
  const tenYearsAgo = moment().subtract(10, 'years')
  const qs = querystring.stringify({
    $filter: `disasterType eq '${qry}' and declarationDate gt '${tenYearsAgo.toString()}'`,
    $orderby: 'declarationDate desc',
    $top: nbrRecords
  })
  const selectCols = `$select=${validCols.join()}`

  const url = `https://www.fema.gov/api/open/v1/DisasterDeclarationsSummaries?${qs}&${selectCols}`
  console.log(url)
  request(url, function(err, response, body) {
    const data = JSON.parse(body)
    res.json(data.DisasterDeclarationsSummaries)
  });
});

module.exports = router;
