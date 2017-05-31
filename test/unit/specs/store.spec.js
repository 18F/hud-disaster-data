/* global describe, it, expect */
import 'es6-promise/auto' // eslint-disable-line
import _ from 'lodash'
import axios from 'axios' // eslint-disable-line
import moxios from 'moxios' // eslint-disable-line
import { mutations, actions } from '../../../src/store' // eslint-disable-line
const { toggleCurrentExtract, clearCurrentExtract, updateDisasterList, saveExtract,
        loadExtract, deleteExtract } = mutations
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
      updateDisasterList(state, { list: TWO_RECORDS })
      expect(_.map(state.disasters, disaster => _.pick(disaster, 'currentExtract')).length).to.be.equal(2)
    })
  })

  describe('loadDisasterList', function () {
    it('should call commit when the data is loaded', function (done) {
      moxios.install()
      moxios.stubRequest(/DR/, {
        status: 200,
        response: _.clone(TWO_RECORDS)
      })
      let commit = function (name, data) {
        expect(name).to.be.equal('updateDisasterList')
        expect(data).to.have.property('list').that.is.an('array')
        done()
      }
      loadDisasterList({ commit }, 'DR')
    })
  })

  describe('Saving Retrieving and Deleting Extracts', function () {
    let disasters = _.map(TWO_RECORDS, (disaster) => {
      disaster.currentExtract = true
      return disaster
    })
    let state = { savedExtracts: [], currentExtract: disasters }
    saveExtract(state, 'TESTSavedExtract')

    it('should save currentExtract to localStorage', function (done) {
      const localSavedExtracts = JSON.parse(localStorage.getItem('saved-extracts'))
      expect(localSavedExtracts.length).to.be.above(0)
      const mySavedExtract = _.map(localSavedExtracts, (extract) => {
        if (extract.name === 'TESTSavedExtract') return extract.disasters
      })
      expect(mySavedExtract[0].length).to.be.equal(2)
      done()
    })

    it('should save currentExtract to savedExtracts', function (done) {
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
      state.status = 'normal'
      saveExtract(state, 'TESTSavedExtract')
      expect(state.savedExtracts.length).to.be.equal(1)
      expect(state.status.type).to.be.equal('error')
      done()
    })

    it('should load saved extract to currentExtract from localStorage', function (done) {
      loadExtract(state, 'TESTSavedExtract')
      expect(state.savedExtracts.length).to.be.above(0)
      expect(state.currentExtract.length).to.be.equal(2)
      done()
    })

    it('should delete saved extract from savedExtracts', function (done) {
      expect(state.savedExtracts.length).to.be.above(0)
      deleteExtract(state, 'TESTSavedExtract')
      expect(state.savedExtracts.length).to.be.equal(0)
      done()
    })

    it('should have also deleted saved extract from localStorage', function (done) {
      const localSavedExtracts = JSON.parse(localStorage.getItem('saved-extracts'))

      const mySavedExtract = _.map(localSavedExtracts, (extract) => {
        if (extract.name === 'TESTSavedExtract') return extract.disasters
      })
      expect(mySavedExtract.length).to.be.equal(0)
      done()
    })
  })

  describe('Saving Retrieving and Deleting Extracts', function () {
    let disasters = _.map(TWO_RECORDS, (disaster) => {
      disaster.currentExtract = true
      return disaster
    })
    let state = { savedExtracts: [], currentExtract: disasters }
    saveExtract(state, 'TESTSavedExtract')

    it('should save currentExtract to localStorage', function (done) {
      const localSavedExtracts = JSON.parse(localStorage.getItem('saved-extracts'))
      expect(localSavedExtracts.length).to.be.above(0)
      const mySavedExtract = _.map(localSavedExtracts, (extract) => {
        if (extract.name === 'TESTSavedExtract') return extract.disasters
      })
      expect(mySavedExtract[0].length).to.be.equal(2)
      done()
    })
  })
})
