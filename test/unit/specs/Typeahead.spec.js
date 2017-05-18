require('babel-polyfill')
import Vue from 'vue'
import Typeahead from '@/components/Typeahead'
import axios from 'axios'
import moxios from 'moxios'

describe('Typeahead.vue', () => {
  beforeEach(function () {
    // import and pass your custom axios instance to this method
    Vue.prototype.$http = axios
    moxios.install()
    moxios.stubRequest(/.*DR-4311/, {
      status: 200,
      response: [
        { declarationDate: '2017-04-21T15:17:00.000Z',
          declaredCountyArea: 'Box Elder (County)',
          disasterNumber: 4311,
          disasterType: 'DR',
          id: '58fa2e008a4f31363dac2c6a',
          incidentType: 'Flood',
          placeCode: 99003,
          state: 'UT',
          title: 'SEVERE WINTER STORMS AND FLOODING' },
        { declarationDate: '2017-04-21T15:17:00.000Z',
          declaredCountyArea: 'Cache (County)',
          disasterNumber: 4311,
          disasterType: 'DR',
          id: '58fa2e008a4f31363dac2c70',
          incidentType: 'Flood',
          placeCode: 99005,
          state: 'UT',
          title: 'SEVERE WINTER STORMS AND FLOODING'
        }
      ]
    })
  })

  afterEach(function () {
    // import and pass your custom axios instance to this method
    moxios.uninstall()
  })

  it('should render correct list item contents', done => {
    const Constructor = Vue.extend(Typeahead)
    const vm = new Constructor().$mount()
    let $input = vm.$el.querySelector('.Typeahead__input')
    $input.value = 'DR-4311'
    var event = new Event('input', {
      'bubbles': true,
      'cancelable': true
    })

    $input.dispatchEvent(event)
    moxios.wait(function () {
      console.log(vm.$el.querySelectorAll('.disaster-list li'))
      expect(vm.$el.querySelectorAll('.disaster-list li')).to.have.length.of.at.least(1)
      done()
    })
  })
})
