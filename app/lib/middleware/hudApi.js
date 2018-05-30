const _ = require('lodash')
const request = require('request-promise')
const moment = require('moment')
const uuid = require('uuid/v4')
const URL = require('url')
const fema = require('./fema')
const oauth2 = require('./oauth2')
const DRDP_API_BASE = `${process.env.HUD_API_BASE_URL}/drdp/api/v1.0`
const DRGR_API_BASE = `${process.env.HUD_API_BASE_URL}/drgr/api/v1.0`
const path = require('path')
const fs = require('fs')
const certPath = path.join(__dirname,'..','..','certs','HUD-CA.pem')
const ca = fs.readFileSync(certPath)
let oauthTokens = {}

const getTokens = () => {
  return Promise.all(
  [
    oauth2.getOAuth2TokenParam('DRGR'),
    oauth2.getOAuth2TokenParam('DRDP')
  ])
}

const LOCALE_TYPES = {
  city: 'cities',
  county: 'counties',
  congrdist: 'districts',
  zipcode: 'zipcodes',
  township: 'townships',
  tract: 'tracts'
}

const DATABASEFIELDREFERENCE = {
  disaster: 'dster_id',
  state: 'dmge_state_cd',
  city: 'dmge_city_name',
  county: 'cnty_name',
  congrdist: 'fcd_fips_91_cd',
  zipcode: 'std_basc_zip_cd',
  township: 'cnty_sub_divn_curr_name',
  tract: 'tract_census_2010_cd'
}

const SERVICE_CONSUMER_DATA = {
  'auditCorrelationId': '17f24136-2494-4bf8-9d3b-9baafaae0cc9',
  'serviceRequestTimestamp': '2017-01-01T12:00:00.000Z',
  'sourceSystem': 'DRDP',
  'endUserId': 'X0DRDP',
  'authenticationId': 'X0DRDP',
  'tenantId': 'DRDP',
  'locale': 'English'
}

const hudGet = function (url, scope) {
  return new Promise((resolve, reject) => {
    let opts = requestOptions(url, scope)
    console.log(`about to request.get: ${opts.url}`)
    request.get(opts)
    .then(resolve)
    .catch(err => {
      if (err.statusCode === 400) {
        return getTokens().then(result => {
          oauthTokens = result
          opts = requestOptions(url, scope)
          console.log(`After 400, about to request.get: ${opts.url}`)
          resolve(request.get(opts).catch(error => {
            console.log(`Caught error: \n${JSON.stringify(error)} \n\nafter attempting to get new tokens`)
            reject(error)
          }))
        })
      }
      console.log(`inside hudGet(${url}, ${scope}) with err.statusCode === ${err.statusCode}`)
      reject(err)
    })
  })
}

const requestOptions = function (url, scope) {
  const consumerData = _.assign(_.clone(SERVICE_CONSUMER_DATA), {
    auditCorrelationId: uuid(),
    serviceRequestTimestamp: moment().toISOString()
  })
  let newUrl = process.env.DRDP_TESTING === 'true' ? _.replace(url, 'undefined', 'FLANHQ') : url
  const param = _.get(_.find(oauthTokens, {scope}), 'param')
  const appendParam = _.indexOf(newUrl, '?') > -1 ? `&${param}` : `?${param}`
  let options = {
    url: `${newUrl}${appendParam}`,
    headers: {
      serviceConsumerData: JSON.stringify(consumerData)
    },
    strictSSL: true,
    json: true,
    ca
  }
  return options
}

const getUser = function (userid) {
  return hudGet(`${DRGR_API_BASE}/users/${userid}`, 'DRGR')
}

const getLocales = function (user, state, type) {
  return hudGet(`${DRDP_API_BASE}/states/${state}/${LOCALE_TYPES[type]}`, 'DRDP')
}

const decodeField = (fieldname) => {
  return DATABASEFIELDREFERENCE[fieldname]
}

const getDisastersByLocale = function (state, localeType, locales) {
  return new Promise((resolve, reject) => {
    if (!state) reject(new Error('state is a required parameter'))
    let hudAPIURL = URL.parse(`${DRDP_API_BASE}/states/${state}/disasters`)
    if (_.isString(localeType) && _.isString(locales) && !_.isEmpty(locales)) hudAPIURL.query = {localeType, locales}
    return hudGet(URL.format(hudAPIURL), 'DRDP').then(disasterIds => {
      if (!_.isArray(disasterIds) || _.isEmpty(disasterIds)) return resolve([])
      console.log('***** Got disasterIds:', disasterIds)
      disasterIds = _.map(disasterIds, 'id')
      const disasterCond = `(disasterNumber eq ${disasterIds.join(' or disasterNumber eq ')})`
      let filter = `state eq '${state}' and ${disasterCond}`
      fema.getDisasters({filter}, (err, disasters) => {
        if (err) return reject(err)
        resolve(disasters)
      })
    })
    .catch(reject)
  })
}

const getSummaryRecords = function ({state, localeType, locales, disasters, cols}) {
  let hudAPIURL = URL.parse(`${DRDP_API_BASE}/applicants/summary`)
  hudAPIURL.query = {}
  if (state) {
    hudAPIURL.query.state = state
    if (_.isString(localeType) && _.isArray(locales) && !_.isEmpty(locales)) {
      hudAPIURL.query.localeType = localeType
      hudAPIURL.query.locales = locales.join(',')
    }
  }
  if (_.isArray(disasters) && !_.isEmpty(disasters)) hudAPIURL.query.disasters = disasters.join(',')

  return new Promise((resolve, reject) => {
    hudGet(URL.format(hudAPIURL), 'DRDP').then(response => {
      resolve(_.pick(response, cols))
    }).catch(reject)
  })
}

const getExport = function (disasterIds) {
  if (_.isEmpty(disasterIds)) return Promise.reject(new Error('disasterIds is required'))
  var query = `disasters=${disasterIds.join(',')}`
  const uri = `${DRDP_API_BASE}/applicants/export?${query}`
  return hudGet(uri, 'DRDP')
}

module.exports = { decodeField, getUser, getLocales, getDisastersByLocale, getSummaryRecords, getExport }
