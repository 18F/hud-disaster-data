const hudApi = require('./hudApi')
const LOCAL_USER = {"login":"T071GA","disasterids": [ "1606", "1791", "1999", "4029", "4223", "4245", "4266", "4269", "4272"], "type":"Grantee","hq":false}


module.exports = {
  authenticate: function (req, res, next) {
    let userId = req.headers['dr-userid']
    if (!userId && process.env.DRDP_LOCAL) {
      req.user = LOCAL_USER
      return next()
    }
    if (!userId) return res.sendStatus(401)
    hudApi.getUser(userId)
      .then(user => {
        if (!user || user.type === 'Unauthorized') return res.sendStatus(401)
        req.user = user
        next()
      })
      .catch(next)
  },
  isHUDHQUser: function(req) {
    return (req.user.type === 'HUD' && req.user.hq === true)
  }
}
