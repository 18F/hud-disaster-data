require('./config/env')
const express = require('express')
const flash = require('express-flash')
const path = require('path')
const app = express()
const auth = require('./lib/middleware/auth')
const bodyParser = require('body-parser')
const lusca = require('lusca')
const cookieSession = require('cookie-session')
const morgan = require('morgan')
const apiController = require('./lib/controllers/api')
const dayInMillis = 24 * 60 * 60 * 1000
require('./lib/swagger')(app)

app.use(morgan(/dev/.test(process.env.NODE_ENV) ? 'dev' : 'combined'))
app.use(function (req, res, next) {
  console.log(req.headers)
  next()
})
app.use(cookieSession({
  secret: process.env.COOKIE_SECRET || 'secret!@#',
  maxAge: dayInMillis
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(auth.authenticate)
app.use('/api', apiController)
app.use(express.static(path.join(__dirname, 'dist')))

module.exports = app
