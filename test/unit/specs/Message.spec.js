import 'es6-promise/auto' // eslint-disable-line
import Vue from 'vue' // eslint-disable-line
import '@/vue-mixins'
import Vuex from 'vuex' // eslint-disable-line
import sinon from 'sinon'
import Message from '@/components/Message'

Vue.use(Vuex)
Vue.config.productionTip = false

describe('Message', () => {
  let store
  let mutations
  let getters

  beforeEach(function () {
    getters = {
      defaultExtractName: function () { return '' },
      currentExtract: function () { return [] },
      savedExtracts: function () { return [] },
      newExtract: function () { return false },
      status: function () { return { type: 'error', message: '' } }
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
