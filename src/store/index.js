import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    disasters: []
  },
  actions: {
    loadDisasterList: function ({ commit }, qry) {
      axios.get(`/api/disasters/${qry}`).then((response) => {
        commit('updateDisasterList', { list: response.data })
      }, (err) => {
        console.log(err)
      })
    }
  },
  mutations: {
    updateDisasterList: function (state, { list }) {
      // First let's just set the disasters, later we'll merge in the new ones
      state.disasters = list
      state.disasters.forEach(disaster => {
        disaster.currentSearchResult = true
      })
    },
    addToCurrentExtract: function (state, disasterToAdd) {
      state.disasters.forEach(disaster => {
        if (disaster.disasterNumber === disasterToAdd.disasterNumber) disaster.currentExtract = true
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
