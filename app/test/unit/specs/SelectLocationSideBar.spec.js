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
Vue.config.silent = true
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
      const commit = sinon.spy()
      const that = {
        reset: resetSpy,
        $store: { commit: commit }
      }
      const beforeDestroy = vm.$options.beforeDestroy[0]
      beforeDestroy.call(that)
      Vue.nextTick(() => {
        expect(resetSpy.called).to.be.equal(true)
        expect(commit.calledWith('initStore')).to.be.equal(true)
        done()
      })
    })
  })

  describe('watch', function () {
    it('will look at URL and fire initializeValuesFromURL if changed', function (done) {
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

  describe('initializeValuesFromURL', function () {
    const testStates = [{ code: 'MZ', name: 'Manzana' }, { code: 'NR', name: 'Naranja' }, { code: 'PL', name: 'Platano' }]
    const testGeoLevels = [{ code: 'city', name: 'City' }, { code: 'county', name: 'County' }, { code: 'something', name: 'Else' }]
    const testLocales = [{ code: 'Jodar', name: 'Jodar' }, { code: 'Ubeda', name: 'Ubeda' }, { code: 'Madrid', name: 'Madrid' }]
    const testDisasters = [{ code: 'AA-1234-ZZ', name: 'AA-1234-ZZ' }, { code: 'BB-5678-YY', name: 'BB-5678-YY' }, { code: 'CC-0987-XX', name: 'CC-0987-XX' }]

    const commit = sinon.spy()
    const setLevel = sinon.spy()
    const changeState = sinon.spy()
    const stateRef = sinon.spy()
    const geoSelector = sinon.spy()
    const clearStateSelected = sinon.spy()
    const checkDisabled = sinon.spy()
    // const then = sinon.spy()
    const createReport = sinon.spy()
    const dispatch = sinon.stub().callsFake(() => { return { then: function (cb) { cb() } } })
    const newStore = new Vuex.Store({state: {}, mutations, getters, actions})

    it('should set no values in the selections if no URL parameters are passed in', function (done) {
      const clearStateSelected = sinon.spy()
      const that = { $route: { query: null }, clearStateSelected }
      const initializeValuesFromURL = vm.$options.methods.initializeValuesFromURL
      initializeValuesFromURL.call(that)
      Vue.nextTick(() => {
        expect(clearStateSelected.called)
        done()
      })
    })

    it('should set only the state based upon URL parameters passed in', function (done) {
      store.commit = commit
      store.dispatch = dispatch
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
        setLevel,
        changeState,
        createReport,
        clearStateSelected,
        $refs: {
          stateSelector: { select: stateRef },
          geographicLevelSelector: { select: geoSelector }
        }
      }

      const initializeValuesFromURL = vm.$options.methods.initializeValuesFromURL
      initializeValuesFromURL.call(that)
      Vue.nextTick(() => {
        expect(changeState.calledOnce)
        expect(geoSelector.notCalled)
        expect(stateRef.calledOnce)
        expect(clearStateSelected.calledOnce)
        done()
      })
    })

    it('should set only the state and geographicLevel based upon URL parameters passed in', function (done) {
      store.commit = commit
      store.dispatch = dispatch
      store.getters = { localeResults: _.clone(testLocales), disasterNumberResults: _.clone(testDisasters) }
      const that = {
        $route: { query: {
          stateFilter: _.clone(testStates)[0].code,
          geographicLevel: _.clone(testGeoLevels)[0].code
        } },
        states: _.clone(testStates),
        geographicLevels: _.clone(testGeoLevels),
        $store: store,
        stateSelected: null,
        geographicLevelSelected: null,
        setLevel,
        changeState,
        createReport,
        clearStateSelected,
        checkDisabled,
        $refs: {
          stateSelector: { select: stateRef },
          geographicLevelSelector: { select: geoSelector }
        }
      }

      const initializeValuesFromURL = vm.$options.methods.initializeValuesFromURL
      initializeValuesFromURL.call(that)
      Vue.nextTick(() => {
        expect(changeState.calledOnce)
        expect(geoSelector.calledOnce)
        expect(clearStateSelected.calledOnce)
        expect(checkDisabled.calledOnce)
        done()
      })
    })

    it('should set all the values in the selections based upon URL parameters passed in', function (done) {
      newStore.commit = commit
      newStore.dispatch = dispatch
      newStore.getters = { localeResults: _.clone(testLocales), disasterNumberResults: _.clone(testDisasters) }
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
        setLevel,
        changeState,
        createReport,
        clearStateSelected,
        checkDisabled,
        $refs: {
          stateSelector: { select: stateRef },
          geographicLevelSelector: { select: geoSelector }
        }
      }

      const initializeValuesFromURL = vm.$options.methods.initializeValuesFromURL
      initializeValuesFromURL.call(that)
      Vue.nextTick(() => {
        expect(changeState.calledOnce)
        expect(geoSelector.calledOnce)
        expect(clearStateSelected.calledOnce)
        expect(checkDisabled.calledOnce)
        expect(createReport.calledOnce)
        expect(commit.calledWith('addLocaleFilter', testLocales[0]))
        expect(commit.calledWith('addDisasterFilter', testDisasters[0]))
        expect(commit.calledWith('setDisasterFilter', testDisasters[0]))
        expect(dispatch.calledWith('loadFilteredDisasters'))
        expect(dispatch.calledWith('loadLocales'))
        done()
      })
    })

    it('should set all the supplied values in the selections based upon URL parameters passed in, except geographicLevel parameter', function (done) {
      newStore.commit = commit
      newStore.dispatch = dispatch
      newStore.getters = { localeResults: _.clone(testLocales), disasterNumberResults: _.clone(testDisasters) }
      const that = {
        $route: { query: {
          stateFilter: _.clone(testStates)[0].code,
          geographicLevel: undefined,
          localeFilter: undefined,
          disasterFilter: _.clone(testDisasters)[0].code
        } },
        states: _.clone(testStates),
        geographicLevels: _.clone(testGeoLevels),
        $store: newStore,
        stateSelected: null,
        geographicLevelSelected: null,
        setLevel,
        changeState,
        createReport,
        clearStateSelected,
        checkDisabled,
        $refs: {
          stateSelector: { select: stateRef },
          geographicLevelSelector: { select: geoSelector }
        }
      }

      const initializeValuesFromURL = vm.$options.methods.initializeValuesFromURL
      initializeValuesFromURL.call(that)
      Vue.nextTick(() => {
        expect(changeState.calledOnce)
        expect(geoSelector.calledOnce)
        expect(clearStateSelected.calledOnce)
        expect(checkDisabled.calledOnce)
        expect(createReport.calledOnce)
        expect(commit.calledWith('addLocaleFilter', testLocales[0]))
        expect(commit.calledWith('addDisasterFilter', testDisasters[0]))
        expect(dispatch.calledWith('loadFilteredDisasters'))
        expect(commit.calledWith('setDisasterFilter', testDisasters[0]))
        done()
      })
    })

    it('should set none of the values in the selections when no stateFilter URL parameter passed in', function (done) {
      const that = { $route: { query: { stateFilter: null } }, clearStateSelected }

      const initializeValuesFromURL = vm.$options.methods.initializeValuesFromURL
      initializeValuesFromURL.call(that)
      Vue.nextTick(() => {
        expect(clearStateSelected.called)
        expect(vm.stateParam).to.be.equal(undefined)
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
      let summaryColumns = ['total_damages', 'hud_unmet_need']
      getters.stateFilter = () => { return stateFilter }
      getters.localeFilter = () => { return localeFilter }
      getters.disasterFilter = () => { return disasterFilter }
      getters.geographicLevel = () => { return geographicLevel }
      getters.selectedSummaryColumns = () => { return summaryColumns }
      store = new Vuex.Store({state: {}, mutations, getters, actions})
      Constructor = Vue.extend(SelectLocationSideBar)
      vm = new Constructor({store}).$mount()
      const dispatchSpy = sinon.spy(store, 'dispatch')
      vm.createReport()
      Vue.nextTick(() => {
        expect(dispatchSpy.calledWith('loadReportData', {'allFilters': {'stateId': 'TX', 'disasterId': ['4272'], 'geoName': 'city', 'geoArea': ['HOUSTON'], 'summaryCols': 'total_damages,hud_unmet_need'}}))
        done()
      })
    })

    it('should set parameters, using geographicLevel "county" and nulls for all else but localeFilter, to proper values and pass them to loadReportData action', function (done) {
      let getters = {}
      getters.stateFilter = () => { return {code: 'somethin', name: 'somethin'} }
      getters.localeFilter = () => { return [{ code: 'HOUSTON', name: 'Houston' }] }
      getters.disasterFilter = () => { return [] }
      getters.geographicLevel = () => { return { code: 'county', name: 'county' } }
      getters.selectedSummaryColumns = () => ['total_damages', 'hud_unmet_need']
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
      let commitSpy = sinon.spy()
      let dispatchSpy = sinon.spy()
      let $emit = sinon.spy()
      const that = {
        $router: {push},
        reset,
        $emit,
        $store: {commit: commitSpy, dispatch: dispatchSpy}
      }
      const clearAll = vm.$options.methods.clearAll
      clearAll.call(that)
      should(reset.called).be.true()
      should(push.calledWith({name: 'reports'})).be.true()
      should(commitSpy.calledWith('initStore')).be.true()
      should($emit.calledWith('updateSummaryDisplay')).be.true()
      should(dispatchSpy.calledWith('loadReportData')).be.true()
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
      let commitSpy = sinon.spy()
      let clearValueSpy = sinon.spy()
      let filterDisastersSpy = sinon.spy()
      const that = {
        localeSelected: {name: 'HOUSTON', code: 'HOUSTON'},
        $store: {commit: commitSpy},
        $refs: {localeSelect: {clearValue: clearValueSpy}},
        filterDisasters: filterDisastersSpy
      }

      let addLocale = vm.$options.methods.addLocale
      addLocale.call(that)
      Vue.nextTick(() => {
        should(commitSpy.calledWith('addLocaleFilter')).be.true()
        should(clearValueSpy.called).be.true()
        should(filterDisastersSpy.called).be.true()
        done()
      })
    })
  })

  describe('filterDisasters', function () {
    it('should load disasters, filtered by localeFilter', function (done) {
      const then = sinon.spy()
      const dispatchStub = sinon.stub().callsFake(() => { return {then: then} })
      vm.$store.dispatch = dispatchStub
      vm.filterDisasters()
      Vue.nextTick(() => {
        should(dispatchStub.calledWith('loadFilteredDisasters')).be.true()
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
      const commit = sinon.spy(store, 'commit')
      const clearValueSpy = sinon.spy(vm.$refs.geographicLevelSelector, 'clearValue')
      vm.setLevel()
      Vue.nextTick(() => {
        should(commit.calledWith('setSelectedGeographicLevel')).be.true()
        should(clearValueSpy.called).be.true()
        commit.restore()
        clearValueSpy.restore()
        done()
      })
    })
  })

  describe('removeDisaster', function () {
    it('should call commit to remove the disaster', function (done) {
      let disaster = 'something'
      let commit = sinon.spy(store, 'commit')
      vm.removeDisaster(disaster)
      Vue.nextTick(() => {
        should(commit.calledWith('removeDisasterFilter')).be.true()
        done()
      })
    })
  })

  describe('removeLocale', function () {
    it('should call commit to remove the locale', function (done) {
      let locale = 'something'
      let commit = sinon.spy(store, 'commit')
      vm.filterDisasters = function () {}
      vm.removeLocale(locale)
      Vue.nextTick(() => {
        should(commit.calledWith('removeLocaleFilter')).be.true()
        done()
      })
    })
  })

  describe('checkDisabled', function () {
    it('should set disabled to true for all fields when no state selected', function (done) {
      vm.stateSelected = null
      vm.disableLocales = false
      vm.disableCreate = false
      vm.disableDisasters = false
      vm.disableLevels = false
      vm.checkDisabled()
      Vue.nextTick(() => {
        should(vm.disableLocales).be.true()
        should(vm.disableCreate).be.true()
        should(vm.disableDisasters).be.true()
        should(vm.disableLevels).be.true()
        done()
      })
    })
    it('should set disabled to false for all fields when state and geographicLevel are selected', function (done) {
      vm.stateSelected = 'XX'
      vm.geographicLevelSelected = 'YY'
      vm.disableLocales = false
      vm.disableCreate = false
      vm.disableDisasters = false
      vm.disableLevels = false
      vm.checkDisabled()
      Vue.nextTick(() => {
        should(vm.disableLocales).be.false()
        should(vm.disableCreate).be.false()
        should(vm.disableDisasters).be.false()
        should(vm.disableLevels).be.false()
        done()
      })
    })
    it('should set disabled to false for all fields but disableLocales when state is selected, but geographicLevel is not', function (done) {
      vm.stateSelected = 'XX'
      vm.geographicLevelSelected = null
      vm.disableLocales = false
      vm.disableCreate = false
      vm.disableDisasters = false
      vm.disableLevels = false
      vm.checkDisabled()
      Vue.nextTick(() => {
        should(vm.disableLocales).be.true()
        should(vm.disableCreate).be.false()
        should(vm.disableDisasters).be.false()
        should(vm.disableLevels).be.false()
        done()
      })
    })
  })

  describe('pushReportUrl', function () {
    it('should generate proper URL and push it with the router', function (done) {
      const push = sinon.spy()
      const that = {
        $store: {
          getters: {
            stateFilter: {code: 'XX'},
            geographicLevel: {code: 'YY'},
            localeFilter: [{code: 'AA'}],
            disasterFilter: [{code: 'BB'}],
            selectedSummaryColumns: ['JJ', 'KK']
          }
        },
        $router: {push}
      }
      const pushReportUrl = vm.$options.methods.pushReportUrl
      pushReportUrl.call(that)
      Vue.nextTick(() => {
        should(push.calledWith({
          name: 'reports',
          query: {
            disasterFilter: 'BB',
            geographicLevel: 'YY',
            localeFilter: 'AA',
            stateFilter: 'XX',
            summaryColumns: 'JJ,KK'
          }
        })).be.true()
        done()
      })
    })
  })
})
