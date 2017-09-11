require('./config/env')
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

app.use(morgan(/dev/.test(process.env.NODE_ENV) ? 'dev' : 'combined'))
const dayInMillis = 24 * 60 * 60 * 1000
app.use(cookieSession({
  secret: process.env.COOKIE_SECRET || 'secret!@#',
  maxAge: dayInMillis
}))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api', apiController)

const staticDir = path.join(__dirname, 'dist')
app.use(express.static(staticDir))

module.exports = app
