import 'es6-promise/auto' // eslint-disable-line
import Vue from 'vue' // eslint-disable-line
import Vuex from 'vuex' // eslint-disable-line
import sinon from 'sinon'
import store, {actions} from '../../../src/store' // eslint-disable-line

import Typeahead from '@/components/Typeahead' // eslint-disable-line

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

describe('Typeahead.vue', () => {
  it('should render correct list item contents', done => {
    const Constructor = Vue.extend(Typeahead)
    const vm = new Constructor({store}).$mount()
    vm.$store.commit('updateDisasterList', { list: ONE_RECORD })
    Vue.nextTick(function () {
      expect(vm.$el.querySelector('.disaster-search-recs').childElementCount).to.be.equal(1)
      done()
    })
  })

  it('should not populate items if query is empty', done => {
    const Constructor = Vue.extend(Typeahead)
    const vm = new Constructor({store}).$mount()
    vm.$store.commit('updateDisasterList', { list: [] })
    Vue.nextTick(function () {
      expect(vm.$el.querySelector('.disaster-search-recs').childElementCount).to.be.equal(0)
      done()
    })
  })

  describe('update', () => {
    it('should force a reset if query is undefined', () => {
      const Constructor = Vue.extend(Typeahead)
      const vm = new Constructor({store}).$mount()
      expect(vm.query).to.be.equal('')
      vm.query = undefined
      expect(vm.query).to.be.equal(undefined)
      vm.update()
      expect(vm.query).to.be.equal('')
    })

    it('should return before loading if query is shorter than 2', () => {
      const Constructor = Vue.extend(Typeahead)
      let stub = sinon.stub(actions, 'updateDisasterList')
      const vm = new Constructor({store}).$mount()
      expect(vm.query).to.be.equal('')
      vm.query = 'A'
      vm.update()
      expect(stub.called).to.be.equal(false)
    })
  })

  describe('displayMessage', function () {
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

    it('should return false if status.type is normal', function () {
      getters.status = function () {
        return { type: 'normal' }
      }
      store = new Vuex.Store({state: {}, mutations, getters})
      const Constructor = Vue.extend(Typeahead)
      const vm = new Constructor({store}).$mount()
      expect(vm.displayMessage).to.be.equal(false)
    })
    it('should return false if status.scope is not "app"', function () {
      getters.status = function () {
        return { type: 'error', scope: 'extract' }
      }
      store = new Vuex.Store({state: {}, mutations, getters})
      const Constructor = Vue.extend(Typeahead)
      const vm = new Constructor({store}).$mount()
      expect(vm.displayMessage).to.be.equal(false)
    })
    it('should return true if status.scope is "app"', function () {
      getters.status = function () {
        return { type: 'error', scope: 'app' }
      }
      store = new Vuex.Store({state: {}, mutations, getters})
      const Constructor = Vue.extend(Typeahead)
      const vm = new Constructor({store}).$mount()
      expect(vm.displayMessage).to.be.equal(true)
    })
    it('hideMessage should call resetStatus on the store', function () {
      const Constructor = Vue.extend(Typeahead)
      const vm = new Constructor({store}).$mount()
      vm.hideMessage()
      expect(mutations.resetStatus.called).to.be.equal(true)
    })
  })
})
