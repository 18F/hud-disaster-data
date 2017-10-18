const _ = require('lodash')
const request = require('request-promise')
const moment = require('moment')
const uuid = require('uuid/v4')
const URL = require('url')
const fema = require('./fema')
const oauth2 = require('./oauth2')
const DRDP_API_BASE = `${process.env.HUD_API_BASE_URL}/drdp/api/v1.0`
const DRGR_API_BASE = `${process.env.HUD_API_BASE_URL}/drgr/api/v1.0`
// const certPath = path.join(__dirname,'..','..','certs','esbapi-dev.hhq.hud.dev.cer')
// console.log(`*** cert path: ${certPath} ***`)
// const cert = fs.readFileSync(certPath)
// console.log(`*** cert:\n ${cert} \n***`)
const oauthTokens = {}

const getTokens = Promise.all(
  [
    oauth2.getOAuth2TokenParam('DRGR'),
    oauth2.getOAuth2TokenParam('DRDP')
  ])
  .then(token => {
    _.forEach(token, rec => {
      _.forEach(rec, (value, key) => {
      oauthTokens[key] = value
    })
  })
})

const LOCALE_TYPES = {
  city: 'cities',
  county: 'counties',
  congrdist: 'districts',
  zipcode: 'zipcodes',
  township: 'townships',
  tract: 'tracts'
}

const DATABASEFIELDREFERENCE = {
  disaster: 'DSTER_ID',
  state: 'DMGE_STATE_CD',
  city: 'DMGE_CITY_NAME',
  county: 'CNTY_NAME',
  congrdist: 'FCD_FIPS_91_CD',
  zipcode: 'STD_BASC_ZIP_CD',
  township: 'CNTY_SUB_DIVN_CURR_NAME',
  tract: 'TRACT_CENSUS_2010_CD'
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

  const hudGet = function (url, scope) {
   var opts = requestOptions(url, scope)
   return new Promise((resolve, reject) => {
     request.get(opts)
       .then(resolve)
       .catch(err => {
         if (err.code === 400) {
           return getTokens().then( result => {
             opts = requestOptions(url, scope)
             resolve(request.get(opts))
           })
         }
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
  const param = oauthTokens[scope]
  const appendParam = _.indexOf(newUrl, '?') > -1 ? `&${param}` : `?${param}`
  let options = {
    url: `${newUrl}${appendParam}`,
    headers: {
      serviceConsumerData: JSON.stringify(consumerData)
    },
    strictSSL: false,
    json: true
  }
  return Promise.resolve(options)
}

const getUser = function(userid) {
  return requestOptions(`${DRGR_API_BASE}/users/${userid}`, 'DRGR').then(opts => {
    return request.get(opts)
  })
}

const getLocales = function(user, state, type) {
  return requestOptions(`${DRDP_API_BASE}/states/${state}/${LOCALE_TYPES[type]}`, 'DRDP').then(opts => {
    return request.get(opts)
  })
}

const decodeField = (fieldname) => {
  return DATABASEFIELDREFERENCE[fieldname]
}

const getDisastersByLocale = function (state, localeType, locales) {
  return new Promise((resolve, reject) => {
    if (!state) reject(new Error('state is a required parameter'))
    let hudAPIURL = URL.parse(`${DRDP_API_BASE}/states/${state}/disasters`)
    if (_.isString(localeType) && _.isArray(locales) && !_.isEmpty(locales)) hudAPIURL.query = {localeType, locales: locales.join(',')}
    return requestOptions(URL.format(hudAPIURL), 'DRDP').then(opts => {
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

  return requestOptions(URL.format(hudAPIURL), 'DRDP').then(opts => {
    console.log('request opts:', opts)

    return new Promise((resolve, reject) => {
      request.get(opts).then(response => {
        resolve(_.pick(response, cols))
      }).catch(reject)
    })
  })
}

const getExport = function (disasterIds) {
  if (_.isEmpty(disasterIds)) return Promise.reject(new Error('disasterIds is required'))
  var query = `disasters=${disasterIds.join(',')}`
  const uri = `${DRDP_API_BASE}/applicants/export?${query}`
  return requestOptions(uri, 'DRDP').then(opts => {
    opts.simple = true
    return request.get(opts)
  })
}

module.exports = { decodeField, getUser, getLocales, getDisastersByLocale, getSummaryRecords, getExport }
