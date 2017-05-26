import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import _ from 'lodash'

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
    toggleCurrentExtract: function (state, disasterToToggle) {
      let index = state.disasters.indexOf(disasterToToggle)
      disasterToToggle = _.clone(disasterToToggle)
      disasterToToggle.currentExtract = !disasterToToggle.currentExtract
      state.disasters.splice(index, 1, disasterToToggle)
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
