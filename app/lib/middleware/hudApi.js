const _ = require('lodash')
const request = require('request-promise')
const moment = require('moment')
const uuid = require('uuid/v4')
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
const config = function (url) {
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
  return request.get(config(`${DRGR_API_BASE}/users/${userid}`))
}

const getLocales = function(user, state, type) {
  return request.get(config(`${DRDP_API_BASE}/states/${state}/${LOCALE_TYPES[type]}`))
}

const decodeField = (fieldname) => {
  return databaseFieldReference[fieldname]
}

const getDisastersByLocale = function (state, type, locales) {
  return new Promise((resolve, reject) => {
    request.get(config(`${DRDP_API_BASE}/states/${state}/disasters?${LOCALE_TYPES[type]}=${locales.join(',')}`))
      .then(disasterIds => {
        console.log('***** Got disasterIds:', disasterIds)
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

module.exports = { decodeField, getUser, getLocales, getDisastersByLocale }
