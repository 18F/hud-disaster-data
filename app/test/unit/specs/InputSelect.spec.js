import 'es6-promise/auto' // eslint-disable-line
import Vue from 'vue' // eslint-disable-line
import '@/vue-mixins'
// import sinon from 'sinon'
import InputSelect from '@/components/InputSelect' // eslint-disable-line
import _ from 'lodash' // eslint-disable-line
import should from 'should'

Vue.config.productionTip = false

describe('InputSelect', function () {
  let Constructor
  let vm
  beforeEach(function () {
    Constructor = Vue.extend(InputSelect)
    vm = new Constructor().$mount()
  })

  describe('hasItems', function (done) {
    it('should return true if there are items', function (done) {
      vm.items = ['a', 'b']
      Vue.nextTick(() => {
        should(vm.hasItems).be.equal(true)
        done()
      })
    })
  })

  describe('isEmpty', function (done) {
    it('should return true if there are no items', function (done) {
      vm.items = []
      Vue.nextTick(() => {
        should(vm.isEmpty).be.equal(true)
        done()
      })
    })
  })

  describe('unMatchedItems', function (done) {
    it('should return items that match the query and selected is not true', function (done) {
      vm.items = [{code: 'alpha', name: 'alpha', selected: false}, {code: 'beta', name: 'beta'}, {code: 'gamma', name: 'gamma'}]
      vm.query = 'lph'
      Vue.nextTick(() => {
        should(vm.unMatchedItems[0].code).be.equal('alpha')
        done()
      })
    })

    it('should return items that match the query and selected is true', function (done) {
      vm.items = [{code: 'alpha', name: 'alpha', selected: true}, {code: 'beta', name: 'beta'}, {code: 'gamma', name: 'gamma'}]
      vm.query = 'lph'
      Vue.nextTick(() => {
        should(vm.unMatchedItems).be.empty()
        done()
      })
    })
  })

  describe('getMatchingItems', function () {
    it('should return items if query is null', function () {
      vm.items = ['a', 'b']
      should(vm.getMatchingItems()).be.equal(vm.items)
    })
    it('should include items that contain query ignoring case', function () {
      vm.items = [{name: 'one'}, {name: 'TWo'}, {name: 'oNeTwo'}]
      const matchingItems = vm.getMatchingItems('one')
      should(matchingItems[0]).be.equal(vm.items[0])
      should(matchingItems[1]).be.equal(vm.items[2])
    })
  })
  describe('select', function () {
    it('should deselect the item if it\'s already selected', function () {
      let item = {selected: true, name: 'Colorado', code: 'CO'}
      should.exist(item.selected)
      vm.select(item)
      should.not.exist(item.selected)
    })
  })
})
