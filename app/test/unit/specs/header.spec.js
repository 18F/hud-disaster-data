/* global describe, it, expect */
import 'es6-promise/auto' // eslint-disable-line
import Vue from 'vue' // eslint-disable-line
import '@/vue-mixins'
import tour from '@/tour'
import sinon from 'sinon'
import Header from '@/components/Header'
import router from '@/router'
import store from '@/store'
// eslint-disable-line

Vue.config.productionTip = false

describe('Header.vue', () => {
  it('should render correct header', done => {
    const Constructor = Vue.extend(Header)
    const vm = new Constructor({store, router}).$mount()
    Vue.nextTick(function () {
      expect(vm.$refs.title.textContent).to.be.equal(vm.title)
      done()
    })
  })
  describe('startTour', () => {
    it('should start the tour', () => {
      let startStub = sinon.stub(tour, 'start')
      const Constructor = Vue.extend(Header)
      const vm = new Constructor({store, router}).$mount()
      vm.startTour()
      expect(startStub.called).to.be.equal(true)
      startStub.restore()
    })
  })
  describe('toggleBurger', () => {
    it('should set burgerMenu attribute hidden if it is not set, or unset it, if it is set', () => {
      const Constructor = Vue.extend(Header)
      const vm = new Constructor({store, router}).$mount()
      expect(vm.$el.querySelector('#burger-menu.hidden')).to.not.be.null
      vm.toggleBurger()
      expect(vm.$el.querySelector('#burger-menu.hidden')).to.be.null
    })
  })
  describe('skipToContent', () => {
    it('should set focus on Guide Me button', (done) => {
      const Constructor = Vue.extend(Header)
      const vm = new Constructor({store, router}).$mount()
      vm.$router.push({name: 'disasterSearch'})
      Vue.nextTick(function () {
        expect(document.activeElement.nodeName).to.be.equal('BODY')
        const focusStub = sinon.stub(vm.$refs.guideMe, 'focus')
        vm.skipToContent()
        expect(focusStub.called).to.be.equal(true)
        focusStub.restore()
        done()
      })
    })
  })
})
