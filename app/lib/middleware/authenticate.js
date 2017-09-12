const hudApi = require('./hudApi')
const LOCAL_USER = {"login":"T071GA","disasterids": [ "1606", "1791", "1999", "4029", "4223", "4245", "4266", "4269", "4272"], "type":"Grantee","hq":"null"}

module.exports = function(req, res, next) {
  let userId = req.headers['dr-userid']
  if (!userId && process.env.DRDP_LOCAL) {
    req.user = LOCAL_USER
    return next()
  }
  if (!userId) return req.send(401)
  hudApi.getUser(userId, (err, user) => {
    if (err) return next(err)
    if (!user) return req.send(401)
    next()
  })
}
