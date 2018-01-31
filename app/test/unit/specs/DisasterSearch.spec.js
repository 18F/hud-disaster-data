import 'es6-promise/auto' // eslint-disable-line
import Vue from 'vue' // eslint-disable-line
import '@/vue-mixins'
import Vuex from 'vuex' // eslint-disable-line
import sinon from 'sinon'
import store from '@/store' // eslint-disable-line
import router from '@/router'
import {actions, getters, mutations} from '@/searchStore' // eslint-disable-line
import DisasterSearch from '@/components/DisasterSearch' // eslint-disable-line
import Message from '@/components/Message' // eslint-disable-line
import magic from '@/bus'

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

describe('DisasterSearch.vue', () => {
  it('should render correct list item contents', done => {
    const Constructor = Vue.extend(DisasterSearch)
    const vm = new Constructor({store, router}).$mount()
    vm.$store.commit('updateDisasterList', ONE_RECORD)
    Vue.nextTick(function () {
      expect(vm.$el.querySelector('.disaster-search-recs').childElementCount).to.be.equal(1)
      done()
    })
  })

  it('should not populate items if query is empty', done => {
    const Constructor = Vue.extend(DisasterSearch)
    const vm = new Constructor({store, router}).$mount()
    vm.$store.commit('updateDisasterList', [])
    Vue.nextTick(function () {
      expect(vm.$el.querySelector('.disaster-search-recs').childElementCount).to.be.equal(0)
      done()
    })
  })

  describe('update', () => {
    it('should force a reset if query is undefined', () => {
      const Constructor = Vue.extend(DisasterSearch)
      const vm = new Constructor({store, router}).$mount()
      expect(vm.query).to.be.equal('')
      vm.query = undefined
      expect(vm.query).to.be.equal(undefined)
      vm.update()
      Vue.nextTick(() => {
        expect(vm.query).to.be.equal('')
      })
    })

    it('should call dispatch if query passes validation', () => {
      const Constructor = Vue.extend(DisasterSearch)
      let dispatch = sinon.spy()
      const vm = new Constructor({store, router}).$mount()
      let that = {
        $store: {dispatch, getters: {user: 'me'}},
        query: 'TX'
      }
      const update = vm.$options.methods.update
      update.call(that)
      expect(dispatch.calledWith('loadDisasterList')).to.be.equal(true)
    })

    it('should return before loading if query is shorter than 2', () => {
      const Constructor = Vue.extend(DisasterSearch)
      let dispatch = sinon.spy()
      const vm = new Constructor({store, router}).$mount()
      expect(vm.query).to.be.equal('')
      vm.query = 'A'
      vm.dispatch = dispatch
      vm.update()
      expect(dispatch.called).to.be.equal(false)
    })

    it('should return before loading if query is shorter than 4 and it is numeric', () => {
      const Constructor = Vue.extend(DisasterSearch)
      let dispatch = sinon.spy()
      const vm = new Constructor({store, router}).$mount()
      expect(vm.query).to.be.equal('')
      vm.query = 123
      vm.dispatch = dispatch
      vm.update()
      expect(dispatch.called).to.be.equal(false)
    })

    it('should call loadDisasterList if query is >= 2 in length and is not all numeric', () => {
      let loadDisasterListStub = sinon.stub()
      const myStore = new Vuex.Store({state: store.state, actions: {loadDisasterList: loadDisasterListStub}, getters})
      const Constructor = Vue.extend(DisasterSearch)
      const vm = new Constructor({store: myStore, router}).$mount()
      expect(vm.query).to.be.equal('')
      vm.query = 'DRX'
      vm.update()
      Vue.nextTick(() => {
        expect(loadDisasterListStub.called).to.be.equal(true)
      })
    })
  })
  describe('isEmpty', () => {
    it('should return true if query is empty', () => {
      const Constructor = Vue.extend(DisasterSearch)
      const vm = new Constructor({store, router}).$mount()
      expect(vm.query).to.be.equal('')
      vm.query = undefined
      expect(vm.query).to.be.equal(undefined)
      vm.update()
      Vue.nextTick(() => {
        expect(vm.isEmpty).to.be.equal(true)
      })
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
      const Constructor = Vue.extend(Message)
      const vm = new Constructor({store, router}).$mount()
      expect(vm.displayMessage).to.be.equal(false)
    })

    describe('mounted', () => {
      it('magic should listen for clearQuery and set query to blank if searchText is blank', () => {
        const Constructor = Vue.extend(DisasterSearch)
        const vm = new Constructor({store, router}).$mount()
        vm.$refs.searchText.value = ''
        vm.query = 'something'
        magic.$emit('clearQuery')
        expect(vm.query).to.be.equal('')
      })

      it('magic should listen for clearQuery and not set query to blank if searchText is not blank', () => {
        const Constructor = Vue.extend(DisasterSearch)
        const vm = new Constructor({store, router}).$mount()
        vm.$refs.searchText.value = 'somethingelse'
        vm.query = 'something'
        magic.$emit('clearQuery')
        expect(vm.query).to.be.equal('something')
      })
    })
  })
})
