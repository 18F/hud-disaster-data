import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import _ from 'lodash'
import es6Promise from 'es6-promise'
// import magic from '@/bus'
es6Promise.polyfill()
Vue.use(Vuex)
/**
* Manages the state for client functions.
* @module reportStore
*/

export const mutations = {
/**
  Update the disaster number list with fresh data
  @function updateDisasterNumberList
  @param {Array} list - A list of disasters
  */
  updateDisasterNumberList: function (state, list) {
    state.disasterNumbers = list
  },

  updateLocaleList: function (state, list) {
    state.localeList = list
  },

  clearState: function (state) {
    state.disasterNumbers = []
    state.localeList = []
    state.stateFilter = null
    state.geographicLevel = 'City'
    state.localeFilter = []
    state.disasterFilter = []
  },

  setSelectedState: function (state, chosenState) {
    state.stateFilter = chosenState
  },

  setDisasterFilter: function (state, chosenDisaster) {
    state.disasterFilter.push(chosenDisaster)
  },

  setLocaleFilter: function (state, chosenLocale) {
    state.localeFilter.push(chosenLocale)
  },

  setSelectedGeographicLevel: function (state, selectedGeographicLevel) {
    state.geographicLevel = selectedGeographicLevel
  }
}
/**
These are the vuex actions
*/
export const actions = {
  loadDisasterNumbers: function ({ commit }, qry) {
    commit('setSearchLoading', true)
    axios.get(`/api/disasterquery/${qry}`).then((response) => {
      commit('updateDisasterNumberList', response.data)
      if (response.data && response.data.length === 0) {
        return commit('setStatus', {type: 'info', scope: 'app', msg: 'No results found!'})
      }
      commit('resetStatus')
    }, (err) => {
      console.log(`Error fetching disaster list: ${err}`)
      commit('setStatus', {type: 'error', scope: 'app', msg: 'HUD disaster data is unavailable at this time.  Try again later or contact your administrator.'})
    })
  },

  loadLocales: function ({ commit, state }, qry) {
    commit('setSearchLoading', true)
    let querystring = `/api/localequery/${qry}`
    if (state.geographicLevel) querystring += `?level=${state.geographicLevel.name.toLowerCase()}`
    axios.get(querystring).then((response) => {
      commit('updateLocaleList', response.data)
      if (response.data && response.data.length === 0) {
        return commit('setStatus', {type: 'info', scope: 'app', msg: 'No results found!'})
      }
    })
  }
}

export const getters = {
  disasterNumberResults: state => {
    return _.map(state.disasterNumbers, disaster => `${disaster.disasterType}-${disaster.disasterNumber}-${disaster.state}`)
  },
  localeResults: state => {
    return state.localeList
  },
  stateFilter: state => {
    return state.stateFilter
  },
  localeFilter: state => {
    return state.localeFilter
  },
  disasterFilter: state => {
    return state.disasterFilter
  },
  geographicLevel: state => {
    return state.geographicLevel
  }
}

const reportStore = {
  state: {
    disasterNumbers: [],
    geographicLevel: 'City',
    localeList: [],
    stateFilter: null,
    localeFilter: [],
    disasterFilter: []
  },
  actions,
  mutations,
  getters
}

export default reportStore
