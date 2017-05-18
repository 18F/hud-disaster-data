const express = require('express');
const router = express.Router();
const authenticate = require('../services/authenticate');
const _ = require('lodash');

router.get('/login', function (req, res) {
  res.render('login', { title: 'Hey', message: 'Hello there!' })
});

router.post('/login', authenticate.authenticate);
router.get('/start', authenticate.isAuthenticated, (req, res, next) => {
  res.render('start');
});

module.exports = router;
