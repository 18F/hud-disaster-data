/* global describe, it, expect */
import 'es6-promise/auto' // eslint-disable-line
import Vue from 'vue' // eslint-disable-line
import '@/vue-mixins'
import tour from '@/tour'
import sinon from 'sinon'
import header from '@/components/Header'
// eslint-disable-line

Vue.config.productionTip = false

describe('Header.vue', () => {
  it('should render correct header', done => {
    const Constructor = Vue.extend(header)
    const vm = new Constructor().$mount()
    Vue.nextTick(function () {
      expect(vm.$refs.title.textContent).to.be.equal(vm.title)
      done()
    })
  })
  describe('startTour', () => {
    it('should start the tour', () => {
      let startStub = sinon.stub(tour, 'start')
      const Constructor = Vue.extend(header)
      const vm = new Constructor().$mount()
      vm.startTour()
      expect(startStub.called).to.be.equal(true)
      startStub.restore()
    })
  })
})
