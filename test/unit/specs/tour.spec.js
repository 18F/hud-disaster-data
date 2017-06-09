import tour from '@/tour'
import sinon from 'sinon'
import store from '@/store'
import _ from 'lodash'

const ONE_RECORD = [
  {
    disasterNumber: 4311,
    state: 'UT',
    declarationDate: 'April 21, 2017',
    disasterType: 'DR',
    incidentType: 'Flood',
    title: 'SEVERE WINTER STORMS AND FLOODING',
    declaredCountyArea: [ 'Box Elder (County)', 'Cache (County)' ],
    placeCode: 99003,
    id: '58fa2e008a4f31363dac2c6a'
  } ]

describe('enter-search', () => {
  describe('show', () => {
    it('should give focus to #search-text and select it\'s contents', () => {
      let focus = sinon.stub()
      let select = sinon.stub()
      let stub = sinon.stub(document, 'getElementById').callsFake(() => { return {focus, select} })
      let disasterSearchTour = tour.tours.disasterSearchTour.getById('enter-search')
      disasterSearchTour.options.when.show()
      expect(focus.called).to.equal(true)
      expect(select.called).to.equal(true)
      stub.restore()
    })
  })
  describe('Next button action', () => {
    it('should cancel the disasterSearchTour and start the appErrorTour if the status scope is app', () => {
      store.commit('setStatus', {type: 'info', msg: 'bla bla'})
      let disasterSearchTour = tour.tours.disasterSearchTour
      let appErrorTour = tour.tours.appErrorTour
      let action = _.find(disasterSearchTour.getById('enter-search').options.buttons, { text: 'Next' }).action
      let cancelStub = sinon.stub(disasterSearchTour, 'cancel')
      let startStub = sinon.stub(appErrorTour, 'start')
      action()
      expect(cancelStub.called).to.equal(true)
      expect(startStub.called).to.equal(true)
      cancelStub.restore()
      startStub.restore()
      store.commit('resetStatus')
    })
    it('should go to next step in the disasterSearchTour if the search returned at least one record', () => {
      store.commit('updateDisasterList', {list: ONE_RECORD})
      let disasterSearchTour = tour.tours.disasterSearchTour
      let action = _.find(disasterSearchTour.getById('enter-search').options.buttons, { text: 'Next' }).action
      let nextStub = sinon.stub(disasterSearchTour, 'next')
      action()
      expect(nextStub.called).to.equal(true)
      nextStub.restore()
    })
  })
})

describe('select-disasters', () => {
  describe('Next button action', () => {
    it('should cancel the disasterSearchTour and start the appErrorTour if there are no selected disasters', () => {
      store.commit('updateDisasterList', {list: ONE_RECORD})
      let disasterSearchTour = tour.tours.disasterSearchTour
      let appErrorTour = tour.tours.appErrorTour
      let action = _.find(disasterSearchTour.getById('select-disasters').options.buttons, { text: 'Next' }).action
      let cancelStub = sinon.stub(disasterSearchTour, 'cancel')
      let showStub = sinon.stub(appErrorTour, 'show')
      action()
      expect(cancelStub.called).to.equal(true)
      expect(showStub.called).to.equal(true)
      cancelStub.restore()
      showStub.restore()
    })
    it('should go to next step in the disasterSearchTour if the selected disasters are one or more', () => {
      store.commit('updateDisasterList', {list: ONE_RECORD})
      store.commit('toggleCurrentExtract', ONE_RECORD)
      let disasterSearchTour = tour.tours.disasterSearchTour
      let action = _.find(disasterSearchTour.getById('select-disasters').options.buttons, { text: 'Next' }).action
      let nextStub = sinon.stub(disasterSearchTour, 'next')
      action()
      expect(nextStub.called).to.equal(true)
      nextStub.restore()
    })
  })
})

describe('show-error', () => {
  describe('Customized Back button action', () => {
    it('should cancel the appErrorTour and start the disasterSearchTour when clicked', () => {
      let disasterSearchTour = tour.tours.disasterSearchTour
      let appErrorTour = tour.tours.appErrorTour
      let action = _.find(appErrorTour.getById('show-error').options.buttons, { text: 'Back' }).action
      let cancelStub = sinon.stub(appErrorTour, 'cancel')
      let startStub = sinon.stub(disasterSearchTour, 'start')
      action()
      expect(cancelStub.called).to.equal(true)
      expect(startStub.called).to.equal(true)
      cancelStub.restore()
      startStub.restore()
    })
  })
})

describe('show-non-selected-error', () => {
  describe('Customized Try Again button action', () => {
    it('should cancel the appErrorTour and go back to the disasterSearchTour when clicked', () => {
      let disasterSearchTour = tour.tours.disasterSearchTour
      let appErrorTour = tour.tours.appErrorTour
      let action = _.find(appErrorTour.getById('show-non-selected-error').options.buttons, { text: 'Try Again' }).action
      let cancelStub = sinon.stub(appErrorTour, 'cancel')
      let showStub = sinon.stub(disasterSearchTour, 'show')
      action()
      expect(cancelStub.called).to.equal(true)
      expect(showStub.called).to.equal(true)
      cancelStub.restore()
      showStub.restore()
    })
  })
})
