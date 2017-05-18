require('babel-polyfill')
import Vue from 'vue'
import Typeahead from '@/components/Typeahead'
import _ from 'lodash'
import axios from 'axios'
import moxios from 'moxios'

function dispatchEvent ($el, name, opts) {
  var event = new Event(name, {
    'bubbles': true,
    'cancelable': true
  })
  if (opts && _.isObject(opts)) _.assign(event, opts)
  $el.dispatchEvent(event)
}

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

    dispatchEvent($input, 'input')

    moxios.wait(function () {
      console.log(vm.$el.querySelectorAll('.disaster-list li'))
      expect(vm.$el.querySelectorAll('.disaster-list li').length).to.be.equal(2)
      done()
    })
  })

  it('should decrement this.current', done => {
    const Constructor = Vue.extend(Typeahead)
    const vm = new Constructor().$mount()
    let $input = vm.$el.querySelector('.Typeahead__input')
    $input.value = 'DR-4311'

    dispatchEvent($input, 'input')

    var current = vm.current
    console.log(`current:${current}`)

    moxios.wait(function () {
      dispatchEvent($input, 'keydown', {keyCode: 38})

      Vue.nextTick(() => {
        expect(vm.items.length).to.be.equal(2)
        expect(vm.current).to.be.equal(vm.items.length - 1)
        console.log(`vm.current: ${vm.current}`)
        // expect(vm.current).to.be.equal(current - 1)
        done()
      })
    })
  })
})
