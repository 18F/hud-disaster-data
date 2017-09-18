import 'es6-promise/auto' // eslint-disable-line
import Vue from 'vue' // eslint-disable-line
import '@/vue-mixins'
import Vuex from 'vuex' // eslint-disable-line
import sinon from 'sinon'
const SelectLocationSideBar =  require('@/components/SelectLocationSideBar') // eslint-disable-line
import _ from 'lodash' // eslint-disable-line
import should from 'should'

Vue.use(Vuex)
Vue.config.productionTip = false

describe('SelectLocationSideBar component', function () {
  let store
  let mutations
  let actions
  let getters
  let Constructor
  let vm

  beforeEach(function () {
    getters = {
      disasterNumberResults: function () { return [] },
      localeResults: function () { return [] }
    }
    mutations = {
      updateDisasterNumberList: sinon.stub(),
      updateLocaleList: sinon.stub(),
      addDisasterFilter: sinon.stub(),
      addLocaleFilter: sinon.stub(),
      setSelectedGeographicLevel: sinon.stub(),
      clearStore: sinon.stub(),
      setState: sinon.stub(),
      updateReportDisasterList: sinon.stub()
    }
    actions = {
      setSelectedState: sinon.stub(),
      loadLocales: sinon.stub(),
      loadReportDisasterList: sinon.stub(),
      loadReportData: sinon.stub()
    }
    store = new Vuex.Store({state: {}, mutations, getters, actions})
    Constructor = Vue.extend(SelectLocationSideBar)
    vm = new Constructor({store}).$mount()
  })

  it('should start with populated state dropdown', function (done) {
    Vue.nextTick(() => {
      expect(vm.states.length).to.greaterThan(0)
      done()
    })
  })

  describe('beforeDestroy', function () {
    it('when invoked, do reset and initStore', function (done) {
      const resetSpy = sinon.spy()
      const commitSpy = sinon.spy()
      const that = {
        reset: resetSpy,
        $store: { commit: commitSpy }
      }
      const beforeDestroy = vm.$options.beforeDestroy[0]
      beforeDestroy.call(that)
      Vue.nextTick(() => {
        expect(resetSpy.called).to.be.equal(true)
        expect(commitSpy.calledWith('initStore')).to.be.equal(true)
        done()
      })
    })
  })

  describe('watch', function () {
    it('will look at URL and fire initializeValuesFromURL if changed', function (done) {
      debugger
      const initializeValuesFromURL = sinon.spy()
      const that = {initializeValuesFromURL}
      const routeWatch = vm.$root._watchers[2].cb
      routeWatch.call(that, 'this', 'that')
      Vue.nextTick(() => {
        expect(initializeValuesFromURL.called).to.be.equal(true)
        done()
      })
    })
  })

  describe('created event/initializeValuesFromURL', function () {
    const testStates = [{ code: 'MZ', name: 'Manzana' }, { code: 'NR', name: 'Naranja' }, { code: 'PL', name: 'Platano' }]
    const testGeoLevels = [{ code: 'city', name: 'City' }, { code: 'county', name: 'County' }, { code: 'something', name: 'Else' }]
    const testLocales = [{ code: 'Jodar', name: 'Jodar' }, { code: 'Ubeda', name: 'Ubeda' }, { code: 'Madrid', name: 'Madrid' }]
    const testDisasters = [{ code: 'AA-1234-ZZ', name: 'AA-1234-ZZ' }, { code: 'BB-5678-YY', name: 'BB-5678-YY' }, { code: 'CC-0987-XX', name: 'CC-0987-XX' }]

    it('should set no values in the selections if no URL parameters are passed in', function (done) {
      const clearStateSelectedSpy = sinon.spy()
      const that = { $route: { query: null }, clearStateSelected: clearStateSelectedSpy }
      const initializeValuesFromURL = vm.$options.methods.initializeValuesFromURL
      initializeValuesFromURL.call(that)
      Vue.nextTick(() => {
        expect(clearStateSelectedSpy.called)
        done()
      })
    })

    it('should set only the state based upon URL parameters passed in', function (done) {
      const commitSpy = sinon.spy()
      const setLevelSpy = sinon.spy()
      const changeStateSpy = sinon.spy()
      const stateRefSpy = sinon.spy()
      const geoSelectorSpy = sinon.spy()
      const clearStateSelectedSpy = sinon.spy()
      const thenSpy = sinon.spy()
      const createReportSpy = sinon.spy()
      const dispatchSpy = sinon.stub().callsFake(() => { return {then: thenSpy} })
      const newStore = new Vuex.Store({state: {}, mutations, getters, actions})

      store.commit = commitSpy
      store.dispatch = dispatchSpy
      store.getters = { localeResults: _.clone(testLocales), disasterNumberResults: _.clone(testDisasters) }
      const that = {
        $route: { query: {
          stateFilter: _.clone(testStates)[0].code
        } },
        states: _.clone(testStates),
        geographicLevels: _.clone(testGeoLevels),
        $store: newStore,
        stateSelected: null,
        geographicLevelSelected: null,
        setLevel: setLevelSpy,
        changeState: changeStateSpy,
        createReport: createReportSpy,
        clearStateSelected: clearStateSelectedSpy,
        $refs: {
          stateSelector: { select: stateRefSpy },
          geographicLevelSelector: { select: geoSelectorSpy }
        }
      }

      const initializeValuesFromURL = vm.$options.methods.initializeValuesFromURL
      initializeValuesFromURL.call(that)
      Vue.nextTick(() => {
        expect(changeStateSpy.calledOnce)
        expect(geoSelectorSpy.notCalled)
        expect(stateRefSpy.calledOnce)
        expect(clearStateSelectedSpy.calledOnce)
        done()
      })
    })

    it('should set only the state and geographicLevel based upon URL parameters passed in', function (done) {
      const commitSpy = sinon.spy()
      const setLevelSpy = sinon.spy()
      const changeStateSpy = sinon.spy()
      const stateRefSpy = sinon.spy()
      const geoSelectorSpy = sinon.spy()
      const clearStateSelectedSpy = sinon.spy()
      const checkDisabledSpy = sinon.spy()
      const thenSpy = sinon.spy()
      const createReportSpy = sinon.spy()
      const dispatchSpy = sinon.stub().callsFake(() => { return {then: thenSpy} })
      const newStore = new Vuex.Store({state: {}, mutations, getters, actions})

      store.commit = commitSpy
      store.dispatch = dispatchSpy
      store.getters = { localeResults: _.clone(testLocales), disasterNumberResults: _.clone(testDisasters) }
      const that = {
        $route: { query: {
          stateFilter: _.clone(testStates)[0].code,
          geographicLevel: _.clone(testGeoLevels)[0].code
        } },
        states: _.clone(testStates),
        geographicLevels: _.clone(testGeoLevels),
        $store: newStore,
        stateSelected: null,
        geographicLevelSelected: null,
        setLevel: setLevelSpy,
        changeState: changeStateSpy,
        createReport: createReportSpy,
        clearStateSelected: clearStateSelectedSpy,
        checkDisabled: checkDisabledSpy,
        $refs: {
          stateSelector: { select: stateRefSpy },
          geographicLevelSelector: { select: geoSelectorSpy }
        }
      }

      const initializeValuesFromURL = vm.$options.methods.initializeValuesFromURL
      initializeValuesFromURL.call(that)
      Vue.nextTick(() => {
        expect(changeStateSpy.calledOnce)
        expect(geoSelectorSpy.calledOnce)
        expect(clearStateSelectedSpy.calledOnce)
        expect(checkDisabledSpy.calledOnce)
        done()
      })
    })

    it('should set all the values in the selections based upon URL parameters passed in', function (done) {
      const commitSpy = sinon.spy()
      const setLevelSpy = sinon.spy()
      const changeStateSpy = sinon.spy()
      const stateRefSpy = sinon.spy()
      const geoSelectorSpy = sinon.spy()
      const clearStateSelectedSpy = sinon.spy()
      const checkDisabledSpy = sinon.spy()
      const thenSpy = sinon.spy()
      const createReportSpy = sinon.spy()
      const dispatchSpy = sinon.stub().callsFake(() => { return {then: thenSpy} })
      const newStore = new Vuex.Store({state: {}, mutations, getters, actions})

      store.commit = commitSpy
      store.dispatch = dispatchSpy
      store.getters = { localeResults: _.clone(testLocales), disasterNumberResults: _.clone(testDisasters) }
      const that = {
        $route: { query: {
          stateFilter: _.clone(testStates)[0].code,
          geographicLevel: _.clone(testGeoLevels)[0].code,
          localeFilter: _.clone(testLocales)[0].code,
          disasterFilter: _.clone(testDisasters)[0].code
        } },
        states: _.clone(testStates),
        geographicLevels: _.clone(testGeoLevels),
        $store: newStore,
        stateSelected: null,
        geographicLevelSelected: null,
        setLevel: setLevelSpy,
        changeState: changeStateSpy,
        createReport: createReportSpy,
        clearStateSelected: clearStateSelectedSpy,
        checkDisabled: checkDisabledSpy,
        $refs: {
          stateSelector: { select: stateRefSpy },
          geographicLevelSelector: { select: geoSelectorSpy }
        }
      }

      const initializeValuesFromURL = vm.$options.methods.initializeValuesFromURL
      initializeValuesFromURL.call(that)
      Vue.nextTick(() => {
        expect(changeStateSpy.calledOnce)
        expect(geoSelectorSpy.calledOnce)
        expect(clearStateSelectedSpy.calledOnce)
        expect(checkDisabledSpy.calledOnce)
        expect(commitSpy.calledWith('addLocaleFilter', testLocales[0]))
        expect(commitSpy.calledWith('addDisasterFilter', testDisasters[0]))
        done()
      })
    })
  })

  describe('changeState', function () {
    it('should reset locales and disaster numbers if state has changed', function (done) {
      vm.stateSelected = {code: 'WI', name: 'Wisconsin'}
      vm.localeSelected = ['this place', 'that other place']
      vm.disasterSelected = ['this disaster', 'the next disaster']
      const thenSpy = sinon.spy()
      const dispatchSpy = sinon.stub().callsFake(() => { return {then: thenSpy} })
      const iowa = {code: 'IA', name: 'Iowa'}
      store.dispatch = dispatchSpy
      vm.changeState(iowa)
      Vue.nextTick(() => {
        expect(vm.localeSelected).to.be.null
        expect(vm.disasterSelected).to.be.null
        expect(dispatchSpy.calledWith('setSelectedState', iowa))
        expect(dispatchSpy.calledWith('loadLocales', iowa.code))
        expect(dispatchSpy.calledWith('loadReportDisasterList', iowa.code))
        done()
      })
    })
  })

  describe('createReport', function () {
    it('should set parameters using geographicLevel "city" to proper values and pass them to loadReportData action', function (done) {
      let getters = {}
      let stateFilter = {code: 'TX', name: 'Texas'}
      let localeFilter = [{ code: 'HOUSTON', name: 'Houston' }]
      let disasterFilter = [{ code: 'DR-4272-TX', name: 'DR-4272-TX', selected: true }]
      let geographicLevel = { code: 'city', name: 'city' }
      getters.stateFilter = () => { return stateFilter }
      getters.localeFilter = () => { return localeFilter }
      getters.disasterFilter = () => { return disasterFilter }
      getters.geographicLevel = () => { return geographicLevel }
      store = new Vuex.Store({state: {}, mutations, getters, actions})
      Constructor = Vue.extend(SelectLocationSideBar)
      vm = new Constructor({store}).$mount()
      const dispatchSpy = sinon.spy(store, 'dispatch')
      vm.createReport()
      Vue.nextTick(() => {
        expect(dispatchSpy.calledWith('loadReportData', {'summaryCols': 'total_damages,hud_unmet_need', 'allFilters': {'stateId': 'TX', 'disasterId': ['4272'], 'geoName': 'city', 'geoArea': ['HOUSTON']}}))
        done()
      })
    })

    it('should set parameters, using geographicLevel "county" and nulls for all else but localeFilter, to proper values and pass them to loadReportData action', function (done) {
      let getters = {}
      getters.stateFilter = () => { return {code: 'somethin', name: 'somethin'} }
      getters.localeFilter = () => { return [{ code: 'HOUSTON', name: 'Houston' }] }
      getters.disasterFilter = () => { return [] }
      getters.geographicLevel = () => { return { code: 'county', name: 'county' } }
      store = new Vuex.Store({state: {}, mutations, getters, actions})
      Constructor = Vue.extend(SelectLocationSideBar)
      vm = new Constructor({store}).$mount()
      const dispatchSpy = sinon.spy(store, 'dispatch')
      vm.createReport()
      Vue.nextTick(() => {
        expect(dispatchSpy.calledWith('loadReportData', {'summaryCols': 'total_damages,hud_unmet_need', 'allFilters': {'stateId': null, 'disasterId': [], 'geoName': 'county_name', 'geoArea': [{ code: 'HOUSTON', name: 'Houston' }]}}))
        done()
      })
    })
  })

  describe('clearAll', function () {
    it('should call $router.push(), reset(), initStore, $emit, and dispatch to clear out data and display empty report', function (done) {
      let push = sinon.spy()
      let reset = sinon.spy()
      let commit = sinon.spy()
      let dispatch = sinon.spy()
      let $emit = sinon.spy()
      const that = {
        $router: {push},
        reset,
        $emit,
        $store: {commit, dispatch}
      }
      const clearAll = vm.$options.methods.clearAll
      clearAll.call(that)
      should(reset.called).be.true()
      should(push.calledWith({name: 'reports'})).be.true()
      should(commit.calledWith('initStore')).be.true()
      should($emit.calledWith('updateSummaryDisplay')).be.true()
      should(dispatch.calledWith('loadReportData')).be.true()
      done()
    })
  })

  describe('openDialogue', function () {
    it('should return true if confirm returns true', function (done) {
      let confirm = sinon.stub(window, 'confirm').callsFake(() => { return true })
      let returnCode = vm.openDialogue()
      should(confirm.called).be.true()
      should(returnCode).be.true()
      confirm.restore()
      done()
    })

    it('should return false if confirm returns false', function (done) {
      let confirm = sinon.stub(window, 'confirm').callsFake(() => { return false })
      let returnCode = vm.openDialogue()
      should(confirm.called).be.true()
      should(returnCode).be.false()
      confirm.restore()
      done()
    })
  })

  describe('reset', function () {
    it(`should reset all the selected values to null and clear the store's state`, function (done) {
      vm.localeSelected = 1
      vm.disasterSelected = 1
      vm.stateSelected = 1
      let commitSpy = sinon.spy(vm.$store, 'commit')
      vm.reset()
      Vue.nextTick(() => {
        should(vm.localeSelected).be.null()
        should(vm.disasterSelected).be.null()
        should(vm.geographicLevelSelected).be.null()
        should(vm.stateSelected).be.null()
        should(commitSpy.calledWith('setSelectedGeographicLevel')).be.true()
        should(commitSpy.calledWith('updateLocaleList')).be.true()
        should(commitSpy.calledWith('setState')).be.true()
        done()
        commitSpy.restore()
      })
    })
  })
  describe('addDisaster', function () {
    it('should add the disaster', function (done) {
      vm.disasterSelected = {name: 'big disaster', code: 'BAD'}
      let commitSpy = sinon.spy(store, 'commit')
      vm.addDisaster()
      Vue.nextTick(() => {
        should(commitSpy.calledWith('addDisasterFilter')).be.true()
        done()
      })
    })
    it('should do nothing if no disaster is selected', function (done) {
      vm.disasterSelected = null
      let commitSpy = sinon.spy(store, 'commit')
      vm.addDisaster()
      Vue.nextTick(() => {
        should(commitSpy.calledWith('addDisasterFilter')).be.false()
        done()
      })
    })
  })

  describe('addLocale', function () {
    it('should add the locale', function (done) {
      vm.localeSelected = {name: 'Alexandria', code: 'Alexandria'}
      vm.filterDisasters = function () {}
      let commitSpy = sinon.spy(store, 'commit')
      vm.addLocale()
      Vue.nextTick(() => {
        should(commitSpy.calledWith('addLocaleFilter')).be.true()
        done()
      })
    })
    it('should do nothing if no locale is selected', function (done) {
      vm.localeSelected = null
      let commitSpy = sinon.spy(store, 'commit')
      vm.addLocale()
      Vue.nextTick(() => {
        should(commitSpy.calledWith('addLocaleFilter')).be.false()
        done()
      })
    })
    it('should trigger disaster filter if locale is selected', function (done) {
      let commit = sinon.spy()
      let clearValue = sinon.spy()
      let filterDisasters = sinon.spy()
      const that = {
        localeSelected: {name: 'HOUSTON', code: 'HOUSTON'},
        $store: {commit},
        $refs: {localeSelect: {clearValue}},
        filterDisasters
      }

      let addLocale = vm.$options.methods.addLocale
      addLocale.call(that)
      Vue.nextTick(() => {
        should(commit.calledWith('addLocaleFilter')).be.true()
        should(clearValue.called).be.true()
        should(filterDisasters.called).be.true()
        done()
      })
    })
  })

  describe('filterDisasters', function () {
    it('should load disasters, filtered by localeFilter', function (done) {
      const thenSpy = sinon.spy()
      const dispatchStub = sinon.stub().callsFake(() => { return {then: thenSpy} })
      vm.$store.dispatch = dispatchStub
      vm.filterDisasters()
      Vue.nextTick(() => {
        should(dispatchStub.calledWith('loadFilteredDisasters')).be.true()
        should(thenSpy.called).be.true()
        done()
      })
    })
  })

  describe('setLevel', function () {
    it('should set the geographicLevel', function (done) {
      const level = {name: 'City', code: 'city'}
      const commit = sinon.spy()
      const clearLocales = sinon.spy()
      const filterDisasters = sinon.spy()
      const checkDisabled = sinon.spy()
      const then = sinon.spy()
      const dispatch = sinon.stub().callsFake(() => { return {then} })
      const that = {
        stateSelected: 'XX',
        geographicLevelSelected: null,
        clearLocales,
        filterDisasters,
        checkDisabled,
        $store: {commit, dispatch, getters: {stateFilter: 'Something'}}
      }
      const setLevel = vm.$options.methods.setLevel
      setLevel.call(that, level)
      Vue.nextTick(() => {
        should(commit.calledWith('setSelectedGeographicLevel', level)).be.true()
        should(clearLocales.called).be.true()
        should(filterDisasters.called).be.true()
        should(dispatch.calledWith('loadLocales')).be.true()
        should(checkDisabled.called).be.true()
        done()
      })
    })
    it('should run clearValue on geographicLevel if empty', function (done) {
      const commitSpy = sinon.spy(store, 'commit')
      const clearValueSpy = sinon.spy(vm.$refs.geographicLevelSelector, 'clearValue')
      vm.setLevel()
      Vue.nextTick(() => {
        should(commitSpy.calledWith('setSelectedGeographicLevel')).be.true()
        should(clearValueSpy.called).be.true()
        commitSpy.restore()
        clearValueSpy.restore()
        done()
      })
    })
  })

  describe('removeDisaster', function () {
    it('should call commit to remove the disaster', function (done) {
      let disaster = 'something'
      let commitSpy = sinon.spy(store, 'commit')
      vm.removeDisaster(disaster)
      Vue.nextTick(() => {
        should(commitSpy.calledWith('removeDisasterFilter')).be.true()
        done()
      })
    })
  })

  describe('removeLocale', function () {
    it('should call commit to remove the locale', function (done) {
      let locale = 'something'
      let commitSpy = sinon.spy(store, 'commit')
      vm.filterDisasters = function () {}
      vm.removeLocale(locale)
      Vue.nextTick(() => {
        should(commitSpy.calledWith('removeLocaleFilter')).be.true()
        done()
      })
    })
  })
})
