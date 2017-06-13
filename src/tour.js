import Shepherd from 'tether-shepherd'
import $store from './store'
import $ from 'jquery'

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
      $('.tour-message').show()
      $('.tour-error').hide()
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
          $('.tour-message').hide()
          $('.tour-error').show()
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
      $('.tour-message').show()
      $('.tour-error').hide()
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
          $('.tour-message').hide()
          $('.tour-error').show()
          step.error = true
          step.show()
          debugger
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
  text: `
    <p>
    It looks like you typed an invalid Disaster ID.
    Try typing just the four‐digit number (example, “4272”).
    </p>
    ${disasterLink}
    `,
  attachTo: '.search-wrapper right',
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
  text: 'No disasters selected.  Please select a disaster from the list.',
  attachTo: '.disaster-list right',
  when: {
    show: () => {
      let destroy = $store.watch((state) => state.currentExtract, (currentExtract) => {
        if (currentExtract.length === 0) return
        appErrorTour.hide()
        disasterSearchTour.show('select-disasters')
        destroy()
      })
    }
  },
  buttons: []
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
