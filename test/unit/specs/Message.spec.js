import 'es6-promise/auto' // eslint-disable-line
import Vue from 'vue' // eslint-disable-line
import '@/vue-mixins'
import Vuex from 'vuex' // eslint-disable-line
import sinon from 'sinon'
import Message from '@/components/Message' // eslint-disable-line
import _ from 'lodash' // eslint-disable-line

Vue.use(Vuex)
Vue.config.productionTip = false

describe('Message component', function () {
  let store
  let mutations
  let getters

  beforeEach(function () {
    getters = {
      defaultExtractName: function () { return '' },
      currentExtract: function () { return [] },
      savedExtracts: function () { return [] },
      newExtract: function () { return false },
      status: function () { return { type: 'error', msg: '' } }
    }
    mutations = {
      clearCurrentExtract: sinon.stub(),
      resetStatus: sinon.stub(),
      loadExtract: sinon.stub(),
      saveExtract: sinon.stub(),
      deleteExtract: sinon.stub()
    }

    store = new Vuex.Store({state: {}, mutations, getters})
  })

  it('should call resetStatus when the x is clicked (hideMessage called)', function (done) {
    const Constructor = Vue.extend(Message)
    const vm = new Constructor({store}).$mount()
    vm.hideMessage()
    Vue.nextTick(() => {
      expect(mutations.resetStatus.called).to.equal(true)
      done()
    })
  })

  describe('displayMessage', function () {
    it('should return false if status.type is normal', function () {
      getters.status = function () {
        return { type: 'normal' }
      }
      store = new Vuex.Store({state: {}, mutations, getters})
      const Constructor = Vue.extend(Message)
      const vm = new Constructor({store}).$mount()
      expect(vm.displayMessage).to.be.equal(false)
    })
    it('should return false if status.scope is not "extract"', function () {
      getters.status = function () {
        return { type: 'error', scope: 'app' }
      }
      store = new Vuex.Store({state: {}, mutations, getters})
      const Constructor = Vue.extend(Message)
      const vm = new Constructor({store}).$mount()
      expect(vm.displayMessage).to.be.equal(false)
    })
    it('should return true if status.scope is "extract" and locationOfMessage is "extract-message"', function () {
      getters.status = function () {
        return { type: 'error', scope: 'extract' }
      }
      store = new Vuex.Store({state: {}, getters})
      const Constructor = Vue.extend(Message)
      const vm = new Constructor({store}).$mount()
      vm.locationOfMessage = 'extract-message'
      expect(vm.displayMessage).to.be.equal(true)
    })
  })

  it('should return false if status.scope is not "app"', function () {
    getters.status = function () {
      return { type: 'error', scope: 'extract' }
    }
    store = new Vuex.Store({state: {}, mutations, getters})
    const Constructor = Vue.extend(Message)
    const vm = new Constructor({store}).$mount()
    expect(vm.displayMessage).to.be.equal(false)
  })
  it('should return true if status.scope is "app" and locationOfMessage is "app-message"', function () {
    getters.status = function () {
      return { type: 'error', scope: 'app' }
    }
    store = new Vuex.Store({state: {}, mutations, getters})
    const Constructor = Vue.extend(Message)
    const vm = new Constructor({store}).$mount()
    vm.locationOfMessage = 'app-message'
    expect(vm.displayMessage).to.be.equal(true)
  })
  it('hideMessage should call resetStatus on the store', function () {
    const Constructor = Vue.extend(Message)
    const vm = new Constructor({store}).$mount()
    vm.hideMessage()
    expect(mutations.resetStatus.called).to.be.equal(true)
  })
  // TODO: Put this in a helper
  function dispatchEvent ($el, name, opts) {
    var event = new Event(name, {
      'bubbles': true,
      'cancelable': true
    })
    if (opts && _.isObject(opts)) _.assign(event, opts)
    $el.dispatchEvent(event)
  }

  it('should call resetStatus when the x is clicked', function (done) {
    const Constructor = Vue.extend(Message)
    const vm = new Constructor({store}).$mount()
    Vue.nextTick(() => {
      let $message = vm.$el
      expect($message.style.display).to.be.equal('')
      let $x = vm.$el.querySelector('.clear-message')
      dispatchEvent($x, 'click')
      Vue.nextTick(() => {
        expect(mutations.resetStatus.called).to.equal(true)
        done()
      })
    })
  })
})
