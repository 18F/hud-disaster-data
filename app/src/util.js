import bowser from 'bowser'
export default {
  isIE: function () { return bowser.msie || bowser.msedge },
  isGecko: function () { return bowser.isGecko }
}
