/* global Event, describe, it, expect, sinon */
import 'es6-promise/auto' // eslint-disable-line
import _ from 'lodash'
import { mutations } from '../../../src/store' // eslint-disable-line
const { toggleCurrentExtract } = mutations
const { clearCurrentExtract } = mutations
const { updateDisasterList } = mutations

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

  describe('clearCurrentExtract', function () {
    it('should clear the currentExtract list if clear button is pushed', function () {
      let state = { currentExtract: _.clone(TWO_RECORDS) }
      state.currentExtract[0].currentExtract = true
      state.currentExtract[1].currentExtract = true
      clearCurrentExtract(state)
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
})
