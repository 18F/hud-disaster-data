import tour from '@/tour'
import sinon from 'sinon'
import Vuex from 'vuex'
import _ from 'lodash'
import magic from '@/bus'

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
  let emitSpy
  let querySelectorAll

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
      deleteExtract: sinon.stub(),
      clearSearch: sinon.stub()
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
    emitSpy = sinon.stub(magic, '$emit')
    querySelectorAll = sinon.stub(document, 'querySelectorAll').callsFake(() => [])
  })

  afterEach(function () {
    showErrorStub.restore()
    showMessageStub.restore()
    currentStepStub.restore()
    emitSpy.restore()
    querySelectorAll.restore()
  })

  describe('before start', () => {
    it('our default next and back buttons should show the appropriate message and then call next or back, respectively', () => {
      let back = tour.back
      let next = tour.next
      let disasterSearchTour = tour.tour
      let backStub = sinon.stub(disasterSearchTour, 'back')
      let nextStub = sinon.stub(disasterSearchTour, 'next')
      disasterSearchTour.addStep('my-step', {title: 'my test step', buttons: [tour.back, tour.next]})
      disasterSearchTour.show('my-step')
      back.action()
      next.action()
      expect(showMessageStub.called).to.equal(true)
      expect(nextStub.called).to.equal(true)
      expect(backStub.called).to.equal(true)
      nextStub.restore()
      backStub.restore()
      disasterSearchTour.hide() // needed for next test (should start the tour)
    })
    describe('default show', () => {
      it('should set the cancel link textContent, innerHTML, and tabIndex', () => {
        let disasterSearchTour = tour.tour
        let addEventListenerStub = sinon.stub()
        let setAttributeStub = sinon.stub()
        let fakeElement = {
          textContent: 'something',
          innerHTML: 'something else',
          tabIndex: 999,
          addEventListener: addEventListenerStub,
          setAttribute: setAttributeStub
        }
        let show = disasterSearchTour.options.defaults.when.show
        querySelectorAll.restore()
        let querySelectorAllStub = sinon.stub(document, 'querySelectorAll').callsFake((el) => {
          return [fakeElement]
        })
        let restoreTabIndexStub = sinon.stub({}, 'restoreTabIndex')
        show()
        expect(fakeElement.textContent).to.equal('')
        expect(fakeElement.innerHTML).to.equal('<svg class="hdd-icon"><use xlink:href="#fa-times"></use></svg>')
        expect(fakeElement.tabIndex).to.equal(0)
        querySelectorAllStub.restore()
        restoreTabIndexStub.restore()
      })
    })
  })

  describe('start', () => {
    it('should start the tour', () => {
      let stub = sinon.stub(tour.tour, 'start')
      tour.start()
      expect(stub.called).to.equal(true)
      stub.restore()
    })
    it('should not start the tour if one is already started', () => {
      let shepherd = require('tether-shepherd')
      shepherd.activeTour = true
      let stub = sinon.stub(tour.tour, 'start')
      tour.start()
      expect(stub.called).to.equal(false)
      stub.restore()
    })
  })
  describe('showError', () => {
    it('should hide the message and show the error', () => {
      let elements = {
        '.tour-message': [{style: {}}],
        '.tour-error': [{style: {}}]
      }
      querySelectorAll.restore()
      let stub = sinon.stub(document, 'querySelectorAll').callsFake(selector => elements[selector])
      showErrorStub.restore()
      tour.showError()
      expect(elements['.tour-message'][0].style.display).to.equal('none')
      expect(elements['.tour-error'][0].style.display).to.equal('block')
      stub.restore()
    })
  })
  describe('showMessage', () => {
    it('should hide the error and show the message', () => {
      let elements = {
        '.tour-message': [{style: {}}],
        '.tour-error': [{style: {}}]
      }
      querySelectorAll.restore()
      let stub = sinon.stub(document, 'querySelectorAll').callsFake(selector => elements[selector])
      showMessageStub.restore()
      tour.showMessage()
      expect(elements['.tour-message'][0].style.display).to.equal('block')
      expect(elements['.tour-error'][0].style.display).to.equal('none')
      stub.restore()
    })
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
        let focus = sinon.stub()
        let select = sinon.stub()
        let stub = sinon.stub(document, 'getElementById').callsFake(() => { return {focus, select} })
        action()
        expect(hideStub.called).to.equal(true)
        expect(showStub.called).to.equal(true)
        expect(step.error).to.equal(true)
        expect(showErrorStub.called).to.equal(true)
        expect(showMessageStub.called).to.equal(false)
        stub.restore()
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

  describe('selected-export-data', () => {
    describe('before-show', () => {
      it('should set the z-index to 1 for list', () => {
        getters.currentSearchResult = function () { return [1] }
        store = new Vuex.Store({state: {}, mutations, getters})
        tour.setStore(store)
        let disasterSearchTour = tour.tour
        let element
        let fakeElement = {style: {'z-index': -100}}
        let beforeShow = disasterSearchTour.getById('selected-export-data').options.when['before-show']
        let getElementByIdStub = sinon.stub(document, 'getElementById').callsFake((el) => {
          element = el
          return fakeElement
        })
        beforeShow()
        expect(element).to.equal('list')
        expect(fakeElement.style['z-index']).to.equal('1')
        getElementByIdStub.restore()
      })
    })
  })

  describe('export-data', () => {
    describe('Back button action', () => {
      it('should go back if there are search results', () => {
        getters.currentSearchResult = function () { return [1] }
        store = new Vuex.Store({state: {}, mutations, getters})
        tour.setStore(store)
        let disasterSearchTour = tour.tour
        let action = _.find(disasterSearchTour.getById('export-data').options.buttons, { text: 'Back' }).action
        let backStub = sinon.stub(disasterSearchTour, 'back')
        action()
        expect(backStub.called).to.equal(true)
        backStub.restore()
      })
      it('should start over if there are no search results', () => {
        let disasterSearchTour = tour.tour
        let action = _.find(disasterSearchTour.getById('export-data').options.buttons, { text: 'Back' }).action
        let hideStub = sinon.stub(disasterSearchTour, 'hide')
        let startStub = sinon.stub(disasterSearchTour, 'start')
        action()
        expect(hideStub.called).to.equal(true)
        hideStub.restore()
        expect(startStub.called).to.equal(true)
        startStub.restore()
      })
    })
  })

  describe('mutiple-enter-search', () => {
    describe('before-show', () => {
      it('should show the step message if error is false', () => {
        let step = tour.tour.getById('mutiple-enter-search')
        let focus = sinon.stub()
        let input = {focus}
        let getElementByIdStub = sinon.stub(document, 'getElementById').callsFake(() => input)
        step.options.when['before-show']()
        expect(showMessageStub.called).to.equal(true)
        expect(emitSpy.calledWith('clearQuery')).to.equal(true)
        expect(mutations.clearSearch.called).to.equal(true)
        expect(focus.called).to.equal(true)
        expect(input.value).to.equal('')
        getElementByIdStub.restore()
      })
      it('should set error to false and return if error is true', () => {
        let step = tour.tour.getById('mutiple-enter-search')
        step.error = true
        step.options.when['before-show'].apply(step)
        expect(step.error).to.equal(false)
      })
    })
    describe('Next button action', () => {
      it('should show the error message if there are 0 disasters in the current search result', () => {
        let disasterSearchTour = tour.tour
        let action = _.find(disasterSearchTour.getById('mutiple-enter-search').options.buttons, { text: 'Next' }).action
        let focus = sinon.stub()
        let select = sinon.stub()
        let input = {focus, select}
        let getElementByIdStub = sinon.stub(document, 'getElementById').callsFake(() => input)
        action()
        expect(hideStub.called).to.equal(true)
        expect(showStub.called).to.equal(true)
        expect(step.error).to.equal(true)
        expect(showErrorStub.called).to.equal(true)
        expect(showMessageStub.called).to.equal(false)
        getElementByIdStub.restore()
      })
      it('should go to next step in the disasterSearchTour if the current search result has at least one record', () => {
        getters.currentSearchResult = function () { return [1] }
        store = new Vuex.Store({state: {}, mutations, getters})
        tour.setStore(store)
        let disasterSearchTour = tour.tour
        let action = _.find(disasterSearchTour.getById('mutiple-enter-search').options.buttons, { text: 'Next' }).action
        let nextStub = sinon.stub(disasterSearchTour, 'next')
        action()
        expect(nextStub.called).to.equal(true)
        nextStub.restore()
      })
    })
  })
  describe('multiple-select-disasters', () => {
    describe('show', () => {
      it('should show the step message if error is false', () => {
        let step = tour.tour.getById('multiple-select-disasters')
        step.options.when.show()
        expect(showMessageStub.called).to.equal(true)
      })
      it('should set error to false and return if error is true', () => {
        let step = tour.tour.getById('multiple-select-disasters')
        step.error = true
        step.options.when.show.apply(step)
        expect(step.error).to.equal(false)
      })
    })
    describe('Next button action', () => {
      it('should show the error message if there are 0 disasters in the current extract', () => {
        let disasterSearchTour = tour.tour
        let action = _.find(disasterSearchTour.getById('multiple-select-disasters').options.buttons, { text: 'Next' }).action
        action()
        expect(hideStub.called).to.equal(true)
        expect(showStub.called).to.equal(true)
        expect(step.error).to.equal(true)
        expect(showErrorStub.called).to.equal(true)
        expect(showMessageStub.called).to.equal(false)
      })
      it('should go to next step in the disasterSearchTour if the current extract has at least two records', () => {
        getters.currentExtract = function () { return [1, 2] }
        store = new Vuex.Store({state: {}, mutations, getters})
        tour.setStore(store)
        let disasterSearchTour = tour.tour
        let action = _.find(disasterSearchTour.getById('multiple-select-disasters').options.buttons, { text: 'Next' }).action
        let nextStub = sinon.stub(disasterSearchTour, 'next')
        action()
        expect(nextStub.called).to.equal(true)
        nextStub.restore()
      })
    })
  })
  describe('save-search', () => {
    describe('Next button action', () => {
      it('should show the error message if the status is not success', () => {
        let disasterSearchTour = tour.tour
        let action = _.find(disasterSearchTour.getById('save-search').options.buttons, { text: 'Next' }).action
        getters.status = function () { return {type: 'bad'} }
        store = new Vuex.Store({state: {}, mutations, getters})
        tour.setStore(store)
        action()
        expect(hideStub.called).to.equal(true)
        expect(showStub.called).to.equal(true)
        expect(step.error).to.equal(true)
        expect(showErrorStub.called).to.equal(true)
        expect(showMessageStub.called).to.equal(false)
      })
      it('should go to next step in the disasterSearchTour if status is success', () => {
        getters.status = function () { return {type: 'success'} }
        store = new Vuex.Store({state: {}, mutations, getters})
        tour.setStore(store)
        let disasterSearchTour = tour.tour
        let action = _.find(disasterSearchTour.getById('save-search').options.buttons, { text: 'Next' }).action
        let nextStub = sinon.stub(disasterSearchTour, 'next')
        action()
        expect(nextStub.called).to.equal(true)
        nextStub.restore()
      })
    })
  })
})
