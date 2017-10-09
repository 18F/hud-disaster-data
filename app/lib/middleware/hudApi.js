const _ = require('lodash')
const request = require('request-promise')
const moment = require('moment')
const uuid = require('uuid/v4')
const URL = require('url')
const fema = require('./fema')
const DRDP_API_BASE = `${process.env.HUD_API_BASE_URL}/drdp/api/v1.0`
const DRGR_API_BASE = `${process.env.HUD_API_BASE_URL}/drgr/api/v1.0`
// const certPath = path.join(__dirname,'..','..','certs','esbapi-dev.hhq.hud.dev.cer')
// console.log(`*** cert path: ${certPath} ***`)
// const cert = fs.readFileSync(certPath)
// console.log(`*** cert:\n ${cert} \n***`)
const LOCALE_TYPES = {
  city: 'cities',
  county: 'counties',
  congrdist: 'districts',
  zipcode: 'zipcodes',
  township: 'townships',
  tract: 'tracts'
}

const databaseFieldReference = {
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
    "auditCorrelationId":"17f24136-2494-4bf8-9d3b-9baafaae0cc9",
    "serviceRequestTimestamp":"2017-01-01T12:00:00.000Z",
    "sourceSystem":"DRDP",
    "endUserId":"X0DRDP",
    "authenticationId":"X0DRDP",
    "tenantId":"DRDP",
    "locale":"English"
  }
const requestOptions = function (url) {
  const consumerData = _.assign(_.clone(SERVICE_CONSUMER_DATA), {
    auditCorrelationId: uuid(),
    serviceRequestTimestamp: moment().toISOString()
  })
  return {
    url,
    headers: {
      serviceConsumerData: JSON.stringify(consumerData)
    },
    strictSSL: false,
    json: true
  }
}

const getUser = function(userid) {
  const opts = requestOptions(`${DRGR_API_BASE}/users/${userid}`)
  return request.get(opts)
}

const getLocales = function(user, state, type) {
  const opts = requestOptions(`${DRDP_API_BASE}/states/${state}/${LOCALE_TYPES[type]}`);
  return request.get(opts)
}

const decodeField = (fieldname) => {
  return databaseFieldReference[fieldname]
}

const getDisastersByLocale = function (state, localeType, locales) {
  return new Promise((resolve, reject) => {
    if (!state) reject(new Error('state is a required parameter'))
    let hudAPIURL = URL.parse(`${DRDP_API_BASE}/states/${state}/disasters`)
    if (_.isString(localeType) && _.isArray(locales) && !_.isEmpty(locales)) hudAPIURL.query = {localeType, locales: locales.join(',')}
    const opts = requestOptions(URL.format(hudAPIURL))
    request.get(opts)
      .then(disasterIds => {
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

const getSummaryRecords = function({state, localeType, locales, disasters, cols}) {
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

  const opts = requestOptions(URL.format(hudAPIURL))
  console.log('request opts:', opts)

  return new Promise((resolve, reject) => {
    request.get(opts).then(response => {
      resolve(_.pick(response, cols))
    }).catch(reject)
  })
}

const getExport = function (disasterIds) {
  if (_.isEmpty(disasterIds)) return Promise.reject(new Error('disasterIds is required'))
  var query = `disasters=${disasterIds.join(',')}`
  const uri = `${DRDP_API_BASE}/applicants/export?${query}`
  const opts = requestOptions(uri)
  opts.simple = true
  return request.get(opts)
}

module.exports = { decodeField, getUser, getLocales, getDisastersByLocale, getSummaryRecords, getExport }
