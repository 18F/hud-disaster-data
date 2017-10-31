const hudApi = require('./hudApi')
const _ = require('lodash')
const USERS = {
  GRANTEE: {'login': 'T071GA', 'disasterids': ['1606', '1791', '1999', '4029', '4223', '4245', '4266', '4269', '4272'], 'type': 'Grantee', 'hq': false},
  GRANTEE2: {'login': 'T071GA', 'disasterids': ['1606', '1791'], 'type': 'Grantee', 'hq': false},
  GRANTEE_NO_DISASTERS: {'login': 'T071GA', 'disasterids': [], 'type': 'Grantee', 'hq': false},
  HUD_HQ: {'login': 'T071GA', 'disasterids': [], 'type': 'HUD', 'hq': true}
}

module.exports = {
  authenticate: function (req, res, next) {
    // TODO: store the user in the session and expire after 1 min
    let userId = req.headers['dr-userid']
    const sessionUser = _.get(req, 'session.user')
    if (sessionUser && sessionUser.login === userId) {
      req.user = req.session.user
      // console.log('user:', req.user)
      return next()
    }
    if (!userId && process.env.DRDP_LOCAL) {
      req.session.user = req.user
      req.user = USERS.GRANTEE
      return next()
    }
    hudApi.getUser(userId)
      .then(user => {
        if (!user || user.type === 'Unauthorized') {
          let unAuthString = `You are not authorized to access the Disaster Recovery Data Portal export page.<br><br>`
          unAuthString += `If you believe you should have access, please contact HUD's Office of Community Planning and Development, Disaster Recovery and Special Issues Division.<br><br>`
          unAuthString += `For more information: <a href='https://www.hudexchange.info/contact-us/#'>https://www.hudexchange.info/contact-us/#</a>`
          return res.status(401)
          .send(unAuthString)
        }
        req.session.user = user
        req.user = user
        next()
      })
      .catch(next)
  },
  isHUDHQUser: function (req) {
    return (req.user.type === 'HUD' && req.user.hq === true)
  },
  filterAuthorizedDisasterIds: function (req, disasterids) {
    if (this.isHUDHQUser(req)) return disasterids
    return _.intersection(disasterids, req.user.disasterids)
  },
  TEST_USERS: USERS
}
