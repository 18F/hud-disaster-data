import tour from '@/tour'
import sinon from 'sinon'
import Vuex from 'vuex'
import _ from 'lodash'

describe('tour', () => {
  let store
  let mutations
  let getters
  let step
  let showErrorStub
  let showMessageStub
  let hideStub
  let showStub
  let currentStepStub

  beforeEach(function () {
    getters = {
      defaultExtractName: function () { return '' },
      currentExtract: function () { return [] },
      savedExtracts: function () { return [] },
      newExtract: function () { return false },
      currentSearchResult: function () { return [] },
      status: function () { return { type: 'error', message: '' } }
    }
    mutations = {
      clearCurrentExtract: sinon.stub(),
      resetStatus: sinon.stub(),
      loadExtract: sinon.stub(),
      saveExtract: sinon.stub(),
      deleteExtract: sinon.stub()
    }

    store = new Vuex.Store({state: {}, mutations, getters})
    tour.setStore(store)

    showErrorStub = sinon.stub(tour, 'showError')
    showMessageStub = sinon.stub(tour, 'showMessage')
    hideStub = sinon.stub()
    showStub = sinon.stub()
    step = {
      hide: hideStub,
      show: showStub
    }
    currentStepStub = sinon.stub(tour.tour, 'getCurrentStep').callsFake(() => step)
  })

  afterEach(function () {
    showErrorStub.restore()
    showMessageStub.restore()
    currentStepStub.restore()
  })

  describe('enter-search', () => {
    describe('show', () => {
      it('should give focus to #search-text and select it\'s contents', () => {
        let focus = sinon.stub()
        let select = sinon.stub()
        let stub = sinon.stub(document, 'getElementById').callsFake(() => { return {focus, select} })
        let step = tour.tour.getById('enter-search')
        step.options.when.show()
        expect(showMessageStub.called).to.equal(true)
        expect(focus.called).to.equal(true)
        expect(select.called).to.equal(true)
        stub.restore()
      })
      it('should set error to false and return if error is true', () => {
        let step = tour.tour.getById('enter-search')
        step.error = true
        step.options.when.show.apply(step)
        expect(step.error).to.equal(false)
      })
    })
    describe('Next button action', () => {
      it('should show the error message if there are 0 disasters in the current search result', () => {
        let disasterSearchTour = tour.tour
        let action = _.find(disasterSearchTour.getById('enter-search').options.buttons, { text: 'Next' }).action
        action()
        expect(hideStub.called).to.equal(true)
        expect(showStub.called).to.equal(true)
        expect(step.error).to.equal(true)
        expect(showErrorStub.called).to.equal(true)
        expect(showMessageStub.called).to.equal(false)
      })
      it('should go to next step in the disasterSearchTour if the search returned at least one record', () => {
        getters.currentSearchResult = function () { return [1] }
        store = new Vuex.Store({state: {}, mutations, getters})
        tour.setStore(store)
        let disasterSearchTour = tour.tour
        let action = _.find(disasterSearchTour.getById('enter-search').options.buttons, { text: 'Next' }).action
        let nextStub = sinon.stub(disasterSearchTour, 'next')
        action()
        expect(nextStub.called).to.equal(true)
        nextStub.restore()
      })
    })
  })

  describe('select-disasters', () => {
    describe('show', () => {
      it('should show the step message if error is false', () => {
        let step = tour.tour.getById('select-disasters')
        step.options.when.show()
        expect(showMessageStub.called).to.equal(true)
      })
      it('should set error to false and return if error is true', () => {
        let step = tour.tour.getById('select-disasters')
        step.error = true
        step.options.when.show.apply(step)
        expect(step.error).to.equal(false)
      })
    })
    describe('Next button action', () => {
      it('should show the error message if there are 0 disasters in the current extract', () => {
        let disasterSearchTour = tour.tour
        let action = _.find(disasterSearchTour.getById('select-disasters').options.buttons, { text: 'Next' }).action
        action()
        expect(hideStub.called).to.equal(true)
        expect(showStub.called).to.equal(true)
        expect(step.error).to.equal(true)
        expect(showErrorStub.called).to.equal(true)
        expect(showMessageStub.called).to.equal(false)
      })
      it('should go to next step in the disasterSearchTour if the current extract has at least one record', () => {
        getters.currentExtract = function () { return [1] }
        store = new Vuex.Store({state: {}, mutations, getters})
        tour.setStore(store)
        let disasterSearchTour = tour.tour
        let action = _.find(disasterSearchTour.getById('select-disasters').options.buttons, { text: 'Next' }).action
        let nextStub = sinon.stub(disasterSearchTour, 'next')
        action()
        expect(nextStub.called).to.equal(true)
        nextStub.restore()
      })
    })
  })
})
