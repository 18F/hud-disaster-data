/* global describe, it, expect, beforeEach */
import 'es6-promise/auto' // eslint-disable-line
import _ from 'lodash'
import axios from 'axios' // eslint-disable-line
import moxios from 'moxios' // eslint-disable-line
import { mutations, actions, getters } from '../../../src/reportStore' // eslint-disable-line
import sinon from 'sinon'
const { updateDisasterNumberList, updateLocaleList } = mutations
const { loadDisasterNumbers, loadLocales } = actions

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

const TWO_LOCALES = ['Morley', 'Anamosa']

describe('reportStore', function () {
  describe('updateDisasterNumberList', function () {
    it('should set disasterNumbers', function () {
      let state = { disasterNumbers: [] }
      let disasterNumberResults = getters.disasterNumberResults
      updateDisasterNumberList(state, TWO_RECORDS)
      expect(state.disasterNumbers.length).to.be.equal(2)
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

  describe('loadDisasterNumbers', function () {
    it('should call commit for setSearchLoading and updateDisasterNumberList when the data is loaded', function (done) {
      moxios.install()
      moxios.stubRequest(/WI/, {
        status: 200,
        response: _.clone(TWO_RECORDS)
      })
      let updateDisasterNumberListCalled
      let resetStatus
      var commitStub = sinon.stub().callsFake((name, data) => {
        if (name === 'updateDisasterNumberList' && data) {
          expect(data).to.be.an('array')
          updateDisasterNumberListCalled = true
        }
        if (name === 'resetStatus') resetStatus = true
      })
      loadDisasterNumbers({ commit: commitStub }, 'WI')
      moxios.wait(() => {
        expect(updateDisasterNumberListCalled).to.be.equal(true)
        expect(resetStatus).to.be.equal(true)
        done()
      })
    })
  })

  describe('loadLocales', function () {
    it('should call commit for setSearchLoading and updateDisasterNumberList when the data is loaded', function (done) {
      moxios.install()
      moxios.stubRequest(/TX/, {
        status: 200,
        response: _.clone(TWO_LOCALES)
      })
      let updateLocaleListCalled
      let setSearchLoadingCalled
      var commitStub = sinon.stub().callsFake((name, data) => {
        if (name === 'updateLocaleList') updateLocaleListCalled = true
        if (name === 'setSearchLoading') setSearchLoadingCalled = true
      })
      debugger
      loadLocales({ commit: commitStub }, 'TX')
      moxios.wait(() => {
        expect(updateLocaleListCalled).to.be.equal(true)
        expect(setSearchLoadingCalled).to.be.equal(true)
        done()
      })
    })
  })
})
