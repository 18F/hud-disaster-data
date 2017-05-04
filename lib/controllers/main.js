const express = require('express');
const router = express.Router();

router.get('/login', function (req, res) {
  res.render('login', { title: 'Hey', message: 'Hello there!' })
})

module.exports = router
