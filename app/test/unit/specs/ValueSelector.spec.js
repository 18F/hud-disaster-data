import 'es6-promise/auto' // eslint-disable-line
import Vue from 'vue' // eslint-disable-line
import '@/vue-mixins'
import Vuex from 'vuex' // eslint-disable-line
import ValueSelector from '@/components/ValueSelector' // eslint-disable-line

Vue.config.productionTip = false

describe('ValueSelector component', function () {
  describe('toggleSummarySelection', function () {
    it('should set showSelectionList to true', function (done) {
      let Constructor = Vue.extend(ValueSelector)
      let vm = new Constructor().$mount()
      vm.showSelectionList = false
      vm.toggleSummarySelection()
      expect(vm.showSelectionList).to.be.equal(true)
      done()
    })
  })
})
