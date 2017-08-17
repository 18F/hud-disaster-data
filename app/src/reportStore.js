import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import _ from 'lodash'
import es6Promise from 'es6-promise'
import magic from '@/bus'
es6Promise.polyfill()
Vue.use(Vuex)

/**
* Manages the state for client functions.
* @module reportStore
*/

export const mutations = {
/**
  Update the disaster number list with fresh data
  @function updateReportDisasterList
  @param {Array} list - A list of disasters
  */
  updateReportDisasterList: function (state, list) {
    state.disasterList = _.map(list, disaster => {
      let name = `${disaster.disasterType}-${disaster.disasterNumber}-${disaster.state}`
      return {name, code: name, data: disaster}
    })
  },

  setShowReport: function (state, value) {
    state.showReport = value
  },

  setShowReportSpinner: function (state, value) {
    state.showReportSpinner = value
  },

  updateLocaleList: function (state, list) {
    state.localeList = list
  },

  clearStore: function (state) {
    state.disasterList = []
    state.localeList = []
    state.stateFilter = null
    state.geographicLevel = null
    state.summaryRecords = []
    state.showReport = false
    state.showReportSpinner = false
  },

  setState: function (state, chosenState) {
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

  removeDisasterFilter: function (state, disaster) {
    disaster.selected = false
    let index = _.findIndex(state.disasterList, {code: disaster.code})
    state.disasterList.splice(index, 1, disaster)
  },

  removeLocaleFilter: function (state, locale) {
    locale.selected = false
    let index = _.findIndex(state.localeList, {code: locale.code})
    state.localeList.splice(index, 1, locale)
  },

  setSelectedGeographicLevel: function (state, selectedGeographicLevel) {
    state.geographicLevel = selectedGeographicLevel
  },

  updateReportData: function (state, list) {
    state.summaryRecords = list
  }
}
/**
These are the vuex actions
*/
export const actions = {
  loadReportDisasterList: function ({ commit }, qry) {
    axios.get(`/api/disasterquery/${qry}`).then(response => {
      commit('updateReportDisasterList', response.data)
      if (response.data && response.data.length === 0) {
        return commit('setStatus', {type: 'info', scope: 'app', msg: 'No results found!'})
      }
      magic.$emit('disastersLoaded')
      commit('resetStatus')
    }).catch(err => {
      console.log(`Error fetching disaster list: ${err}`)
      commit('setStatus', {type: 'error', scope: 'app', msg: 'HUD disaster data is unavailable at this time.  Try again later or contact your administrator.'})
    })
  },

  loadLocales: function ({ commit, state }, qry) {
    let localType = state.geographicLevel.code.toLowerCase()
    let querystring = `/api/locales/${state.stateFilter.code}/${localType}`
    axios.get(querystring).then(response => {
      commit('updateLocaleList', _.map(response.data, (r) => {
        let name = (localType === 'congrdist') ? `${r.substring(2, 4)}-${r.substring(4)}` : r
        return { code: r, name }
      }))
      if (response.data && response.data.length === 0) {
        return commit('setStatus', {type: 'info', scope: 'app', msg: 'No results found!'})
      }
      magic.$emit('localesLoaded')
      commit('resetStatus')
    }).catch(err => {
      console.log(`Error fetching locale list: ${err}`)
      commit('setStatus', {type: 'error', scope: 'app', msg: 'HUD locale data is unavailable at this time.  Try again later or contact your administrator.'})
    })
  },

  loadReportData: function ({ commit }, {summaryCols, allFilters}) {
  //  commit('setShowReport', false)
    let formattedQuery
    commit('setShowReportSpinner', true)
    _.forIn(allFilters, (value, key) => {
      if (formattedQuery) formattedQuery += `&${key}=${value.toString()}`
      else formattedQuery = `${key}=${value.toString()}`
    })
    axios.get(`/api/db?${formattedQuery}&summaryCols=${summaryCols}`).then(response => {
      commit('updateReportData', response.data)
      commit('setShowReport', true)
      commit('setShowReportSpinner', false)
      if (response.data && response.data.length === 0) {
        return commit('setStatus', {type: 'info', scope: 'app', msg: 'No results found!'})
      }
      commit('resetStatus')
    }).catch(err => {
      console.log(`Error fetching FEMA data: ${err}`)
      commit('setStatus', {type: 'error', scope: 'app', msg: 'FEMA report data is unavailable at this time.  Try again later or contact your administrator.'})
    })
  },

  setSelectedState: function ({commit}, qry) {
    commit('clearStore')
    commit('setState', qry)
  }
}

export const getters = {
  disasterNumberResults: state => {
    return state.disasterList
  },
  localeResults: state => {
    return state.localeList
  },
  showReport: state => {
    return state.showReport
  },
  showReportSpinner: state => {
    return state.showReportSpinner
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
    return state.geographicLevel || ''
  },
  summaryRecords: state => {
    return state.summaryRecords
  },
  stateUrlParameters: (state, getters) => {
    if (!state.stateFilter) return ''
    var parms = `?stateFilter=${state.stateFilter.code}`
    if (getters.geographicLevel) parms += `&geographicLevel=${getters.geographicLevel.code}`
    if (getters.localeFilter.length > 0) parms += `&localeFilter=${_.map(getters.localeFilter, l => l.code).join(',')}`
    if (getters.disasterFilter.length > 0) parms += `&disasterFilter=${_.map(getters.disasterFilter, d => d.code).join(',')}`
    return parms
  }
}

const reportStore = {
  state: {
    disasterList: [],
    geographicLevel: null,
    localeList: [],
    stateFilter: null,
    summaryRecords: [],
    showReport: false,
    showReportSpinner: false
  },
  actions,
  mutations,
  getters
}

export default reportStore
