/* global Event, describe, it, expect, sinon */
import 'es6-promise/auto' // eslint-disable-line
import Vue from 'vue' // eslint-disable-line
import Vuex from 'vuex' // eslint-disable-line
import store from '@/store' // eslint-disable-line
import SavedExtracts from '@/components/SavedExtracts' // eslint-disable-line

Vue.use(Vuex)
Vue.config.productionTip = false

/* eslint-disable no-new */
import _ from 'lodash' // eslint-disable-line
const ONE_RECORD = [
  {
    disasterNumber: 4311,
    state: 'UT',
    declarationDate: 'April 21, 2017',
    disasterType: 'DR',
    incidentType: 'Flood',
    title: 'SEVERE WINTER STORMS AND FLOODING',
    declaredCountyArea: [ 'Box Elder (County)', 'Cache (County)' ],
    placeCode: 99003,
    id: '58fa2e008a4f31363dac2c6a'
  } ]

const TWO_RECORDS = [
  {'disasterNumber': 4289,
    'state': 'IA',
    'declarationDate': 'October 31, 2016',
    'disasterType': 'DR',
    'incidentType': 'Flood',
    'title': 'SEVERE STORMS AND FLOODING',
    'declaredCountyArea': ['Buchanan (County)', 'Delaware (County)', 'Howard (County)'],
    'placeCode': 99019,
    'id': '5817ea93289b6425072e20eb'
  },
  {'disasterNumber': 4281,
    'state': 'IA',
    'declarationDate': 'September 29, 2016',
    'disasterType': 'DR',
    'incidentType': 'Flood',
    'title': 'SEVERE STORMS, STRAIGHT-LINE WINDS, AND FLOODING',
    'declaredCountyArea': ['Winneshiek (County)', 'Clayton (County)'],
    'placeCode': 99191,
    'id': '57edac84c7e7c327077fc494'
  } ]

function dispatchEvent ($el, name, opts) {
  var event = new Event(name, {
    'bubbles': true,
    'cancelable': true
  })
  if (opts && _.isObject(opts)) _.assign(event, opts)
  $el.dispatchEvent(event)
}

describe('SavedExtracts component', function () {
  it('should display the saved extracts dropdown if there are saved extracts and no disasters are selected', function (done) {
    const Constructor = Vue.extend(SavedExtracts)
    const vm = new Constructor({store}).$mount()
    localStorage.setItem('saved-extracts', JSON.stringify({name: 'test', disasters: TWO_RECORDS}))
    vm.$store.commit('updateDisasterList', { list: ONE_RECORD })
    Vue.nextTick(function () {
      expect(vm.$el.querySelector('#saved_searches select').style.display).to.be.equal('')
      expect(vm.$el.querySelector('#saved_searches input').style.display).to.be.equal('none')
      done()
    })
  })

  // it('should not allow disasters to be selected or unselected if an extract is loaded', function () {
  //
  // })
  //
  // it('should display the extract-name input field if there is no saved extract loaded', function () {
  //
  // })
})
