/* global describe, it, expect, beforeEach */
import 'es6-promise/auto' // eslint-disable-line
import _ from 'lodash'
import moxios from 'moxios' // eslint-disable-line
import { mutations, actions, getters } from '@/reportStore' // eslint-disable-line
import sinon from 'sinon'
import should from 'should'
const { updateReportDisasterList, updateLocaleList, clearStore,
  setState, addDisasterFilter, addLocaleFilter, removeDisasterFilter, removeLocaleFilter,
  setShowReportSpinner, setSelectedGeographicLevel, updateReportData } = mutations
const { loadReportDisasterList, loadLocales, setSelectedState, loadReportData } = actions
const { localeFilter, disasterFilter, showReportSpinner, geographicLevel, stateFilter, summaryRecords, stateUrlParameters } = getters

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

  describe('loadReportDisasterList', function () {
    it('should call commit for updateReportDisasterList when the data is loaded', function (done) {
      moxios.stubRequest(/WI/, {
        status: 200,
        response: _.clone(TWO_RECORDS)
      })
      const commit = sinon.spy()
      loadReportDisasterList({commit}, 'WI')
      moxios.wait(() => {
        should(commit.calledWith('updateReportDisasterList')).be.true()
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
      loadReportDisasterList({commit}, 'WI')
      moxios.wait(() => {
        should(commit.calledWith('updateReportDisasterList')).be.true()
        should(commit.calledWith('resetStatus')).be.false()
        should(commit.calledWith('setStatus')).be.true()
        done()
      })
    })
    it('should set status to error if server responds with error', function (done) {
      moxios.stubRequest(/WI/, {
        status: 500
      })
      const commit = sinon.spy()
      loadReportDisasterList({commit}, 'WI')
      moxios.wait(() => {
        should(commit.calledWith('updateReportDisasterList')).be.false()
        should(commit.calledWith('resetStatus')).be.false()
        should(commit.calledWith('setStatus')).be.true()
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
    it('should set status to error if server responds with error', function (done) {
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
      const expected = [{code: '1234567', name: '34-567'}, {code: '7654321', name: '54-321'}]
      moxios.wait(() => {
        should(commit.calledWith('updateLocaleList', expected)).be.true()
        should(commit.calledWith('resetStatus')).be.true()
        done()
      })
    })
  })

  describe('clearStore', function () {
    it('should reset state to defaults', function () {
      let state = {disasterList: ['one', 'two'], localeList: ['one', 'two'], stateFilter: 'ZZ', geographicLevel: 'TOP'}
      clearStore(state)
      should(state.disasterList).be.an.Array().and.have.length(0)
      should(state.localeList).be.an.Array().and.have.length(0)
      should(state.stateFilter).be.null()
      should(state.geographicLevel).be.null()
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

  describe('setShowReportLoader', function () {
    it('should set value of showReportLoader to true', function () {
      let state = {showReportSpinner: false}
      setShowReportSpinner(state, true)
      should(state.showReportSpinner).be.equal(true)
      should(showReportSpinner(state)).be.equal(true)
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

  describe('updateReportData', function () {
    it('should set value of summaryRecords to proper value', function () {
      let state = {summaryRecords: null}
      let newSummaryRecord = {someField: 1000, someOtherField: 9000}
      updateReportData(state, newSummaryRecord)
      should(state.summaryRecords.someField).be.equal(newSummaryRecord.someField)
      should(summaryRecords(state).someOtherField).be.equal(newSummaryRecord.someOtherField)
    })
  })

  describe('setSelectedState', function () {
    it('should set the selected state', function () {
      const commit = sinon.spy()
      const qry = 'Some query'
      setSelectedState({commit}, qry)
      should(commit.calledWith('clearStore')).be.true()
      should(commit.calledWith('setState', qry)).be.true()
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

  describe('stateUrlParameters', () => {
    it('should return an empty string if stateFilter doesn\'t exist', () => {
      let state = {}
      let result = stateUrlParameters(state, {})
      should(result).equal('')
    })
    it('should add geographicLevel to the querystring if geographicLevel exist\'s', () => {
      let state = {
        stateFilter: {
          code: 'TX'
        }
      }
      let getters = {
        geographicLevel: {
          code: 'City'
        },
        localeFilter: [],
        disasterFilter: []
      }
      let result = stateUrlParameters(state, getters)
      should(result).equal('?stateFilter=TX&geographicLevel=City')
    })
    it('should add localeFilter to the querystring if is at least one localeFilter', () => {
      let state = {
        stateFilter: {
          code: 'TX'
        }
      }
      let getters = {
        geographicLevel: {
          code: 'City'
        },
        localeFilter: [{code: 'Far Far'}, {code: 'Away'}],
        disasterFilter: []
      }
      let result = stateUrlParameters(state, getters)
      should(result).equal('?stateFilter=TX&geographicLevel=City&localeFilter=Far Far,Away')
    })
    it('should add disasterFilter to the querystring if is at least one disasterFilter', () => {
      let state = {
        stateFilter: {
          code: 'TX'
        }
      }
      let getters = {
        geographicLevel: {
          code: 'City'
        },
        localeFilter: [{code: 'Far Far'}, {code: 'Away'}],
        disasterFilter: [{code: '1234'}, {code: '5678'}]
      }
      let result = stateUrlParameters(state, getters)
      should(result).equal('?stateFilter=TX&geographicLevel=City&localeFilter=Far Far,Away&disasterFilter=1234,5678')
    })
  })

  describe('loadReportData', function () {
    const REPORT_SUMMARY = {numberOfRecords: 200, total_damages: 22000.50, hud_unmet_need: 10000.50}
    const filterParameter = {'summaryCols': 'total_damages,hud_unmet_need', 'allFilters': {'stateId': 'TX'}}

    it('should call commit for updateReportData when the data is loaded', function (done) {
      moxios.stubRequest(/db/, {
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
      moxios.stubRequest(/db/, {
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
    it('should set status to error if server responds with error', function (done) {
      moxios.stubRequest(/TX/, {
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
})
