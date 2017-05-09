const passport = require('passport');
const LocalStrategy = require('passport-local');

const localAuthenticate = (username, password, done) => {
  if (password !== username) return done(null, false);
  done(null, { username: username, id: username });
};

module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
  },
  localAuthenticate: localAuthenticate,
  authenticate: (req, res, next) => {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) {
        req.flash('error', 'Invalid credentials')
        return res.redirect('/login');
      }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.redirect('/start');
      });
    })(req, res, next);
  },
  init: (app) => {
    if (this.initialized) return false;

    passport.use(new LocalStrategy(localAuthenticate));

    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      done(null, {username: id, id: id});
    });

    app.use(passport.initialize());
    app.use(passport.session());

    this.initialized = true;
    return true;
  }
}
