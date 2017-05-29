/* global Event, describe, it, expect, sinon */
import 'es6-promise/auto' // eslint-disable-line
import Vue from 'vue' // eslint-disable-line
import Vuex from 'vuex' // eslint-disable-line
import store from '../../../src/store' // eslint-disable-line
import Typeahead from '@/components/Typeahead' // eslint-disable-line

Vue.use(Vuex)
Vue.config.productionTip = false

/* eslint-disable no-new */
import _ from 'lodash' // eslint-disable-line
const ONE_RECORD = [
  {
    disasterNumber: 4311,
    state: 'UT',
    declarationDate: 'April 21, 2017',
    disasterType: 'DR',
    incidentType: 'Flood',
    title: 'SEVERE WINTER STORMS AND FLOODING',
    declaredCountyArea: [ 'Box Elder (County)', 'Cache (County)' ],
    placeCode: 99003,
    id: '58fa2e008a4f31363dac2c6a'
  } ]

const TWO_RECORDS = [
  {'disasterNumber': 4289,
    'state': 'IA',
    'declarationDate': 'October 31, 2016',
    'disasterType': 'DR',
    'incidentType': 'Flood',
    'title': 'SEVERE STORMS AND FLOODING',
    'declaredCountyArea': ['Buchanan (County)', 'Delaware (County)', 'Howard (County)'],
    'placeCode': 99019,
    'id': '5817ea93289b6425072e20eb'
  },
  {'disasterNumber': 4281,
    'state': 'IA',
    'declarationDate': 'September 29, 2016',
    'disasterType': 'DR',
    'incidentType': 'Flood',
    'title': 'SEVERE STORMS, STRAIGHT-LINE WINDS, AND FLOODING',
    'declaredCountyArea': ['Winneshiek (County)', 'Clayton (County)'],
    'placeCode': 99191,
    'id': '57edac84c7e7c327077fc494'
  } ]

function dispatchEvent ($el, name, opts) {
  var event = new Event(name, {
    'bubbles': true,
    'cancelable': true
  })
  if (opts && _.isObject(opts)) _.assign(event, opts)
  $el.dispatchEvent(event)
}

function populateInput (vm, input) {
  let $input = vm.$el.querySelector('.Typeahead__input')
  $input.value = input
  return $input
}

