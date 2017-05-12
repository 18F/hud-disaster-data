const express = require('express')
const router = express.Router()
const request = require('request')
const moment = require('moment')

router.get('/disasters/:qry', function (req, res) {
  const qry = req.params.qry.substring(0,2)
  const tenYearsAgo = moment().subtract(10, 'years')
  const url = `https://www.fema.gov/api/open/v1/DisasterDeclarationsSummaries?$filter=disasterType eq '${qry}' and declarationDate gt '${tenYearsAgo.toString()}'&$orderby=declarationDate desc`
  console.log(url)
  request(url, function(err, response, body) {
    const data = JSON.parse(body)
    res.json(data.DisasterDeclarationsSummaries)
  });
});

module.exports = router;
