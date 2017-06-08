import Shepherd from 'tether-shepherd'

const tour = new Shepherd.Tour({
  defaults: {
    classes: 'shepherd-element shepherd-open shepherd-theme-square',
    showCancelLink: true,
    scrollTo: false
  }
})

let back = {
  text: 'Back',
  action: tour.back
}
let next = {
  text: 'Next',
  action: tour.next
}
// let cancel = {
//   text: 'Cancel',
//   action: tour.cancel
// }

tour.addStep('enter-search', {
  text: 'Start here by typing in a FEMA disaster ID in the format "DR-4272-TX"',
  attachTo: '.search-wrapper right'
})
.addStep('select-disasters', {
  text: 'Click the box to select a disaster',
  attachTo: '.disaster-list right',
  buttons: [back, next]
})
.addStep('save-search', {
  text: 'You\'ve selected a disaster and it is now listed here. You can either export the associated FEMA data, or save this search to export the data in the future.',
  attachTo: '.extracts left',
  buttons: [back, next]
})

export default {
  start () {
    tour.start()
  }
}
