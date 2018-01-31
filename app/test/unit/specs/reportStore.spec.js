/* global describe, it, expect, beforeEach */
import 'es6-promise/auto' // eslint-disable-line
import _ from 'lodash'
import moxios from 'moxios' // eslint-disable-line
import { mutations, actions, getters } from '@/reportStore' // eslint-disable-line
import sinon from 'sinon'
import should from 'should'
import magic from '@/bus'
const { updateReportDisasterList, updateLocaleList,
  setState, addDisasterFilter, addLocaleFilter, removeDisasterFilter, removeLocaleFilter, setLocalesFilter, setDisastersFilter,
  setShowReportSpinner, setSelectedGeographicLevel, updateReportData, setShowReport, initStore, setSummaryColumn } = mutations
const { loadLocales, loadReportData, loadFilteredDisasters } = actions
const { localeFilter, disasterFilter, showReportSpinner, geographicLevel, stateFilter, summaryRecords, showReport, summaryColumns, selectedSummaryColumns } = getters

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

const TWO_LOCALES = [{name: 'Morley', code: 'Morley'}, {name: 'Anamosa', code: 'Anamosa'}]

describe('reportStore', function () {
  beforeEach(function () {
    moxios.install()
  })
  afterEach(function () {
    moxios.uninstall()
  })
  describe('updateReportDisasterList', function () {
    it('should set disaster', function () {
      let state = { disasterList: [] }
      let disasterNumberResults = getters.disasterNumberResults
      updateReportDisasterList(state, TWO_RECORDS)
      expect(state.disasterList.length).to.be.equal(2)
      expect(disasterNumberResults(state).length).to.be.equal(2)
    })
  })
  describe('updateLocaleList', function () {
    it('should set localeList', function () {
      let state = { localeList: [] }
      let localeResults = getters.localeResults
      updateLocaleList(state, TWO_LOCALES)
      expect(state.localeList.length).to.be.equal(2)
      expect(localeResults(state).length).to.be.equal(2)
    })
  })

  describe('loadFilteredDisasters', function () {
    let emit
    beforeEach(function () {
      emit = sinon.spy(magic, '$emit')
    })
    afterEach(function () {
      emit.restore()
    })

    it('should call commit for updateReportDisasterList when the data is loaded', function (done) {
      moxios.stubRequest(/IA/, {
        status: 200,
        response: _.clone(TWO_RECORDS)
      })
      const commit = sinon.spy()
      let state = {geographicLevel: {code: 'city'}, stateFilter: {code: 'IA'}, localeList: [{name: 'Cedar Rapids'}]}
      loadFilteredDisasters({commit, state}, 'IA')
      moxios.wait(() => {
        should(commit.calledWith('updateReportDisasterList')).be.true()
        should(commit.calledWith('resetStatus')).be.true()
        done()
      })
    })

    it('should call commit for updateReportDisasterList when the data is loaded and a locale is selected', function (done) {
      moxios.stubRequest(/IA/, {
        status: 200,
        response: _.clone(TWO_RECORDS)
      })
      const commit = sinon.spy()
      let state = {geographicLevel: {code: 'city'}, stateFilter: {code: 'IA'}, localeList: [{name: 'Cedar Rapids', selected: true}]}
      loadFilteredDisasters({commit, state}, 'IA')
      moxios.wait(() => {
        should(commit.calledWith('updateReportDisasterList')).be.true()
        should(commit.calledWith('resetStatus')).be.true()
        done()
      })
    })

    it('should call commit for updateReportDisasterList when the data is loaded, when no localeList or geographicLevel is set', function (done) {
      moxios.stubRequest(/IA/, {
        status: 200,
        response: _.clone(TWO_RECORDS)
      })
      const commit = sinon.spy()
      let state = {geographicLevel: null, stateFilter: {code: 'IA'}, localeList: []}
      loadFilteredDisasters({commit, state}, 'IA')
      moxios.wait(() => {
        should(commit.calledWith('updateReportDisasterList')).be.true()
        should(commit.calledWith('resetStatus')).be.true()
        done()
      })
    })

    it('should call commit for setStatus when no stateFilter parameter is passed in', function (done) {
      const commit = sinon.stub().callsFake((mutn, msg) => {
        expect(mutn).to.be.equal('setStatus')
        expect(msg.type).to.be.equal('error')
        expect(msg.scope).to.be.equal('app')
        expect(msg.msg).to.be.equal('State not specified!')
        done()
      })
      let state = {stateFilter: null}
      loadFilteredDisasters({commit, state})
    })

    it('should call commit for setStatus when no data is found', function (done) {
      moxios.stubRequest(/IA/, {
        status: 200,
        response: []
      })
      const commit = sinon.spy()
      let state = {geographicLevel: {code: 'city'}, stateFilter: {code: 'IA'}, localeList: [{name: 'NonExistant'}]}
      loadFilteredDisasters({commit, state}, 'IA')
      moxios.wait(() => {
        should(commit.calledWith('updateReportDisasterList')).be.true()
        should(emit.calledWith('filteredDisastersLoaded')).be.false()
        should(commit.calledWith('setStatus'), {type: 'info', scope: 'app', msg: 'No results found!'}).be.true()
        done()
      })
    })
  })

  describe('loadLocales', function () {
    it('should call commit for updateLocaleList when the data is loaded', function (done) {
      moxios.stubRequest(/WI/, {
        status: 200,
        response: _.clone(TWO_LOCALES)
      })
      const commit = sinon.spy()
      const state = {geographicLevel: {code: 'City', name: 'City'}, stateFilter: {code: 'WI', name: 'WI'}}
      loadLocales({commit, state}, 'WI')
      moxios.wait(() => {
        should(commit.calledWith('updateLocaleList')).be.true()
        should(commit.calledWith('resetStatus')).be.true()
        done()
      })
    })
    it('should set status to "no results found" if result is empty', function (done) {
      moxios.stubRequest(/WI/, {
        status: 200,
        response: []
      })
      const commit = sinon.spy()
      const state = {geographicLevel: {code: 'City', name: 'City'}, stateFilter: {code: 'WI', name: 'WI'}}
      loadLocales({commit, state}, 'WI')
      moxios.wait(() => {
        should(commit.calledWith('updateLocaleList')).be.true()
        should(commit.calledWith('resetStatus')).be.false()
        should(commit.calledWith('setStatus')).be.true()
        done()
      })
    })
    it('should set status to error if server responds with error for loadLocales', function (done) {
      moxios.stubRequest(/WI/, {
        status: 500
      })
      const commit = sinon.spy()
      const state = {geographicLevel: {code: 'City', name: 'City'}, stateFilter: {code: 'WI', name: 'WI'}}
      loadLocales({commit, state}, 'WI')
      moxios.wait(() => {
        should(commit.calledWith('updateLocaleList')).be.false()
        should(commit.calledWith('resetStatus')).be.false()
        should(commit.calledWith('setStatus')).be.true()
        done()
      })
    })
    it('should format congressional district correctly', function (done) {
      moxios.stubRequest(/WI/, {
        status: 200,
        response: ['1234567', '7654321']
      })
      const commit = sinon.spy()
      const state = {geographicLevel: {name: 'Congressional District', code: 'CongrDist'}, stateFilter: {code: 'WI', name: 'WI'}}
      loadLocales({commit, state}, 'WI')
      const expected = [{code: '1234567', name: '34'}, {code: '7654321', name: '54'}]
      moxios.wait(() => {
        should(commit.calledWith('updateLocaleList', expected)).be.true()
        should(commit.calledWith('resetStatus')).be.true()
        done()
      })
    })
  })

  describe('initStore', function () {
    it('should set values of store', function () {
      let state = {
        disasterList: ['something'],
        localeList: ['somewhere'],
        geographicLevel: 'nothing else',
        summaryRecords: ['sum thing'],
        showReport: 'not',
        showReportSpinner: 'not',
        stateFilter: 'no state'
      }
      initStore(state, 'Wisconsin')
      should(state.disasterList.length).be.equal(0)
      should(state.localeList.length).be.equal(0)
      should(state.geographicLevel).be.equal(null)
      should(state.summaryRecords.length).be.equal(0)
      should(state.showReport).be.equal(false)
      should(state.showReportSpinner).be.equal(false)
      should(state.stateFilter).be.equal('Wisconsin')
    })
  })

  describe('setState', function () {
    it('should set value of stateFilter', function () {
      let state = {
        stateFilter: null
      }
      setState(state, 'something')
      should(state.stateFilter).be.equal('something')
      should(stateFilter(state)).be.equal('something')
    })
  })

  describe('setShowReportSpinner', function () {
    it('should set value of showReportSpinner to true', function () {
      let state = {showReportSpinner: false}
      setShowReportSpinner(state, true)
      should(state.showReportSpinner).be.equal(true)
      should(showReportSpinner(state)).be.equal(true)
    })
  })

  describe('showReport', function () {
    it('should set value of showReport to true', function () {
      let state = {showReport: false}
      setShowReport(state, true)
      should(state.showReport).be.equal(true)
      should(showReport(state)).be.equal(true)
    })
  })

  describe('setSelectedGeographicLevel', function () {
    it('should set value of geographicLevel to proper value', function () {
      let state = {geographicLevel: 'level one'}
      setSelectedGeographicLevel(state, 'level two')
      should(state.geographicLevel).be.equal('level two')
      should(geographicLevel(state)).be.equal('level two')
    })
  })

  describe('setLocalesFilter', function () {
    it('should set values of locales', function () {
      let state = {geographicLevel: {code: 'city', name: 'City'}, localeList: []}
      setLocalesFilter(state, ['mylocale'])
      should(state.localeList[0].code).be.equal('mylocale')
      should(localeFilter(state)[0].name).be.equal('mylocale')
    })
  })

  describe('setDisastersFilter', function () {
    it('should set values of disasters', function () {
      let state = {disasterList: []}
      setDisastersFilter(state, ['mydisaster'])
      should(state.disasterList[0].code).be.equal('mydisaster')
      should(disasterFilter(state)[0].name).be.equal('mydisaster')
    })
  })

  describe('updateReportData', function () {
    it('should set value of summaryRecords to proper value', function () {
      let state = {summaryRecords: null}
      let getters = {selectedSummaryColumns: ['NUMBER_OF_RECORDS', 'TOTAL_DMGE_AMNT']}
      let newSummaryRecord = {NUMBER_OF_RECORDS: 1000, TOTAL_DMGE_AMNT: 9000}
      updateReportData(state, newSummaryRecord)
      should(state.summaryRecords.someField).be.equal(newSummaryRecord.someField)
      should(summaryRecords(state, getters).someOtherField).be.equal(newSummaryRecord.someOtherField)
    })

    it('should set value of summaryRecords to proper formatted value', function () {
      let state = {summaryRecords: null}
      let getters = {selectedSummaryColumns: ['NUMBER_OF_RECORDS', 'TOTAL_DMGE_AMNT']}
      let newSummaryRecord = {NUMBER_OF_RECORDS: 1000, TOTAL_DMGE_AMNT: 2000, HUD_UNMT_NEED_AMNT: 3000}
      updateReportData(state, newSummaryRecord)
      should(summaryRecords(state, getters)['Total FEMA verified real property loss']).be.equal('$2,000.00')
    })
  })

  describe('addDisasterFilter', function () {
    it('Should set the selected attribute of the chosen disaster to true', function () {
      let state = {
        disasterList: [
          {name: 'one'},
          {name: 'two'},
          {name: 'three'}
        ]
      }
      addDisasterFilter(state, state.disasterList[1])
      should(state.disasterList[1]).have.property('selected').which.is.true()
    })
  })

  describe('removeDisasterFilter', function () {
    it('Should set the selected attribute of the chosen disaster to false', function () {
      let state = {
        disasterList: [
          {name: 'one', selected: true},
          {name: 'two', selected: true},
          {name: 'three', selected: true}
        ]
      }
      removeDisasterFilter(state, state.disasterList[1])
      should(state.disasterList[1]).have.property('selected').which.is.false()
    })
  })

  describe('addLocaleFilter', function () {
    it('Should set the selected attribute of the chosen locale to true', function () {
      let state = {
        localeList: [
          {name: 'one'},
          {name: 'two'},
          {name: 'three'}
        ]
      }
      addLocaleFilter(state, state.localeList[1])
      should(state.localeList[1]).have.property('selected').which.is.true()
    })
  })

  describe('removeLocaleFilter', function () {
    it('Should set the selected attribute of the chosen locale to false', function () {
      let state = {
        localeList: [
          {name: 'one', selected: true},
          {name: 'two', selected: true},
          {name: 'three', selected: true}
        ]
      }
      removeLocaleFilter(state, state.localeList[1])
      should(state.localeList[1]).have.property('selected').which.is.false()
    })
  })

  describe('localeFilter', function () {
    it('should only return the selected locales', function () {
      let state = {
        localeList: [
          {name: 'one'},
          {name: 'two', selected: true},
          {name: 'three', selected: true}
        ]
      }
      const selected = localeFilter(state)
      should(selected).be.an.Array().and.have.length(2)
      should(selected).not.containEql(state.localeList[0])
    })
  })

  describe('disasterFilter', function () {
    it('should only return the selected disasters', function () {
      let state = {
        disasterList: [
          {name: 'one'},
          {name: 'two', selected: true},
          {name: 'three', selected: true}
        ]
      }
      const selected = disasterFilter(state)
      should(selected).be.an.Array().and.have.length(2)
      should(selected).not.containEql(state.disasterList[0])
    })
  })

  describe('loadReportData', function () {
    const REPORT_SUMMARY = {numberOfRecords: 200, total_damages: 22000.50, hud_unmet_need: 10000.50}
    const filterParameter = {'states': 'TX', 'cols': 'total_damages,hud_unmet_need'}

    it('should call commit for updateReportData when the data is loaded', function (done) {
      moxios.stubRequest(/applicants/, {
        status: 200,
        response: _.clone(REPORT_SUMMARY)
      })
      const commit = sinon.spy()
      loadReportData({commit}, filterParameter)
      moxios.wait(() => {
        should(commit.calledWith('updateReportData')).be.true()
        should(commit.calledWith('resetStatus')).be.true()
        done()
      })
    })
    it('should set status to "no results found" if result is empty', function (done) {
      moxios.stubRequest(/applicants/, {
        status: 200,
        response: []
      })
      const commit = sinon.spy()
      loadReportData({commit}, filterParameter)
      moxios.wait(() => {
        should(commit.calledWith('updateReportData')).be.true()
        should(commit.calledWith('resetStatus')).be.false()
        should(commit.calledWith('setStatus')).be.true()
        done()
      })
    })
    it('should set status to error if server responds with error for loadReportData', function (done) {
      moxios.stubRequest(/summary/, {
        status: 500
      })
      const commit = sinon.spy()
      loadReportData({commit}, filterParameter)
      moxios.wait(() => {
        should(commit.calledWith('updateLocaleList')).be.false()
        should(commit.calledWith('resetStatus')).be.false()
        should(commit.calledWith('setStatus')).be.true()
        done()
      })
    })
  })
  describe('setSummaryColumn', function () {
    it('should set summaryColumns to proper values', function () {
      const selectedCol = {column: 'col1', name: 'column 1', selected: true}
      const state = {
        summaryColumns: [
          {column: 'col1', name: 'column 1', selected: false},
          {column: 'col1', name: 'column 1', selected: false},
          {column: 'col1', name: 'column 1', selected: false}
        ]
      }
      should(selectedSummaryColumns(state)).be.an.Array().and.have.length(0)
      setSummaryColumn(state, selectedCol)
      const summaryColumnsVal = summaryColumns(state)
      const selectedSummaryColumnsVal = selectedSummaryColumns(state)
      should(summaryColumnsVal).be.an.Array().and.have.length(3)
      should(selectedSummaryColumnsVal).be.an.Array().and.have.length(1)
    })
  })
})
