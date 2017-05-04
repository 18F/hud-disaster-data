const express = require('express');
const router = express.Router();
const _ = require('lodash');

router.get('/login', function (req, res) {
  res.render('login', { title: 'Hey', message: 'Hello there!' })
});

router.post('/login', function (req, res) {
  var username = _.get(req,'body.username');
  if (!username) return res.sendStatus(401);
  res.sendStatus(200);
});

module.exports = router;
