import Vue from 'vue'
import store from '@/store'

describe('store', function () {
  it('should set userStatesViewable to passed in value', function () {
    const vm = new Vue({
      store,
      render: function (createElement) {
        return createElement('div')
      },
      data: function () { return {userStatesViewable: 'something'} }
    }).$mount()
    vm.$store.commit('setUserStatesViewable', 'IA')
    expect(vm.$store.getters.userStatesViewable).to.be.equal('IA')
  })
})
