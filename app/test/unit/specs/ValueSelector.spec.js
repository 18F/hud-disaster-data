import 'es6-promise/auto' // eslint-disable-line
import Vue from 'vue' // eslint-disable-line
import '@/vue-mixins'
import Vuex from 'vuex' // eslint-disable-line
import ValueSelector from '@/components/ValueSelector' // eslint-disable-line
import sinon from 'sinon'

Vue.config.productionTip = false
Vue.config.silent = true

describe('ValueSelector component', function () {
  describe('toggleSummarySelection', function () {
    it('should set showSelectionList to true', function (done) {
      const Constructor = Vue.extend(ValueSelector)
      const vm = new Constructor().$mount()
      vm.showSelectionList = false
      vm.toggleSummarySelection()
      expect(vm.showSelectionList).to.be.equal(true)
      done()
    })
  })

  describe('toggleColumnSelection', function () {
    it('should set column.selected to true if it was false', function (done) {
      const Constructor = Vue.extend(ValueSelector)
      const vm = new Constructor().$mount()
      let column = {selected: false}
      const commit = sinon.spy()
      const that = {$store: {commit}}
      const toggleColumnSelection = vm.$options.methods.toggleColumnSelection
      toggleColumnSelection.call(that, column)
      expect(commit.calledWith('setSummaryColumn')).to.be.equal(true)
      expect(column.selected).to.be.equal(true)
      done()
    })
  })

  describe('toggleSelectAll', function () {
    it('should set column.selected to true for all summaryColumns if allSelected is false', function (done) {
      const Constructor = Vue.extend(ValueSelector)
      const vm = new Constructor().$mount()
      let summaryColumns = [{selected: false}, {selected: false}, {selected: false}]
      const commit = sinon.spy()
      const that = {allSelected: false, $store: {commit, getters: {summaryColumns}}}
      const toggleSelectAll = vm.$options.methods.toggleSelectAll
      toggleSelectAll.call(that)
      expect(commit.calledThrice).to.be.equal(true)
      expect(summaryColumns[0].selected).to.be.equal(true)
      expect(summaryColumns[1].selected).to.be.equal(true)
      expect(summaryColumns[2].selected).to.be.equal(true)
      done()
    })
  })
})
