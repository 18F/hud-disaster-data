const express = require('express')
const flash = require('express-flash')
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const lusca = require('lusca');
const cookieSession = require('cookie-session');

const controllers = require('./lib/controllers');
const mainController = controllers.main;

const dayInMillis = 24 * 60 * 60 * 1000;
app.use(cookieSession({
  secret: process.env.COOKIE_SECRET || 'secret!@#',
  maxAge: dayInMillis
}));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(lusca({
  csrf: true,
  xssProtection: true
}));

app.use(express.static(path.join(__dirname, 'public'), { maxAge: dayInMillis * 10 }));
app.use(express.static(path.join(__dirname, 'dist'), { maxAge: dayInMillis * 10 }));
app.use(flash())
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

require('./lib/services/authenticate').init(app);

app.use('/', mainController);

module.exports = app;
