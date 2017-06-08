import Shepherd from 'tether-shepherd'

const tour = new Shepherd.Tour({
  defaults: {
    classes: 'shepherd-theme-arrows',
    scrollTo: true
  }
})

tour.addStep('example-step', {
  text: 'Check out this cool button!',
  attachTo: '.avi bottom',
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
