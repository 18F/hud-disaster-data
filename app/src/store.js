import Vuex from 'vuex'
import searchStore from '@/searchStore'
import reportStore from '@/reportStore'

/**
* Manages the state for each of the modules.
* @module store
*/

const store = new Vuex.Store({
  modules: {
    searchStore,
    reportStore
  },
  state: {
    user: null
  },
  mutations: {
    setUser: (state, user) => {
      state.user = user
    }
  },
  getters: {
    user: state => {
      return state.user
    }
  }
})

export default store
