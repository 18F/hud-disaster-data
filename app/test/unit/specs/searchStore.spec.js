/* global describe, it, expect, beforeEach */
import 'es6-promise/auto' // eslint-disable-line
import _ from 'lodash'
import axios from 'axios' // eslint-disable-line
import moxios from 'moxios' // eslint-disable-line
import { mutations, actions } from '../../../src/searchStore' // eslint-disable-line
import sinon from 'sinon'
const { toggleCurrentExtract, clearCurrentExtract, updateDisasterList, saveExtract,
        loadExtract, deleteExtract, resetStatus, setStatus, setSearchLoading } = mutations
const { loadDisasterList } = actions

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

describe('store', function () {
  describe('toggleCurrentExtract', function () {
    it('should remove a disaster from the currentExtract list if disasterInCurrentExtract is true', function () {
      let state = { currentExtract: _.clone(TWO_RECORDS) }
      state.currentExtract[0].currentExtract = true
      toggleCurrentExtract(state, state.currentExtract[0])
      expect(state.currentExtract.length).to.be.equal(1)
    })
  })

  describe('toggleCurrentExtract', function () {
    it('should add a disaster to the currentExtract list', function () {
      let disasters = _.map(TWO_RECORDS, (disaster) => {
        delete disaster.currentExtract
        return disaster
      })
      let state = { disasters, currentExtract: [] }

      toggleCurrentExtract(state, state.disasters[0])
      expect(state.currentExtract.length).to.be.equal(1)
    })
  })

  describe('clearCurrentExtract', function () {
    it('should clear the currentExtract list if clear button is pushed', function () {
      let currentExtract = _.clone(TWO_RECORDS)
      let disasters = _.clone(TWO_RECORDS)
      let state = {currentExtract, disasters}
      state.currentExtract[0].currentExtract = true
      state.currentExtract[1].currentExtract = true
      expect(_.find(state.disasters, 'currentExtract')).to.be.equal(disasters[0])
      clearCurrentExtract(state)
      expect(_.find(state.disasters, 'currentExtract')).to.be.undefined
      expect(state.currentExtract.length).to.be.equal(0)
    })
  })

  describe('updateDisasterList', function () {
    it('should set currentExtract to true for disasters already in currentExtract', function () {
      let state = { currentExtract: _.clone(TWO_RECORDS) }
      state.currentExtract[0].currentExtract = true
      state.currentExtract[1].currentExtract = true
      updateDisasterList(state, TWO_RECORDS)
      expect(_.map(state.disasters, disaster => _.pick(disaster, 'currentExtract')).length).to.be.equal(2)
    })
  })

  describe('loadDisasterList', function () {
    it('should call commit for setSearchLoading and updateDisasterList when the data is loaded', function (done) {
      moxios.install()
      moxios.stubRequest(/DR/, {
        status: 200,
        response: _.clone(TWO_RECORDS)
      })
      let updateDisasterList
      let resetStatus
      var commitStub = sinon.stub().callsFake((name, data) => {
        if (name === 'updateDisasterList' && data) {
          expect(data).to.be.an('array')
          updateDisasterList = true
        }
        if (name === 'resetStatus') resetStatus = true
      })

      loadDisasterList({ commit: commitStub }, {qry: 'DR', user: {type: 'HUD', disasterids: []}})
      moxios.wait(() => {
        expect(updateDisasterList).to.be.equal(true)
        expect(resetStatus).to.be.equal(true)
        done()
      })
    })

    it('setSearchLoading should set the status of state.searchLoading', function (done) {
      let status = 'my status'
      let state = {searchLoading: null}
      setSearchLoading(state, status)
      expect(state.searchLoading).to.be.equal(status)
      done()
    })

    it('when loading the data, if a non JSON result is returned, set error status and proper message', function (done) {
      moxios.uninstall()
      moxios.install()
      moxios.wait(function () {
        let request = moxios.requests.mostRecent()
        request.respondWith({
          status: 404,
          response: '<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"></html>'
        })
      })

      let commit = function (name, data) {
        if (name === 'setStatus') {
          expect(data).to.have.property('type').that.is.equal('error')
          expect(data).to.have.property('msg').that.is.equal('HUD disaster data is unavailable at this time.  Try again later or contact your administrator.')
          done()
        }
      }
      loadDisasterList({ commit }, {qry: 'DR', user: {type: 'HUD', disasterids: []}})
    })
    it('when loading the data, if no data is returned, set info status and proper message', function (done) {
      moxios.uninstall()
      moxios.install()
      moxios.wait(function () {
        let request = moxios.requests.mostRecent()
        request.respondWith({
          status: 200,
          response: []
        })
      })

      let commit = function (name, data) {
        if (name === 'setStatus') {
          expect(data).to.have.property('type').that.is.equal('info')
          expect(data).to.have.property('msg').that.is.equal('No results found!')
          done()
        }
      }
      loadDisasterList({ commit }, {qry: 'DR', user: {type: 'HUD', disasterids: []}})
    })
  })

  describe('Saving Retrieving and Deleting Extracts', function () {
    let disasters = _.map(TWO_RECORDS, (disaster) => {
      disaster.currentExtract = true
      return disaster
    })
    let state = {}

    beforeEach(function () {
      state = { savedExtracts: [], currentExtract: disasters }
      localStorage.clear('saved-extracts')
    })

    it('should save currentExtract to localStorage and to savedExtracts', function (done) {
      saveExtract(state, 'TESTSavedExtract')
      const localSavedExtracts = JSON.parse(localStorage.getItem('saved-extracts'))
      expect(localSavedExtracts.length).to.be.above(0)
      const mySavedExtract = _.map(localSavedExtracts, (extract) => {
        if (extract.name === 'TESTSavedExtract') return extract.disasters
      })
      expect(mySavedExtract[0].length).to.be.equal(2)
      expect(state.savedExtracts.length).to.be.equal(1)
      done()
    })

    it('should get an error if trying to save currentExtract using an empty name', function (done) {
      state.status = 'normal'
      saveExtract(state, '')
      expect(state.status.type).to.be.equal('error')
      done()
    })

    it('should get failure code when saving if search by that name already exists, and not add it to savedExtracts', function (done) {
      saveExtract(state, 'TESTSavedExtract')
      state.status = 'normal'
      saveExtract(state, 'TESTSavedExtract')
      expect(state.savedExtracts.length).to.be.equal(1)
      expect(state.status.type).to.be.equal('error')
      done()
    })

    it('should load saved extract to currentExtract from API endpoint', function (done) {
      moxios.install()
      moxios.wait(function () {
        let request = moxios.requests.mostRecent()
        request.respondWith({
          status: 200,
          response: _.clone(TWO_RECORDS)
        }).then(function () {
          expect(state.savedExtracts.length).to.be.above(0)
          expect(state.currentExtract.length).to.be.equal(2)
          done()
        })
      })
      localStorage.clear('saved-extracts')
      saveExtract(state, 'TESTSavedExtract')
      loadExtract(state, 'TESTSavedExtract')
    })

    it('loadExtract should return false if no name passed in', function (done) {
      let returnCode = true
      returnCode = loadExtract('bogus state', {name: null, user: 'bogus user'})
      expect(returnCode).to.be.equal(false)
      done()
    })

    it('loadExtract should return false if user.type not HUD or Grantee', function (done) {
      let returnCode = true
      returnCode = loadExtract('bogus state', {name: 'bogus name', user: {type: 'bogus user type'}})
      expect(returnCode).to.be.equal(false)
      done()
    })

    it('loadExtract should return undefined if there are no loaded disasters that are withing the allowed disasters for a user', function (done) {
      moxios.install()
      moxios.wait(function () {
        let request = moxios.requests.mostRecent()
        request.respondWith({
          status: 200,
          response: _.clone(TWO_RECORDS)
        })
      })
      localStorage.clear('saved-extracts')
      saveExtract(state, 'TESTSavedExtract')
      let returnCode = true
      returnCode = loadExtract(state, {name: 'TESTSavedExtract', user: {type: 'Grantee', disasterids: [0]}})
      expect(returnCode).to.be.equal(undefined)
      done()
    })

    it('loadExtract should return disasters if user data does not preclude it', function (done) {
      moxios.install()
      moxios.wait(function () {
        let request = moxios.requests.mostRecent()
        request.respondWith({
          status: 200,
          response: _.clone(TWO_RECORDS)
        }).then(function () {
          expect(state.savedExtracts.length).to.be.above(0)
          expect(state.currentExtract.length).to.be.equal(2)
          expect(state.newExtract).to.be.equal(false)
          done()
        })
      })
      state = { savedExtracts: [], currentExtract: disasters }
      localStorage.clear('saved-extracts')
      saveExtract(state, 'TESTSavedExtract')
      loadExtract(state, {name: 'TESTSavedExtract', user: {type: 'Grantee', disasterids: [4281]}})
    })

    it('should delete saved extract from savedExtracts', function (done) {
      saveExtract(state, 'TESTSavedExtract')
      expect(state.savedExtracts.length).to.be.above(0)
      deleteExtract(state, 'TESTSavedExtract')
      expect(state.savedExtracts.length).to.be.equal(0)
      done()
    })

    it('should have also deleted saved extract from localStorage', function (done) {
      saveExtract(state, 'TESTSavedExtract')
      expect(state.savedExtracts.length).to.be.above(0)
      deleteExtract(state, 'TESTSavedExtract')
      const localSavedExtracts = JSON.parse(localStorage.getItem('saved-extracts'))

      const mySavedExtract = _.map(localSavedExtracts, (extract) => {
        if (extract.name === 'TESTSavedExtract') return extract.disasters
      })
      expect(mySavedExtract.length).to.be.equal(0)
      done()
    })
  })

  describe('resetStatus', function () {
    it('should reset status', function () {
      let state = {status: { type: 'error', message: 'Testing error message' }}
      resetStatus(state)
      expect(state.status.type).to.be.equal('normal')
    })
  })

  describe('setStatus', function () {
    it('should set the status type of status and message', function () {
      let state = {status: { type: 'normal', message: '' }}
      let msg = 'Testing Error Message'
      setStatus(state, {type: 'info', msg})
      expect(state.status.type).to.be.equal('info')
      expect(state.status.message).to.be.equal(msg)
    })
  })
})
