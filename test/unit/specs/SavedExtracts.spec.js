/* global Event, describe, it, expect, sinon */
import 'es6-promise/auto' // eslint-disable-line
import Vue from 'vue' // eslint-disable-line
import Vuex from 'vuex' // eslint-disable-line
import sinon from 'sinon'
import SavedExtracts from '@/components/SavedExtracts' // eslint-disable-line
import _ from 'lodash' // eslint-disable-line

Vue.use(Vuex)
Vue.config.productionTip = false

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
  let store
  let mutations
  let getters

  beforeEach(function () {
    getters = {
      defaultExtractName: function () { return '' },
      currentExtract: function () { return [] },
      savedExtracts: function () { return [] },
      newExtract: function () { return false },
      status: function () { return { type: 'error', message: '' } }
    }
    mutations = {
      clearCurrentExtract: sinon.stub(),
      resetStatus: sinon.stub(),
      loadExtract: sinon.stub(),
      saveExtract: sinon.stub(),
      deleteExtract: sinon.stub()
    }

    store = new Vuex.Store({state: {}, mutations, getters})
  })

  it('should display the saved extracts dropdown if there are saved extracts and no disasters are selected', function () {
    const Constructor = Vue.extend(SavedExtracts)
    const vm = new Constructor({store}).$mount()
    getters.savedExtracts = () => [{name: 'test', disasters: TWO_RECORDS}]
    expect(vm.$el.querySelector('#saved_searches select').style.display).to.be.equal('')
    expect(vm.$el.querySelector('#saved_searches input').style.display).to.be.equal('none')
  })

  it('should call saveExtract when the save button is clicked', function (done) {
    const Constructor = Vue.extend(SavedExtracts)
    const vm = new Constructor({store}).$mount()
    let $button = vm.$el.querySelector('#save-button')
    dispatchEvent($button, 'click')
    Vue.nextTick(() => {
      expect(mutations.saveExtract.calledOnce).to.equal(true)
      done()
    })
  })

  it('should call deleteExtract when the delete button is clicked and confirm is true', function (done) {
    const Constructor = Vue.extend(SavedExtracts)
    const vm = new Constructor({store}).$mount()
    let $button = vm.$el.querySelector('#delete-button')
    let stub = sinon.stub(window, 'confirm').callsFake(() => true)
    dispatchEvent($button, 'click')
    Vue.nextTick(() => {
      expect(mutations.deleteExtract.calledOnce).to.equal(true)
      stub.restore()
      done()
    })
  })

  it('should not call deleteExtract when the delete button is clicked and confirm is false', function (done) {
    const Constructor = Vue.extend(SavedExtracts)
    const vm = new Constructor({store}).$mount()
    let $button = vm.$el.querySelector('#delete-button')
    let stub = sinon.stub(window, 'confirm').callsFake(() => false)
    dispatchEvent($button, 'click')
    Vue.nextTick(() => {
      expect(mutations.deleteExtract.calledOnce).to.equal(false)
      stub.restore()
      done()
    })
  })

  it('should call loadExtract when the selected option changes', function (done) {
    getters.defaultExtractName = function () { return 'test' }
    const Constructor = Vue.extend(SavedExtracts)
    const vm = new Constructor({store}).$mount()
    let $select = vm.$el.querySelector('#saved_searches select')
    dispatchEvent($select, 'change')
    Vue.nextTick(() => {
      expect(mutations.loadExtract.called).to.equal(true)
      done()
    })
  })

  it('should not display the error message if there is none to display', function () {
    getters.status = function () { return { type: 'normal', message: '' } }
    store = new Vuex.Store({state: {}, mutations, getters})
    const Constructor = Vue.extend(SavedExtracts)
    const vm = new Constructor({store}).$mount()
    let $messages = vm.$el.querySelector('#messages')
    expect($messages.style.display).to.be.equal('none')
  })

  it('should call resetStatus when the x is clicked', function (done) {
    const Constructor = Vue.extend(SavedExtracts)
    const vm = new Constructor({store}).$mount()
    let $messages = vm.$el.querySelector('#messages')
    expect($messages.style.display).to.be.equal('')
    let $x = vm.$el.querySelector('#messages .close-message')
    dispatchEvent($x, 'click')
    Vue.nextTick(() => {
      expect(mutations.resetStatus.called).to.equal(true)
      done()
    })
  })
})
