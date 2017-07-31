/* global describe, it, expect, beforeEach */
import 'es6-promise/auto' // eslint-disable-line
import _ from 'lodash'
import moxios from 'moxios' // eslint-disable-line
import { mutations, actions, getters } from '../../../src/reportStore' // eslint-disable-line
import sinon from 'sinon'
import should from 'should'
const { updateDisasterList, updateLocaleList } = mutations
// const { updateDisasterList, updateLocaleList, clearState } = mutations
const { loadDisasterList, loadLocales } = actions

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
  describe('updateDisasterList', function () {
    it('should set disaster', function () {
      let state = { disasterList: [] }
      let disasterNumberResults = getters.disasterNumberResults
      updateDisasterList(state, TWO_RECORDS)
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

  describe('loadDisasterList', function () {
    it('should call commit for updateDisasterList when the data is loaded', function (done) {
      moxios.install()
      moxios.stubRequest(/WI/, {
        status: 200,
        response: _.clone(TWO_RECORDS)
      })
      const commit = sinon.spy()
      loadDisasterList({commit}, 'WI')
      moxios.wait(() => {
        should(commit.calledWith('updateDisasterList')).be.true()
        should(commit.calledWith('resetStatus')).be.true()
        done()
      })
    })
  })

  describe('loadLocales', function () {
    it('should call commit for updateLocaleList when the data is loaded', function (done) {
      moxios.install()
      moxios.stubRequest(/TX/, {
        status: 200,
        response: _.clone(TWO_LOCALES)
      })
      const commit = sinon.spy()
      const state = {geographicLevel: {code: 'City', name: 'City'}}
      loadLocales({commit, state}, 'TX')
      moxios.wait(() => {
        should(commit.calledWith('updateLocaleList')).be.true()
        should(commit.calledWith('resetStatus')).be.true()
        done()
      })
    })

    // it('should setStatus to No results found if data returned is empty', function (done) {
    //   moxios.install()
    //   moxios.stubRequest(/TZ/, {
    //     status: 200,
    //     response: []
    //   })
    //   let updateLocaleListCalled
    //   let setSearchLoadingCalled
    //   let setStatusCalled
    //   var commitStub = sinon.stub().callsFake((name, data) => {
    //     if (name === 'updateLocaleList') updateLocaleListCalled = true
    //     if (name === 'setSearchLoading') setSearchLoadingCalled = true
    //     if (name === 'setStatus') {
    //       should(data).be.an.Object().and.have.properties({msg: 'No results found!'})
    //       setStatusCalled = true
    //     }
    //   })
    //   loadLocales({ commit: commitStub }, 'TZ')
    //   moxios.wait(() => {
    //     expect(updateLocaleListCalled).to.be.equal(true)
    //     expect(setSearchLoadingCalled).to.be.equal(true)
    //     expect(setStatusCalled).to.be.equal(true)
    //     done()
    //   })
    // })
  })

  // describe('clearState', function () {
  //   it('should set state.disasterNumbers and state.localeList to empty arrays', function () {
  //     let state = {}
  //     clearState(state)
  //     should(state.disasterNumbers).be.an.Array().and.have.length(0)
  //     should(state.localeList).be.an.Array().and.have.length(0)
  //   })
  // })
})
