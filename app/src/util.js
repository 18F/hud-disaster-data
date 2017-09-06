const bowser = require('bowser')
module.exports = {
  isIE: function () { return bowser.msie || bowser.msedge },
  isGecko: function () { return bowser.isGecko }
}
