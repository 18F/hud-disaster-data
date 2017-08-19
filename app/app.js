const express = require('express')
const flash = require('express-flash')
const path = require('path')
const app = express()
const bodyParser = require('body-parser')
const lusca = require('lusca')
const cookieSession = require('cookie-session')
const morgan = require('morgan')

const apiController = require('./lib/controllers/api')
require('./lib/swagger')(app)
// const controllers = require('./lib/controllers');
// const mainController = controllers.main;

app.use(morgan(/dev/.test(process.env.NODE_ENV) ? 'dev' : 'combined'))
const dayInMillis = 24 * 60 * 60 * 1000
app.use(cookieSession({
  secret: process.env.COOKIE_SECRET || 'secret!@#',
  maxAge: dayInMillis
}))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// app.use(lusca({
//   csrf: true,
//   xssProtection: true
// }));
// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

app.use(express.static(path.join(__dirname, 'dist')))
// app.use(flash())
// app.set('view engine', 'pug');
// app.set('views', __dirname + '/views');

// require('./lib/services/authenticate').init(app);

app.use('/api', apiController)

module.exports = app
