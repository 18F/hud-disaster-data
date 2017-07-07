import Shepherd from 'tether-shepherd'
import 'babel-polyfill'
import magic from '@/bus'
import _ from 'lodash'
import $ from 'jquery'
let $store

/**
* This module is responsible for the implementing all steps of tour.
* @module tour
*/
// When elements dynamically appear set data-tabindex = tabindex and set tabindex = -1
// On Step start save the current tab index in data-tabindex to be restored later
// On Step start set tabindex = -1 for all elements with a tabindex
// On Step start set up tab index for tour step and attached elements
// On tour end restore tab index to pre tour state
let eventTarget
let observer

const clearTabIndex = function () {
  document.querySelectorAll('*').forEach(el => {
    if (el.tabIndex < 0 || $(el).closest('.shepherd-step').length > 0) return
    el.setAttribute('data-tabindex', el.tabIndex)
    el.tabIndex = -1
  })
  if (eventTarget) return
  eventTarget = document.getElementById('app')
  observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      console.log(mutation.type)
    })
  })

  // configuration of the observer:
  var config = { attributes: true, childList: true, characterData: true, subtree: true }

  // pass in the target node, as well as the observer options
  observer.observe(eventTarget, config)
}
const restoreTabIndex = function () {
  document.querySelectorAll('[data-tabindex]').forEach(el => {
    el.tabIndex = el.getAttribute('data-tabindex')
    el.removeAttribute('data-tabindex')
  })

  if (!eventTarget) return
  observer.disconnect()
  eventTarget = null
}

const disasterSearchTour = new Shepherd.Tour({
  defaults: {
    classes: 'shepherd-element shepherd-open shepherd-theme-square',
    showCancelLink: true,
    scrollTo: true,
    when: {
      show: function () {
        _.each(document.querySelectorAll('.shepherd-cancel-link'), link => {
          link.textContent = ''
          link.innerHTML = '<svg class="hdd-icon"><use xlink:href="#fa-times"></use></svg>'
          link.setAttribute('tabindex', 0)
        })

        // _.each(document.querySelectorAll(['[tabindex]', 'a', 'select', 'button', 'input']), elem => {
        //   elem.tabIndex = -1
        // })
        //
        // _.each(document.querySelectorAll('.shepherd-button '), button => {
        //   button.setAttribute('tabindex', 0)
        // })
        //
        // _.each(document.getElementsByClassName('tabbable'), things => {
        //   things.tabIndex = 0
        // })
        //
        _.each(document.querySelectorAll('.shepherd-content'), step => {
          step.setAttribute('aria-live', 'polite')
        })
      },
      cancel: function () {
        // restoreTabIndex()
        // _.each(document.querySelectorAll(['[tabindex]', 'a', 'select', 'button', 'input']), elem => {
        //   elem.tabIndex = 0
        // })
      },
      hide: function () {
        // eventTarget.removeEventListener('DOMSubtreeModified', eventListener)
      }
    }
  }
})

disasterSearchTour.on('show', clearTabIndex)
disasterSearchTour.on('hide', restoreTabIndex)
disasterSearchTour.on('cancel', restoreTabIndex)

let back = {
  text: 'Back',
  classes: 'tour-back',
  action: function () {
    TourObject.showMessage()
    disasterSearchTour.back()
  }
}
let next = {
  text: 'Next',
  action: function () {
    TourObject.showMessage()
    disasterSearchTour.next()
  }
}
let disasterLink = `
    <p>
    Don’t know the disaster ID?
    Click here: <a target="_blank" href="https://www.fema.gov/disasters" class="tabbable">https://www.fema.gov/disasters</a>
    </p>`

