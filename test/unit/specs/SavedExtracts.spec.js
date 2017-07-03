import 'es6-promise/auto' // eslint-disable-line
import Vue from 'vue' // eslint-disable-line
import '@/vue-mixins'
import Vuex from 'vuex' // eslint-disable-line
import sinon from 'sinon'
import SavedExtracts from '@/components/SavedExtracts' // eslint-disable-line
import Message from '@/components/Message' // eslint-disable-line
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
      status: function () { return { type: 'error', msg: '' } }
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
      expect(vm.extractName).to.equal('')
      done()
    })
  })

  it('should set extractName to blank when save creates an error message', function (done) {
    const Constructor = Vue.extend(SavedExtracts)
    const vm = new Constructor({store}).$mount()
    vm.saveExtract()
    expect(vm.extractName).to.equal('')
    done()
  })

  it('should call set selectedExtractName to extractName when the save does not return error', function (done) {
    getters.status = function () { return {type: 'success', msg: 'success message'} }
    store = new Vuex.Store({state: {}, mutations, getters})
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
    getters.status = function () { return { type: 'normal', msg: '' } }
    store = new Vuex.Store({state: {}, mutations, getters})
    const Constructor = Vue.extend(SavedExtracts)
    const vm = new Constructor({store}).$mount()
    let $message = vm.$el.querySelector('.message-container')
    expect($message).to.not.exist // eslint-disable-line
  })

  it('dropdown should default to "Saved searches" on page load even if there are saved searches', function () {
    getters.savedExtracts = () => [{name: 'test', disasters: TWO_RECORDS}]
    store = new Vuex.Store({state: {}, mutations, getters})
    const Constructor = Vue.extend(SavedExtracts)
    const vm = new Constructor({store}).$mount()
    expect(vm.selectedExtractName).to.be.equal('')
  })

  it('should show "Saved searches..." and empty the current extract when clear is clicked', function (done) {
    const Constructor = Vue.extend(SavedExtracts)
    const vm = new Constructor({store}).$mount()
    let $button = vm.$el.querySelector('#clear-button')
    dispatchEvent($button, 'click')
    Vue.nextTick(() => {
      expect(mutations.clearCurrentExtract.called).to.equal(true)
      expect(vm.selectedExtractName).to.be.equal('')
      done()
    })
  })

  it('should disable the delete-button when there is no selected extract', function () {
    const Constructor = Vue.extend(SavedExtracts)
    const vm = new Constructor({store}).$mount()
    let $button = vm.$el.querySelector('#delete-button')
    expect(vm.selectedExtractName).to.be.equal('')
    expect($button.disabled)
  })

  it('should disable the save-button when newExtract is false', function () {
    const Constructor = Vue.extend(SavedExtracts)
    const vm = new Constructor({store}).$mount()
    let $button = vm.$el.querySelector('#save-button')
    expect(vm.selectedExtractName).to.be.equal('')
    expect($button.disabled)
  })

  it('should set selectedExtractName to blank when newExtract is true', function () {
    getters.newExtract = function () { return true }
    store = new Vuex.Store({state: {}, mutations, getters})
    const Constructor = Vue.extend(SavedExtracts)
    const vm = new Constructor({store}).$mount()
    expect(vm.selectedExtractName).to.be.equal('')
  })

  describe('download', function () {
    it('should return correct API endpoint with search name when called with a selectedExtractName', function () {
      getters.currentExtract = () => { return TWO_RECORDS }
      store = new Vuex.Store({state: {}, mutations, getters})
      const Constructor = Vue.extend(SavedExtracts)
      const vm = new Constructor({store}).$mount()
      vm.selectedExtractName = 'MyTEST'
      let downloadURL = vm.download()
      expect(downloadURL).to.contain('/api/export/MyTEST')
    })

    it('should return API endpoint when called without a selectedExtractName', function () {
      getters.currentExtract = () => { return TWO_RECORDS }
      store = new Vuex.Store({state: {}, mutations, getters})
      const Constructor = Vue.extend(SavedExtracts)
      const vm = new Constructor({store}).$mount()
      vm.selectedExtractName = ''
      let downloadURL = vm.download()
      expect(downloadURL.should.not.be.empty)
    })
  })
})
