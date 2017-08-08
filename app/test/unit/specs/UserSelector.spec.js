/* global describe, it, expect */
import 'es6-promise/auto' // eslint-disable-line
import Vue from 'vue' // eslint-disable-line
import '@/vue-mixins'
import sinon from 'sinon'
import UserSelector from '@/components/UserSelector'
import router from '@/router'
import store from '@/store'
// eslint-disable-line
describe('SelectUser', () => {
  describe('toggleUserState', () => {
    it('should change showUserSelection from false to true', () => {
      const Constructor = Vue.extend(UserSelector)
      const vm = new Constructor({store, router}).$mount()
      expect(vm.showUserSelection).to.be.equal(false)
      vm.toggleUserSelector()
      expect(vm.showUserSelection).to.be.equal(true)
    })
  })

  describe('selectUser', () => {
    it('should set showUserSelection to false and call commit', () => {
      const Constructor = Vue.extend(UserSelector)
      const vm = new Constructor({store, router}).$mount()
      var commitSpy = sinon.stub(vm.$store, 'commit')
      vm.showUserSelection = true
      expect(vm.showUserSelection).to.be.equal(true)
      vm.selectUser()
      expect(vm.showUserSelection).to.be.equal(false)
      commitSpy.restore()
    })
  })
})
