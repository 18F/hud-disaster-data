const _ = require('lodash')
require('../../config/env')
const request = require('request-promise')
const cookieUrl = `${process.env.HUD_OPENAM_BASE_URL}/json/authenticate?realm=/`
const tokenUrl = `${process.env.HUD_OPENAM_BASE_URL}/oauth2/authorize?realm=/`
const oamUserId = process.env.oamUserId
const oamPassword = process.env.oamPassword
const DRDPOAuth2Scope = process.env.DRDPOAuth2Scope
const DRGROAuth2Scope = process.env.DRGROAuth2Scope
const oAuth2ClientId = process.env.oAuth2ClientId
const redirectUri = 'http://localhost:8000'

let cookieReqOptions = {
  url: cookieUrl,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-OpenAM-Username': oamUserId,
    'X-OpenAM-Password': oamPassword
  },
  rejectUnauthorized: false,
  simple: true,
  json: true
}

module.exports = {
  getOAuth2TokenParam: function (scope) {
    return new Promise((resolve, reject) => {
      let chosenScope
      if (scope === 'DRGR') chosenScope = DRGROAuth2Scope
      else if (scope === 'DRDP') chosenScope = DRDPOAuth2Scope
      else reject(new Error(`${scope} is not valid.  Should be DRGR or DRDP`))
      let message = `&response_type=id_token%20token&save_consent=1&decision=Allow&scope=openid%20profile%20${chosenScope}&nonce=1234&client_id=${oAuth2ClientId}&redirect_uri=${redirectUri}`
      request(cookieReqOptions).then(results => {
        console.log(`got results.tokenId: >> ${results.tokenId} <<\n\n\n`)
        console.log(`got results: >> ${JSON.stringify(results)} <<\n\n\n`)
        let tokenReqOptions = {
          url: tokenUrl + message,
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': `iPlanetDirectoryPro=${results.tokenId}`
          },
          rejectUnauthorized: false
        }
        request(tokenReqOptions).then(res => {
          console.log(`res: ${res}`)
          reject(res)
        },
        err => {
          if (err.response.statusCode === 302) {
            const accessTokenResponse = _.get(err, 'response.headers.location')
            const accessTokenString = accessTokenResponse.split('#')[1].split('&')[0]
            console.log(accessTokenString)
            resolve(accessTokenString)
          } else resolve(err)
        })
      })
    })
  }
}
