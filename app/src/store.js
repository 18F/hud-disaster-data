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
    userStatesViewable: null
  },
  mutations: {
    setUserStatesViewable: (state, stateValue) => {
      state.userStatesViewable = stateValue
    }
  },
  getters: {
    userStatesViewable: state => {
      return state.userStatesViewable
    }
  }
})

export default store
