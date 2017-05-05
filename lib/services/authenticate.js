const localAuthenticate = (username, password, done) => {
  if (password !== username) return done(null, false);
  done(null, { username: username });
};

module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
  },
  localAuthenticate: localAuthenticate,
  authenticate: (req, res, next) => {

  }
}
