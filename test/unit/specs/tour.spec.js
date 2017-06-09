import tour from '@/tour'
import sinon from 'sinon'
import store from '@/store'
import _ from 'lodash'

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
  })
})