disasterSearchTour.addStep('enter-search', {
  title: 'Search for a disaster',
  text: `
    <div class="tour-message">
      <p>
      Start here by typing in a FEMA disaster ID.
      </p>
      <p>
      These IDs follow the format "DR‐4272‐TX" But you can also type "4272".
      </p>
      <p>
      If you want to see all the recent disasters in a state, type the 2-letter state code (examples, "TX", "CA", "FL").
      </p>
      ${disasterLink}
    </div>
    <div class="tour-error" style="display:none;">
      <p>
      It looks like you typed an invalid disaster ID.
      Try typing just the four‐digit number (example, "4272").
      </p>
      ${disasterLink}
    </div>
    `,
  attachTo: '.search-wrapper bottom',
  when: {
    show: function () {
      disasterSearchTour.options.defaults.when.show.apply(this)
      if (this.error) {
        this.error = false
        return
      }
      TourObject.showMessage()
      const input = document.getElementById('search-text')
      const btn = document.getElementById('search-btn')
      input.setAttribute('tabindex', 0)
      btn.setAttribute('tabindex', 0)
      input.focus()
      input.select()
      // let search = document.querySelectorAll('.disaster-list')[0]
      // eventTarget = search
      // eventListener = search.addEventListener('DOMSubtreeModified', function () {
      //   console.log('search: ', search)
      //   _.each(search.querySelectorAll(['[tabindex]', 'a', 'select', 'button', 'input']), elem => {
      //     elem.tabIndex = -1
      //   })
      // }, false)
    },
    cancel: function () {
      disasterSearchTour.options.defaults.when.cancel.apply(this)
    },
    hide: function () {
      disasterSearchTour.options.defaults.when.hide.apply(this)
    }
  },
  buttons: [
    {
      text: 'Next',
      action: function () {
        let step = disasterSearchTour.getCurrentStep()
        if ($store.getters.currentSearchResult.length > 0) {
          disasterSearchTour.next()
        } else {
          step.hide()
          TourObject.showError()
          step.error = true
          step.show()
          const input = document.getElementById('search-text')
          input.focus()
          input.select()
        }
      }
    }
  ]
})
.addStep('select-disasters', {
  title: 'Select a disaster',
  text: `
    <div class="tour-message">
      <p>
      To select a disaster, click the checkbox located under the disaster ID.
      </p>
    </div>
    <div class="tour-error" style="display:none;">
      <p>
      No disasters selected.
      </p>
      <p>
      Please select a disaster.
      </p>
    </div>
    `,
  attachTo: '.disaster-list bottom',
  when: {
    show: function () {
      disasterSearchTour.options.defaults.when.show.apply(this)
      if (this.error) {
        this.error = false
        return
      }
      TourObject.showMessage()
    },
    cancel: function () {
      disasterSearchTour.options.defaults.when.cancel.apply(this)
    }
  },
  buttons: [
    back,
    {
      text: 'Next',
      action: () => {
        let step = disasterSearchTour.getCurrentStep()
        if ($store.getters.currentExtract.length === 0) {
          step.hide()
          TourObject.showError()
          step.error = true
          step.show()
        } else {
          disasterSearchTour.next()
        }
      }
    }
  ]
})
.addStep('selected-export-data', {
  title: 'Disaster selected',
  text: `
  <p>
  You’ve selected a disaster and it is now listed in the selected disasters list.
  You can export the associated FEMA data now or save this search to export the data in the future.
  You can also search for additional disasters to add to this list.
  </p>
  <p>
  First, let’s try exporting the data.
  </p>
  `,
  buttons: [back, next],
  attachTo: '#list bottom',
  when: {
    show: function () {
      disasterSearchTour.options.defaults.when.show.apply(this)
    },
    'before-show': function () { document.getElementById('list').style['z-index'] = '1' },
    hide: function () { document.getElementById('list').style['z-index'] = null },
    cancel: function () {
      disasterSearchTour.options.defaults.when.cancel.apply(this)
    }
  }
})
.addStep('export-data', {
  title: 'Export data',
  text: `
  <p>To get household level data for the disaster selected, click the export button.</p>
  <p>Your computer will download a .csv formatted file.</p>
  `,
  attachTo: '#export-button bottom',
  buttons: [
    {
      text: 'Back',
      classes: 'tour-back',
      action: function () {
        if ($store.getters.currentSearchResult.length > 0) {
          disasterSearchTour.back()
        } else {
          disasterSearchTour.hide()
          disasterSearchTour.start()
        }
      }
    },
    next]
})
.addStep('mutiple-enter-search', {
  title: 'Add to your list',
  text: `
  <div class="tour-message">
    <p>
    If you want to export data for multiple disasters at the same time, you can search for another disaster and add it to the list.
    </p>
    <p>
    Try typing in the 2-letter state code for your state (example, "TX", "LA", "CA")
    </p>
  </div>
  <div class="tour-error" style="display:none;">
  It looks like you entered an invalid 2-letter state code.  Try typing "TX".
  </div>
  `,
  attachTo: '.search-wrapper bottom',
  when: {
    show: function () {
      disasterSearchTour.options.defaults.when.show.apply(this)
    },
    'before-show': function () {
      if (this.error) {
        this.error = false
        return
      }
      TourObject.showMessage()
      $store.commit('clearSearch')
      const input = document.getElementById('search-text')
      input.focus()
      input.value = ''
      magic.$emit('clearQuery')
    },
    cancel: function () {
      disasterSearchTour.options.defaults.when.cancel.apply(this)
    }
  },
  buttons: [
    back,
    {
      text: 'Next',
      action: function () {
        let step = disasterSearchTour.getCurrentStep()
        if ($store.getters.currentSearchResult.length > 0) {
          disasterSearchTour.next()
        } else {
          step.hide()
          TourObject.showError()
          const input = document.getElementById('search-text')
          input.focus()
          input.select()
          step.error = true
          step.show()
        }
      }
    }
  ]
})
.addStep('multiple-select-disasters', {
  title: 'Select another disaster',
  text: `
    <div class="tour-message">
      <p>
      Here are all the recent disasters in your state.
      Select additional disasters by clicking the checkbox located under the disaster ID.
      </p>
    </div>
    <div class="tour-error" style="display:none;">
      <p>
      Less than 2 disasters selected.
      </p>
      <p>
      Please select multiple disasters.
      </p>
    </div>
    `,
  attachTo: '.disaster-list bottom',
  when: {
    show: function () {
      disasterSearchTour.options.defaults.when.show.apply(this)
      if (this.error) {
        this.error = false
        return
      }
      TourObject.showMessage()
    },
    cancel: function () {
      disasterSearchTour.options.defaults.when.cancel.apply(this)
    }
  },
  buttons: [
    back,
    {
      text: 'Next',
      action: () => {
        let step = disasterSearchTour.getCurrentStep()
        if ($store.getters.currentExtract.length < 2) {
          step.hide()
          TourObject.showError()
          step.error = true
          step.show()
        } else {
          disasterSearchTour.next()
        }
      }
    }
  ]
})
.addStep('save-search', {
  title: 'Name and save your list',
  text: `
  <div class="tour-message">
  <p>
  You now have multiple disasters listed within your selected disaster list.
  </p>
  <p>
  Please enter a name in the name input field and click the save button to the right.
  </p>
  </div>
  <div class="tour-error" style="display:none;">
  You have encountered an error.  Please enter a different search name and try again.
  </div>
  `,
  attachTo: '#saved_searches bottom',
  buttons: [back,
    {
      text: 'Next',
      action: () => {
        let step = disasterSearchTour.getCurrentStep()
        if ($store.getters.status.type !== 'success') {
          step.hide()
          TourObject.showError()
          step.error = true
          step.show()
        } else {
          disasterSearchTour.next()
        }
      }
    }
  ]
})
.addStep('use-saved-search', {
  title: 'Access saved search',
  text: `
    <p>
    Congratulations!
    </p>
    <p>
    You have successfully created a saved disaster search!
    </p>
    <p>
    It can be now be be accessed at any time when selected in the "Saved Searches" dropdown selector.
    </p>
  </div>
  `,
  attachTo: '#saved_searches bottom',
  buttons: [back, next]
})
.addStep('deselect-disaster', {
  title: 'Remove from list',
  text: `
    <p>
    If you want to remove a specific disaster from your list, deselect it by clicking the checkbox under the disaster ID.
    </p>
  </div>
  `,
  attachTo: '#list bottom',
  buttons: [back, next]
})
.addStep('clear-current-extract', {
  title: 'Clear list',
  text: `
    <p>
    If you want to clear all the disasters in your list and start over, click the clear button.
    </p>
  </div>
  `,
  attachTo: '#clear-button top',
  buttons: [back,
    {
      text: 'Next',
      action: () => {
        $store.commit('clearCurrentExtract')
        disasterSearchTour.next()
      }
    }
  ]
})
.addStep('select-previous-search', {
  title: 'Select a previously saved list',
  text: `
    <p>
    If you want to select a previously saved list of disaster(s), select an option from the dropdown list.
    </p>
  </div>
  `,
  attachTo: '#saved_searches bottom',
  buttons: [back, next]
})
.addStep('delete-saved-search', {
  title: 'Delete previously saved list',
  text: `
    <p>
    If you want to delete a previously saved list of disaster(s), select an option from the dropdown to load, then click the delete button.
    </p>
    <p>
    Warning: this will actually delete the list. If you do not want to delete a list, click Next.
    </p>
  </div>
  `,
  attachTo: '#saved_searches bottom',
  buttons: [back, next]
})
.addStep('end-of-tour', {
  title: 'Complete',
  text: `
    <p>
    Congratulations, you have completed the guided experience. Click here (link: FAQ) if you have additional questions.
    </p>
  </div>
  `,
  buttons: [back,
    {
      text: 'End Tour',
      action: function () {
        disasterSearchTour.cancel()
        disasterSearchTour.hide()
      }
    }
  ]
})

const TourObject = {
  start (store) {
    this.setStore(store)
    if (Shepherd.activeTour) return
    disasterSearchTour.start()
  },
  tour: disasterSearchTour,
  next: next,
  back: back,
  setStore (store) {
    if (store) $store = store
  },
  showError () {
    _.each(document.querySelectorAll('.tour-message'), $el => ($el.style.display = 'none'))
    _.each(document.querySelectorAll('.tour-error'), $el => ($el.style.display = 'block'))
  },
  showMessage () {
    _.each(document.querySelectorAll('.tour-error'), $el => ($el.style.display = 'none'))
    _.each(document.querySelectorAll('.tour-message'), $el => ($el.style.display = 'block'))
  }
}
export default TourObject
