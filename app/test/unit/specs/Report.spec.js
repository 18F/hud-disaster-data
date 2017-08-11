import 'es6-promise/auto' // eslint-disable-line
import Vue from 'vue' // eslint-disable-line
import '@/vue-mixins'
import Vuex from 'vuex' // eslint-disable-line
import Report from '@/components/Report' // eslint-disable-line
import _ from 'lodash' // eslint-disable-line

Vue.use(Vuex)
Vue.config.productionTip = false

describe('Report component', function () {
  let store
  let getters
  let Constructor
  let vm

  beforeEach(function () {
    getters = {
      stateFilter: function () { return {code: 'Wisconsin', name: 'Wisconsin'} },
      disasterFilter: function () { return [{code: 'DR-4272-TX', name: 'DR-4272-TX'}, {code: 'DR-4277-TX', name: 'DR-4277-TX'}] },
      localeFilter: function () { return [{code: 'Houston', name: 'Houston'}, {code: 'Alamo', name: 'Alamo'}] },
      geographicLevel: function () { return {code: 'city', name: 'city'} },
      summaryRecords: function () { return { household_count: 1, total_damages: 100, hud_unmet_need: 50 } }
    }

    store = new Vuex.Store({state: {displayLevel: null, displayStateName: null, displayDisasters: null, displayLocales: null}, getters})
    Constructor = Vue.extend(Report)
    vm = new Constructor({store}).$mount()
  })

  describe('stateName', function () {
    it('should return the state name', function (done) {
      vm.displayStateName = 'Wisconsin'
      expect(vm.stateName).to.be.equal('Wisconsin')
      done()
    })
  })
  describe('stateName', function () {
    it('should return an empty string if state is not set', function (done) {
      vm.displayStateName = ''
      expect(vm.stateName).to.be.equal('')
      done()
    })
  })

  describe('disasters', function () {
    it('should return the disasters', function (done) {
      vm.displayDisasters = getters.disasterFilter()
      expect(vm.disasters).to.be.equal('DR-4272-TX, DR-4277-TX')
      done()
    })
  })
  describe('locales', function () {
    it('should return the locales', function (done) {
      vm.displayLocales = getters.localeFilter()
      expect(vm.locales).to.be.equal('Houston, Alamo')
      done()
    })
  })
  describe('level', function () {
    it('should return the geographicLevel', function (done) {
      vm.displaylevel = 'city'
      expect(vm.level).to.be.equal('city')
      done()
    })
  })
  describe('summaryRecords', function () {
    it('should return the records for the summary report', function (done) {
      expect(vm.summaryRecords.household_count).to.be.equal(1)
      expect(vm.summaryRecords.total_damages).to.be.equal(100)
      expect(vm.summaryRecords.hud_unmet_need).to.be.equal(50)
      done()
    })
  })
  describe('updateSummaryDisplay', function () {
    it('should set summary values', function (done) {
      let data = {level: 'level val', stateName: 'stateName val', disasters: 'disasters val', locales: 'locales val'}
      vm.updateSummaryDisplay(data)
      expect(vm.displaylevel).to.be.equal('level val')
      expect(vm.displayStateName).to.be.equal('stateName val')
      expect(vm.displayDisasters).to.be.equal('disasters val')
      expect(vm.displayLocales).to.be.equal('locales val')
      done()
    })
  })
})
