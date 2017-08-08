import Vue from 'vue'
import store from '@/store'

describe('store', function () {
  it('should set user to passed in value', function (done) {
    const vm = new Vue({
      store,
      render: function (createElement) {
        return createElement('div')
      },
      data: function () { return {user: 'something'} }
    }).$mount()
    let user = {name: 'test user'}
    vm.$store.commit('setUser', user)
    Vue.nextTick(() => {
      expect(vm.$store.getters.user).to.be.equal(user)
      done()
    })
  })
})
