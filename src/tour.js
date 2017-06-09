import Shepherd from 'tether-shepherd'
import $store from './store'
import _ from 'lodash'

const disasterSearchTour = new Shepherd.Tour({
  defaults: {
    classes: 'shepherd-element shepherd-open shepherd-theme-square',
    showCancelLink: true,
    scrollTo: false
  }
})

let back = {
  text: 'Back',
  action: disasterSearchTour.back
}
let next = {
  text: 'Next',
  action: disasterSearchTour.next
}

disasterSearchTour.addStep('enter-search', {
  text: 'Start here by typing in a FEMA disaster ID in the format "DR-4272-TX"',
  attachTo: '.search-wrapper right',
  when: {
    show: () => {
      const input = document.getElementById('search-text')
      input.focus()
      input.select()
    }
  },
  buttons: [
    {
      text: 'Next',
      action: () => {
        if (_.get($store.getters.status, 'scope') === 'app') {
          disasterSearchTour.cancel()
          appErrorTour.start()
        } else if ($store.getters.currentSearchResult.length > 0) {
          disasterSearchTour.next()
        }
      }
    }
  ]
})
.addStep('select-disasters', {
  text: 'Click the box to select a disaster',
  attachTo: '.disaster-list right',
  buttons: [
    back,
    {
      text: 'Next',
      action: () => {
        if ($store.getters.currentExtract.length === 0) {
          disasterSearchTour.cancel()
          appErrorTour.show('show-non-selected-error')
        } else {
          disasterSearchTour.next()
        }
      }
    }
  ]
})
.addStep('save-search', {
  text: 'You\'ve selected a disaster and it is now listed here. You can either export the associated FEMA data, or save this search to export the data in the future.',
  attachTo: '.extracts left',
  buttons: [back, next]
})

const appErrorTour = new Shepherd.Tour({
  defaults: {
    classes: 'shepherd-element shepherd-open shepherd-theme-square',
    showCancelLink: true,
    scrollTo: false
  }
}).addStep('show-error', {
  text: 'Looks like there are no results.  Click back and try searching on TX',
  attachTo: '#search-message right',
  buttons: [
    {
      text: 'Back',
      action: () => {
        appErrorTour.cancel()
        disasterSearchTour.start()
      }
    }
  ]
})
.addStep('show-non-selected-error', {
  text: 'Looks like you selected no disasters.  Click try again and try selecting one or more disasters',
  attachTo: '.disaster-list right',
  buttons: [
    {
      text: 'Try Again',
      action: () => {
        appErrorTour.cancel()
        disasterSearchTour.show('select-disasters')
      }
    }
  ]
})

export default {
  start () {
    if (Shepherd.activeTour) return
    disasterSearchTour.start()
  },
  tours: {
    disasterSearchTour,
    appErrorTour
  }
}
