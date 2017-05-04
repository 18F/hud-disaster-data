const express = require('express');
const path = require('path');
const app = express();
const controllers = require('./lib/controllers');
const mainController = controllers.main;

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.use('/', mainController);

module.exports = app;
