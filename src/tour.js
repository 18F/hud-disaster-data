import Shepherd from 'tether-shepherd'
let $store

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
let disasterLink = `
    <p>
    Don’t know the disaster ID?
    Click <a href="https://www.fema.gov/disasters">here</a>. (<a href="https://www.fema.gov/disasters">https://www.fema.gov/disasters</a>)
    </p>`

disasterSearchTour.addStep('enter-search', {
  text: `
    <div class="tour-message">
      <p>
      Start here by typing in a FEMA disaster ID.<br/>
      These IDs follow the format “DR‐4272‐TX” But you can also type “4272”.
      </p>
      <p>
      If you want to see all the recent disasters in a stat, type the states 2 character abbreviation (examples, “TX”, “CA”, “FL).
      </p>
      ${disasterLink}
    </div>
    <div class="tour-error" style="display:none;">
      <p>
      It looks like you typed an invalid Disaster ID.
      Try typing just the four‐digit number (example, “4272”).
      </p>
      ${disasterLink}
    </div>
    `,
  attachTo: '.search-wrapper right',
  when: {
    show: function () {
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
      action: function () {
        let step = disasterSearchTour.getCurrentStep()
        if ($store.getters.currentSearchResult.length > 0) {
          disasterSearchTour.next()
        } else {
          step.hide()
          TourObject.showError()
          step.error = true
          step.show()
        }
      }
    }
  ]
})
.addStep('select-disasters', {
  text: `
    <div class="tour-message">
      <p>
      Click the checkbox located under the disaster ID to select a disaster.
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
  attachTo: '.disaster-list right',
  when: {
    show: function () {
      if (this.error) {
        this.error = false
        return
      }
      TourObject.showMessage()
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
.addStep('export-data', {
  text: `
  <p>
  You’ve selected a disaster and it is now listed here.
  You can export the associated FEMA data now, or save this search to export the data in the future.
  You can also search for additional disasters to add too this list.
  </p>
  <p>
  First, let’s try exporting the data.
  </p>
  <p>To get household level data for the disaster selected, click the export button.</p>
  <p>Your computer will download a .csv formatted file</p>
  `,
  attachTo: '#export-button top',
  buttons: [
    {
      text: 'Back',
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
  text: `
  <div class="tour-message">
    <p>
    If you want to export data for multiple disasters at the same time, you can search for another disaster and add it to the list.
    </p>
    <p>
    Try typing in the postal code for your state (example, “TX”, “LA”, “CA")
    </p>
  </div>
  <div class="tour-error">
  It looks like you entered an invalid postal code.  Try typing "TX".
  </div>
  `,
  attachTo: '.search-wrapper right',
  when: {
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
      input.dispatchEvent(new Event('hdd.clear'))
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
          step.error = true
          step.show()
        }
      }
    }
  ]
})
.addStep('multiple-select-disasters', {
  text: `
    <div class="tour-message">
      <p>
      Here are all the recent disasters in your state.
      Select additional states by clicking the checkbox located under the disaster ID.
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
  attachTo: '.disaster-list right',
  when: {
    show: function () {
      if (this.error) {
        this.error = false
        return
      }
      TourObject.showMessage()
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
  text: `
  <div class="tour-message">
  <p>
  You now have multiple disasters listed within your search list.
  </p>
  <p>
  If you would like to save this search to run again in the future, enter a name in the name input field and click the save button to the right
  </p>
  </div>
  <div class="tour-error">
  You have encountered an error.  Please correct your action and try again.
  </div>
  `,
  attachTo: '#saved_searches left',
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
const TourObject = {
  start (store) {
    this.setStore(store)
    if (Shepherd.activeTour) return
    disasterSearchTour.start()
  },
  tour: disasterSearchTour,
  setStore (store) {
    if (store) $store = store
  },
  showError () {
    document.querySelectorAll('.tour-message').forEach($el => ($el.style.display = 'none'))
    document.querySelectorAll('.tour-error').forEach($el => ($el.style.display = 'block'))
  },
  showMessage () {
    document.querySelectorAll('.tour-error').forEach($el => ($el.style.display = 'none'))
    document.querySelectorAll('.tour-message').forEach($el => ($el.style.display = 'block'))
  }
}
export default TourObject
