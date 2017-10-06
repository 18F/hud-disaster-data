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
    it('should set showSelectionList to true and set focus', function (done) {
      const Constructor = Vue.extend(ValueSelector)
      const vm = new Constructor().$mount()
      const focus = sinon.stub()
      const that = {
        showSelectionList: false,
        $nextTick: cb => cb(),
        $refs: {summarySelectionList: {focus}}
      }
      const toggleSummarySelection = vm.$options.methods.toggleSummarySelection
      toggleSummarySelection.call(that)
      expect(that.showSelectionList).to.be.equal(true)
      expect(focus.called).to.be.equal(true)
      done()
    })

    it('should set showSelectionList to false but not set focus', function (done) {
      const Constructor = Vue.extend(ValueSelector)
      const vm = new Constructor().$mount()
      const focus = sinon.stub()
      const that = {
        showSelectionList: true,
        $nextTick: cb => cb(),
        $refs: {summarySelectionList: {focus}}
      }
      const toggleSummarySelection = vm.$options.methods.toggleSummarySelection
      toggleSummarySelection.call(that)
      expect(that.showSelectionList).to.be.equal(false)
      expect(focus.called).to.be.equal(false)
      done()
    })
  })

  describe('hideSummarySelection', function () {
    it('should set showSelectionList to false when clicking outside summary-selection-list', function (done) {
      const Constructor = Vue.extend(ValueSelector)
      const vm = new Constructor().$mount()
      const e = {relatedTarget: document.createElement('div')}
      const contains = sinon.stub().callsFake(() => false)
      const that = {
        $refs: {summarySelectionList: {contains}},
        showSelectionList: true
      }
      const hideSummarySelection = vm.$options.methods.hideSummarySelection
      hideSummarySelection.call(that, e)
      expect(that.showSelectionList).to.be.equal(false)
      expect(contains.called).to.be.equal(true)
      done()
    })

    it('should not set showSelectionList to false when it is true and clicking on toggleSummarySelectionButton', function (done) {
      const Constructor = Vue.extend(ValueSelector)
      const vm = new Constructor().$mount()
      const fakeElement = document.createElement('div')
      const e = {relatedTarget: fakeElement}
      const contains = sinon.stub().callsFake(() => false)
      const that = {
        $refs: {
          summarySelectionList: {contains},
          toggleSummarySelectionButton: fakeElement
        },
        showSelectionList: true
      }
      const hideSummarySelection = vm.$options.methods.hideSummarySelection
      hideSummarySelection.call(that, e)
      expect(that.showSelectionList).to.be.equal(true)
      expect(contains.called).to.be.equal(false)
      done()
    })

    it('should not set showSelectionList to false when it is true and clicking inside summary-selection-list', function (done) {
      const Constructor = Vue.extend(ValueSelector)
      const vm = new Constructor().$mount()
      const fakeElement = document.createElement('div')
      const e = {relatedTarget: fakeElement}
      const contains = sinon.stub().callsFake(() => true)
      const that = {
        $refs: {
          summarySelectionList: {contains}
        },
        showSelectionList: true
      }
      const hideSummarySelection = vm.$options.methods.hideSummarySelection
      hideSummarySelection.call(that, e)
      expect(that.showSelectionList).to.be.equal(true)
      expect(contains.called).to.be.equal(true)
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

  describe('selectionListExpanded', function () {
    it(`should return 'expanded' if showSelectionList is true`, function (done) {
      const Constructor = Vue.extend(ValueSelector)
      const vm = new Constructor().$mount()
      const that = {showSelectionList: true}
      expect(vm.$options.computed.selectionListExpanded.call(that)).to.be.equal('expanded')
      done()
    })
    it(`should return false if showSelectionList is false`, function (done) {
      const Constructor = Vue.extend(ValueSelector)
      const vm = new Constructor().$mount()
      const that = {showSelectionList: false}
      expect(vm.$options.computed.selectionListExpanded.call(that)).to.be.equal(false)
      done()
    })
  })
})
