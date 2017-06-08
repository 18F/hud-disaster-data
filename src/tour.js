import Shepherd from 'tether-shepherd'

const tour = new Shepherd.Tour({
  defaults: {
    classes: 'shepherd-element shepherd-open shepherd-theme-arrows',
    showCancelLink: true,
    scrollTo: true
  }
})

tour.addStep('enter-search', {
  text: 'Start here by typing in a FEMA disaster ID in the format "DR-4272-TX"',
  attachTo: '.search-wrapper bottom',
  classes: 'shepherd shepherd-open shepherd-theme-arrows shepherd-transparent-text',
  buttons: [
    {
      text: 'Next',
      action: tour.next
    }
  ]
})

export default {
  start () {
    tour.start()
  }
}
