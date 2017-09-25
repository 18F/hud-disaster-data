const _ = require('lodash')
const hudApi = require('./hudApi')

const getLocales = function(stateId, localeType) {
  localeType = hudApi.decodeField(localeType)
  var selectCols = [localeType]
  var queryObj = []
  queryObj.push({'dmge_state_cd': [stateId]})
  var data = hudApi.getData(queryObj, null, selectCols)
  return _.map(_.uniqBy(data, l => JSON.stringify(l)), localeType)
}

module.exports = {getLocales}
