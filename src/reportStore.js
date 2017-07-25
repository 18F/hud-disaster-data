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
  @function updateDisasterList
  @param {Array} list - A list of disasters
  */
  updateDisasterList: function (state, list) {
    state.disasterList = _.map(list, disaster => {
      let name = `${disaster.disasterType}-${disaster.disasterNumber}-${disaster.state}`
      return {name, code: name, data: disaster}
    })
  },

  updateLocaleList: function (state, list) {
    state.localeList = list
  },

  clearState: function (state) {
    state.disasterList = []
    state.localeList = []
    state.stateFilter = null
    state.geographicLevel = 'City'
  },

  setSelectedState: function (state, chosenState) {
    state.stateFilter = chosenState
  },

  addDisasterFilter: function (state, chosenDisaster) {
    chosenDisaster.selected = true
    let index = state.disasterList.indexOf(chosenDisaster)
    state.disasterList.splice(index, 1, chosenDisaster)
  },

  addLocaleFilter: function (state, chosenLocale) {
    chosenLocale.selected = true
    let index = state.localeList.indexOf(chosenLocale)
    state.localeList.splice(index, 1, chosenLocale)
  },

  setSelectedGeographicLevel: function (state, selectedGeographicLevel) {
    state.geographicLevel = selectedGeographicLevel
  }
}
/**
These are the vuex actions
*/
export const actions = {
  loadReportDisasterList: function ({ commit }, qry) {
    commit('setSearchLoading', true)
    axios.get(`/api/disasterquery/${qry}`).then((response) => {
      commit('updateDisasterList', response.data)
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
    return state.disasterList
  },
  localeResults: state => {
    return state.localeList
  },
  stateFilter: state => {
    return state.stateFilter
  },
  localeFilter: state => {
    return _.filter(state.localeList, 'selected')
  },
  disasterFilter: state => {
    return _.filter(state.disasterList, 'selected')
  },
  geographicLevel: state => {
    return state.geographicLevel
  }
}

const reportStore = {
  state: {
    disasterList: [],
    geographicLevel: { code: 'City', name: 'City' },
    localeList: [],
    stateFilter: null
  },
  actions,
  mutations,
  getters
}

export default reportStore
