import 'es6-promise/auto' // eslint-disable-line
import Vue from 'vue' // eslint-disable-line
import '@/vue-mixins'
import InputSelect from '@/components/InputSelect' // eslint-disable-line
import _ from 'lodash' // eslint-disable-line
import should from 'should'
import sinon from 'sinon'

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
    it('should return items that match the queryValue and selected is not true', function (done) {
      vm.items = [{code: 'alpha', name: 'alpha', selected: false}, {code: 'beta', name: 'beta'}, {code: 'gamma', name: 'gamma'}]
      vm.queryValue = 'lph'
      Vue.nextTick(() => {
        should(vm.unMatchedItems[0].code).be.equal('alpha')
        done()
      })
    })

    it('should return items that match the queryValue and selected is true', function (done) {
      vm.items = [{code: 'alpha', name: 'alpha', selected: true}, {code: 'beta', name: 'beta'}, {code: 'gamma', name: 'gamma'}]
      vm.queryValue = 'lph'
      Vue.nextTick(() => {
        should(vm.unMatchedItems).be.empty()
        done()
      })
    })
  })

  describe('update', function () {
    it('should return item at listIndex position if there is no queryValue', function () {
      vm.items = [{code: 'alpha', name: 'alpha'}, {code: 'beta', name: 'beta'}, {code: 'gamma', name: 'gamma'}]
      vm.listIndex = 1
      vm.update()
      should(vm.matchingItems[0].code).be.equal('beta')
    })

    it('should set matching items to be item at listIndex position if there is queryValue, and set queryValue to item name', function () {
      vm.items = [{code: 'alpha', name: 'alpha', selected: true}, {code: 'beta', name: 'beta'}, {code: 'gamma', name: 'gamma'}]
      vm.listIndex = 1
      vm.queryValue = 'et'
      vm.matchingItems = [{code: 'alpha', name: 'alpha', selected: true}, {code: 'beta', name: 'beta'}]
      vm.update()
      should(vm.matchingItems[0].name).be.equal('beta')
      should(vm.queryValue).be.equal('beta')
    })
    it('should call $emit for clear if there is no queryValue and listIndex is -1', function () {
      let emitStub = sinon.stub(vm, '$emit')
      vm.listIndex = -1
      vm.queryValue = null
      vm.update()
      should(emitStub.called).be.equal(true)
      emitStub.restore()
    })

    it('should call $emit for clear if there is a queryValue and matchingItems is not empty and listIndex is -1', function () {
      let emitStub = sinon.stub(vm, '$emit')
      vm.listIndex = -1
      vm.queryValue = 'something'
      vm.matchingItems = [ 1, 2 ]
      vm.update()
      should(emitStub.called).be.equal(true)
      emitStub.restore()
    })

    it('should call $emit for clear if there is a queryValue and matchingItems has length of 0 and listIndex is -1', function () {
      let emitStub = sinon.stub(vm, '$emit')
      vm.listIndex = -1
      vm.queryValue = 'something'
      vm.matchingItems = []
      vm.update()
      should(emitStub.called).be.equal(true)
      emitStub.restore()
    })

    it('should call $emit for clear if there is a queryValue and matchingItems has length of 1 and listIndex is -1', function () {
      let selectStub = sinon.stub(vm, 'select')
      vm.listIndex = -1
      vm.queryValue = 'something'
      vm.matchingItems = [ 1 ]
      vm.update()
      should(selectStub.called).be.equal(true)
      selectStub.restore()
    })
  })

  describe('checkForReset', function () {
    it('should reset things if there is no queryValue and one or more items', function () {
      vm.items = [{code: 'alpha', name: 'alpha'}, {code: 'beta', name: 'beta'}, {code: 'gamma', name: 'gamma'}]
      vm.matchingItems = [{code: 'beta', name: 'beta'}]
      vm.listIndex = 1
      vm.queryValue = ''
      vm.checkForReset()
      should(vm.matchingItems.length).be.equal(vm.items.length)
      should(vm.matchingItems[0].code).be.equal(vm.items[0].code)
      should(vm.listIndex).be.equal(-1)
    })
  })

  describe('toggleDropdown', function () {
    it('should change contentVisible from false to true', function () {
      vm.contentVisible = false
      vm.toggleDropdown()
      should(vm.contentVisible).be.equal(true)
    })
  })

  describe('getMatchingItems', function () {
    it('should return items if queryValue is null', function () {
      vm.items = ['a', 'b']
      should(vm.getMatchingItems()).be.equal(vm.items)
    })
    it('should include items that contain queryValue ignoring case', function () {
      vm.items = [{name: 'one'}, {name: 'TWo'}, {name: 'oNeTwo'}]
      const matchingItems = vm.getMatchingItems('one')
      should(matchingItems[0]).be.equal(vm.items[0])
      should(matchingItems[1]).be.equal(vm.items[2])
    })
  })

  describe('inputReaction', function () {
    it('should set contentVisible to true if enter (13) was pushed, and return a true value', function () {
      let event = {type: 'keydown', which: 13, keyCode: 13, preventDefault: () => {}}
      vm.contentVisible = true
      let returnValue = vm.inputReaction(event)
      should(vm.contentVisible).be.equal(false)
      should(returnValue).be.equal(true)
    })

    it('should set contentVisible to false if something other than enter (13) was pushed, and return a true value', function () {
      let event = {type: 'keydown', which: 50, keyCode: 50, preventDefault: () => {}}
      vm.contentVisible = false
      let returnValue = vm.inputReaction(event)
      should(vm.contentVisible).be.equal(true)
      should(returnValue).be.equal(true)
    })

    it('should not change contentVisible something other numeric, alpha or special key was pushed, and return a false value', function () {
      let event = {type: 'keydown', which: 95, keyCode: 95, preventDefault: () => {}}
      vm.contentVisible = 'walrus'
      let returnValue = vm.inputReaction(event)
      should(vm.contentVisible).be.equal('walrus')
      should(returnValue).be.equal(false)
    })

    it('should return a true value, and not change contentVisible if event type was not keydown', function () {
      let event = {type: 'keystone', which: 95, keyCode: 95, preventDefault: () => {}}
      vm.contentVisible = 'walrus'
      let returnValue = vm.inputReaction(event)
      should(vm.contentVisible).be.equal('walrus')
      should(returnValue).be.equal(true)
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

  describe('selectDown', function () {
    it('should increment listIndex by one if current listIndex is less than length of items', function () {
      vm.items = [{name: 'one'}, {name: 'TWo'}, {name: 'oNeTwo'}]
      vm.listIndex = 1
      vm.selectDown()
      should(vm.listIndex).be.equal(2)
    })
  })

  describe('selectUp', function () {
    it('should decrement listIndex by one if current listIndex > 0', function () {
      vm.listIndex = 1
      vm.selectUp()
      should(vm.listIndex).be.equal(0)
    })
  })
})