describe('Typeahead.vue', () => {
  it('should render correct list item contents', done => {
    const Constructor = Vue.extend(Typeahead)
    const vm = new Constructor({store}).$mount()
    vm.$store.commit('updateDisasterList', { list: ONE_RECORD })
    Vue.nextTick(function () {
      expect(vm.$el.querySelector('.disaster-search-recs').childElementCount).to.be.equal(1)
      done()
    })
  })

  it('should not populate items if query is empty', done => {
    const Constructor = Vue.extend(Typeahead)
    const vm = new Constructor({store}).$mount()
    vm.$store.commit('updateDisasterList', { list: [] })
    Vue.nextTick(function () {
      expect(vm.$el.querySelector('.disaster-search-recs').childElementCount).to.be.equal(0)
      done()
    })
  })

  it('should select the last item in the array of items on up arrow', done => {
    const Constructor = Vue.extend(Typeahead)
    const vm = new Constructor({store}).$mount()
    vm.$store.commit('updateDisasterList', { list: TWO_RECORDS })
    let $input = populateInput(vm, 'X')
    Vue.nextTick(function () {
      dispatchEvent($input, 'keydown', {keyCode: 38})
      Vue.nextTick(() => {
        expect(vm.$el.querySelector('.disaster-search-recs').childElementCount).to.be.equal(2)
        expect(vm.current).to.be.equal(vm.$el.querySelector('.disaster-search-recs').childElementCount - 1)
        done()
      })
    })
  })

  it('should select the previous item in the array of items on up arrow when the second item is current', done => {
    const Constructor = Vue.extend(Typeahead)
    const vm = new Constructor({store}).$mount()
    vm.$store.commit('updateDisasterList', { list: TWO_RECORDS })
    let $input = populateInput(vm, 'X')
    dispatchEvent($input, 'input')

    Vue.nextTick(function () {
      vm.current = 1
      let current = vm.current

      dispatchEvent($input, 'keydown', {keyCode: 38})

      Vue.nextTick(() => {
        expect(vm.$el.querySelector('.disaster-search-recs').childElementCount).to.be.equal(2)
        expect(vm.current).to.be.equal(current - 1)
        done()
      })
    })
  })

  it('should select no item in the array of items on up arrow when the current is less than -1', done => {
    const Constructor = Vue.extend(Typeahead)
    const vm = new Constructor({store}).$mount()
    vm.$store.commit('updateDisasterList', { list: TWO_RECORDS })
    let $input = populateInput(vm, 'X')
    dispatchEvent($input, 'input')

    Vue.nextTick(function () {
      vm.current = -2

      dispatchEvent($input, 'keydown', {keyCode: 38})

      Vue.nextTick(() => {
        expect(vm.$el.querySelector('.disaster-search-recs').childElementCount).to.be.equal(2)
        expect(vm.current).to.be.equal(-1)
        done()
      })
    })
  })

  it('should select the first item in the array of items on down arrow keydown', done => {
    const Constructor = Vue.extend(Typeahead)
    const vm = new Constructor({store}).$mount()
    vm.$store.commit('updateDisasterList', { list: TWO_RECORDS })
    let $input = populateInput(vm, 'X')
    dispatchEvent($input, 'input')

    Vue.nextTick(function () {
      dispatchEvent($input, 'keydown', {keyCode: 40})

      Vue.nextTick(() => {
        expect(vm.$el.querySelector('.disaster-search-recs').childElementCount).to.be.equal(2)
        expect(vm.current).to.be.equal(0)
        done()
      })
    })
  })

  it('should not select an item in the array of items on down arrow keydown if the last item is selected', done => {
    const Constructor = Vue.extend(Typeahead)
    const vm = new Constructor({store}).$mount()
    vm.$store.commit('updateDisasterList', { list: TWO_RECORDS })
    let $input = populateInput(vm, 'X')
    dispatchEvent($input, 'input')

    Vue.nextTick(function () {
      vm.current = 1
      dispatchEvent($input, 'keydown', {keyCode: 40})

      Vue.nextTick(() => {
        expect(vm.$el.querySelector('.disaster-search-recs').childElementCount).to.be.equal(2)
        expect(vm.current).to.be.equal(-1)
        done()
      })
    })
  })

  describe('update', () => {
    it('should force a reset if query is undefined', () => {
      const Constructor = Vue.extend(Typeahead)
      const vm = new Constructor({store}).$mount()
      expect(vm.query).to.be.equal('')
      vm.query = undefined
      expect(vm.query).to.be.equal(undefined)
      vm.update()
      expect(vm.query).to.be.equal('')
    })

    it('should return before loading if query is shorter than 2', () => {
      const Constructor = Vue.extend(Typeahead)
      const vm = new Constructor({store}).$mount()
      expect(vm.query).to.be.equal('')
      vm.query = 'A'
      vm.update()
      expect(vm.loading).to.be.equal(false)
    })

    // it.only('should select the first item if selectFirst is true', (done) => {
    //   const vm = TestVue.$mount()
    //   vm.$store.commit('updateDisasterList', { list: TWO_RECORDS })
    //   let $input = populateInput(vm, 'X')
    //   vm.selectFirst = true
    //   dispatchEvent($input, 'input')
    //   Vue.nextTick(function () {
    //     expect(vm.$el.querySelector('.disaster-search-recs').childElementCount).to.be.equal(2)
    //     expect(vm.current).to.be.equal(0)
    //     done()
    //   })
    // })
  })

  describe('hit', () => {
    it('should call onHit if an item is selected', () => {
      const Constructor = Vue.extend(Typeahead)
      const vm = new Constructor({store}).$mount()
      sinon.spy(vm, 'onHit')
      vm.current = 1
      vm.$store.commit('updateDisasterList', { list: TWO_RECORDS })
      vm.hit()
      expect(vm.onHit.calledOnce)
      vm.onHit.restore()
    })

    it('should not call onHit if an item is not slected', () => {
      const Constructor = Vue.extend(Typeahead)
      const vm = new Constructor({store}).$mount()
      sinon.spy(vm, 'onHit')
      vm.current = -1
      vm.items = TWO_RECORDS
      vm.hit()
      expect(!vm.onHit.calledOnce)
      vm.onHit.restore()
    })
  })

  describe('setActive', () => {
    it('should set the current item', () => {
      const Constructor = Vue.extend(Typeahead)
      const vm = new Constructor({store}).$mount()
      vm.setActive(1)
      expect(vm.current).to.be.equal(1)
    })
  })

  describe('onSelected', () => {
    it('should add a disaster component to the extracts component for the item selected', (done) => {
      const Constructor = Vue.extend(Typeahead)
      const vm = new Constructor({store}).$mount()
      vm.$store.commit('updateDisasterList', { list: TWO_RECORDS })
      let $input = populateInput(vm, 'X')
      dispatchEvent($input, 'input')

      Vue.nextTick(function () {
        let $button = vm.$el.querySelector('.disaster .select-button')
        dispatchEvent($button, 'click')
        Vue.nextTick(() => {
          expect(vm.$el.querySelectorAll('#extract>ul>li').length).to.be.equal(1)
          done()
        })
      })
    })
  })
})
