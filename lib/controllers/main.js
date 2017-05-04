const express = require('express');
const router = express.Router();
const _ = require('lodash');

router.get('/login', function (req, res) {
  res.render('login', { title: 'Hey', message: 'Hello there!' })
});

router.post('/login', function (req, res) {
  var username = _.get(req,'body.username');
  var password = _.get(req,'body.password');
  if (!(username && password)) return res.sendStatus(401);
  res.render('start');
});

module.exports = router;
