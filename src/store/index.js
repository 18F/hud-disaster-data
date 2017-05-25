import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    disasters: []
  },
  actions: {
    LOAD_DISASTERS_LIST: function ({ commit }, qry) {
      axios.get(`/api/disasters/${qry}`).then((response) => {
        commit('UPDATE_DISASTERS_LIST', { list: response.data })
      }, (err) => {
        console.log(err)
      })
    }
  },
  mutations: {
    UPDATE_DISASTERS_LIST: function (state, { list }) {
      // First let's just set the disasters, later we'll merge in the new ones
      state.disasters = list
      state.disasters.forEach(disaster => {
        disaster.currentSearchResult = true
      })
    }
  },
  getters: {
    currentSearchResult: state => {
      return state.disasters.filter(disaster => disaster.currentSearchResult)
    },
    currentExtract: state => {
      return state.disasters.filter(disaster => disaster.currentExtract)
    }
  }
})
export default store
