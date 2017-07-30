import 'es6-promise/auto' // eslint-disable-line
import Vue from 'vue' // eslint-disable-line
import '@/vue-mixins'
// import sinon from 'sinon'
import InputSelect from '@/components/InputSelect' // eslint-disable-line
import _ from 'lodash' // eslint-disable-line
import should from 'should'

Vue.config.productionTip = false

describe('InputSelect', function () {
  describe('getMatchingItems', function () {
    it('should return items if query is null', function () {
      const Constructor = Vue.extend(InputSelect)
      const vm = new Constructor().$mount()
      vm.items = [1, 2]
      should(vm.getMatchingItems()).be.equal(vm.items)
    })
    it('should include items that contain query ignoring case', function () {
      const Constructor = Vue.extend(InputSelect)
      const vm = new Constructor().$mount()
      vm.items = [{name: 'one'}, {name: 'TWo'}, {name: 'oNeTwo'}]
      const matchingItems = vm.getMatchingItems('one')
      should(matchingItems[0]).be.equal(vm.items[0])
      should(matchingItems[1]).be.equal(vm.items[2])
    })
  })
})
