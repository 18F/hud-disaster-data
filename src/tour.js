import Shepherd from 'tether-shepherd'
import 'babel-polyfill'
import magic from '@/bus'
import _ from 'lodash'
import bowser from 'bowser'
import $ from 'jquery'
let $store

/**
* This module is responsible for the implementing all steps of tour.
*
* In order to keep tabbing confined to the items of interest in the current tour step, we maintane and
* modify the tabindex of all tabbable elemnts in the DOM.  Unfortunately Internet Explorer doesn't respect
* our tabindex settings.
*
* 1. On Tour start setup a MutationObserver to watch for DOM changes that cause tabindexes to be maintaned
* 2. On Step start
*   - save the current tab index in data-tabindex to be restored later
*   - set tabindex = -1 for all elements with a tabindex
*   - set up tab index for tour step and attached elements
* 3. On Tour End
*   - restore page tab index
* @module tour
*/
let eventTarget
let observer
const getTabIndex = function (node) {
  var index = node.tabIndex
  if (bowser.msie || bowser.msedge) {
    var tnode = _.get(node, 'attributes.tabIndex.specified')
    if (!tnode) {
      var map = {a: true, body: true, button: true, frame: true, iframe: true, img: true, input: true, isindex: true, object: true, select: true, textarea: true}
      var nodeName = node.nodeName.toLowerCase()
      return (map[nodeName]) ? 0 : null
    }
  } else {
    if (index === -1) {
      var attr = node.getAttribute('tabindex')
      if (attr == null || (attr === '' && !bowser.gecko)) return null
    }
  }
  return index
}
/**
* Removes the MutationObserver that listens for changes to the DOM in order to maintane tabIndex
* @function removeObserver
*/
const removeObserver = function () {
  restoreTabIndex()
  if (!eventTarget) return
  observer.disconnect()
  eventTarget = null
}
const clearElementTabIndex = function (el) {
  let tabIndex = getTabIndex(el)
  let shepherdStep = $(el).closest('.shepherd-step')
  if (tabIndex === null || shepherdStep.length > 0 || el.hasAttribute('data-tabindex')) return
  el.setAttribute('data-tabindex', tabIndex)
  el.tabIndex = -1
}
/**
* This function sets up a MutationObserver to watch over the 'app-container' for dynamic HTML that
* needs to be maintaned and removed from the current tabIndex
* @function clearTabIndex
* @param {HTMLElement} target - Clear the tabIndex for all descendents of target (default. document)
*/
const clearTabIndex = function (target) {
  if (target) clearElementTabIndex(target)
  target = target || document
  _.each(target.querySelectorAll('*'), clearElementTabIndex)
  if (eventTarget || target !== document) return
  eventTarget = document.getElementById('app-container')
  if (!eventTarget) return
  observer = new MutationObserver(function (mutations) {
    _.each(mutations, function (mutation) {
      if (mutation.type === 'childList') {
        console.log(mutation.addedNodes)
        _.each(mutation.addedNodes, clearTabIndex)
      }
    })
  })
  var config = { attributes: false, childList: true, characterData: false, subtree: true }
  observer.observe(eventTarget, config)
}
const restoreElementTabIndex = function (el) {
  let tabIndex = parseInt(el.getAttribute('data-tabindex'), 10)
  el.tabIndex = tabIndex
  el.removeAttribute('data-tabindex')
}
/**
* Restore the page tabIndex from data-tabindex attribute
* @function restoreTabIndex
* @param {HTMLElement} target - Restore the tabIndex of target and it's descendents
*/
const restoreTabIndex = function (target) {
  if (target && target.hasAttribute('data-tabindex')) restoreElementTabIndex(target)
  target = target || document
  let tabElements = target.querySelectorAll('[data-tabindex]')
  _.each(tabElements, restoreElementTabIndex)
}

const setAccessiblityContent = function (el) {
  el.setAttribute('aria-live', 'assertive')
  el.setAttribute('role', 'alert')
  // el.innerHTML = el.innerHTML + ' '
  // the code below seems to cause NVDA to read (somewhat)
  // document.querySelector('#search-text-label').innerText = el.innerText
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
          link.tabIndex = 0
        })
        _.each(document.querySelectorAll('.shepherd-button '), button => {
          button.addEventListener('keypress', e => {
            e.target.dispatchEvent(new Event('click'))
          })
          button.tabIndex = 0
        })
        _.each(document.querySelectorAll('.shepherd-content'), step => {
          setAccessiblityContent(step)
        })
        if (typeof this.getAttachTo !== 'undefined') restoreTabIndex(this.getAttachTo().element)
      }
    }
  }
})

disasterSearchTour.on('show', () => clearTabIndex())
disasterSearchTour.on('hide', () => removeObserver())
disasterSearchTour.on('cancel', () => removeObserver())

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
      Start here by typing in a FEMA disaster ID and clicking the magnifying glass icon.
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
      Please enter a valid state code or disaster ID, for example "4272". Then click the magnifying glass icon.
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
      input.focus()
      input.select()
    }
  },
  buttons: [
    {
      text: 'Next',
      action: () => {
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
    hide: function () { document.getElementById('list').style['z-index'] = null }
  }
})
.addStep('export-data', {
  title: 'Export data',
  text: `
  <p>To get household level data for the disaster selected, click the export button.</p>
  <p>Your computer will download a CSV-formatted file.</p>
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
    Please enter a valid 2-letter state code, such as "TX", and click the magnifying glass icon.
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
    Please enter a unique name for your disaster list and click the save button.
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
  title: 'Access saved disaster list',
  text: `
    <p>
    Congratulations!
    </p>
    <p>
    You have successfully created a saved disaster search!
    </p>
    <p>
    It can be now be be accessed at any time when selected in the "Saved Disaster Lists" dropdown selector.
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
