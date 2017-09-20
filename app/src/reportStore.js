import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import _ from 'lodash'
import es6Promise from 'es6-promise'
// import magic from '@/bus'
import numeral from 'numeral'
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
    console.log(`inside updateReportDisasterList with ${JSON.stringify(_.map(list, d => d.disasterNumber))}`)
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

  initStore: function (state, stateVal) {
    console.log('inside initStore with: ' + JSON.stringify(stateVal))
    state.disasterList = []
    state.localeList = []
    state.geographicLevel = null
    state.summaryRecords = []
    state.showReport = false
    state.showReportSpinner = false
    state.stateFilter = stateVal
  },

  setState: function (state, chosenState) {
    state.stateFilter = chosenState
  },

  addDisasterFilter: function (state, chosenDisaster) {
    console.log('inside addDisasterFilter')
    chosenDisaster.selected = true
    let index = state.disasterList.indexOf(chosenDisaster)
    state.disasterList.splice(index, 1, chosenDisaster)
  },

  addLocaleFilter: function (state, chosenLocale) {
    console.log('inside addLocaleFilter')
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

  setLocalesFilter: function (state, locales) {
    console.log(`inside setLocalesFilter`)
    _.map(locales, l => {
      let chosenLocale = {code: l, name: l}
      let index = _.findIndex(state.localeList, chosenLocale)
      chosenLocale.selected = true
      state.localeList.splice(index, 1, chosenLocale)
    })
  },

  setDisastersFilter: function (state, disasters) {
    console.log(`inside setDisastersFilter`)
    _.map(disasters, d => {
      let chosenDisaster = {code: d, name: d}
      let index = _.findIndex(state.disasterList, chosenDisaster)
      chosenDisaster.selected = true
      state.disasterList.splice(index, 1, chosenDisaster)
    })
  },

  updateReportData: function (state, list) {
    state.summaryRecords = list
  },

  setSummaryColumn: function (state, column) {
    let index = _.findIndex(state.summaryColumns, ['name', column.name])
    state.summaryColumns.splice(index, 1, column)
  }
}
/**
These are the vuex actions
*/
export const actions = {
  loadFilteredDisasters: function ({ commit, state }) {
    return new Promise((resolve, reject) => {
      let stateCode = state.stateFilter ? state.stateFilter.code : null
      if (!stateCode) return commit('setStatus', {type: 'error', scope: 'app', msg: 'State not specified!'})
      let localeType = state.geographicLevel ? state.geographicLevel.code.toLowerCase() : null
      let locales = state.localeList.length > 0 ? _.map(_.filter(state.localeList, 'selected'), locale => locale.name).join(',') : null
      let query = ''
      if (stateCode && localeType && locales) query = `?${localeType}=${encodeURI(locales)}`
      let querystring = `/api/states/${stateCode}/disasters${query}`

      return axios.get(querystring).then(response => {
        console.log(`calling updateReportDisasterList with ${JSON.stringify(_.map(response.data, d => d.disasterNumber))}`)
        commit('updateReportDisasterList', response.data)
        if (response.data && response.data.length === 0) {
          return commit('setStatus', {type: 'info', scope: 'app', msg: 'No results found!'})
        }
        commit('resetStatus')
        resolve('completed successfully')
      }).catch(err => {
        console.log(`Error fetching disaster list: ${err}`)
        commit('setStatus', {type: 'error', scope: 'app', msg: 'HUD disaster data is unavailable at this time.  Try again later or contact your administrator.'})
        reject(err)
      })
    })
  },

  loadLocales: function ({ commit, state }) {
    return new Promise((resolve, reject) => {
      console.log(`inside loadLocales with state.stateFilter: ${JSON.stringify(state.stateFilter)}`)
      let localType = state.geographicLevel.code.toLowerCase()
      let querystring = `/api/states/${state.stateFilter.code}/${localType}`
      return axios.get(querystring).then(response => {
        commit('updateLocaleList', _.map(response.data, (r) => {
          let name = (localType === 'congrdist') ? `${r.substring(2, 4)}` : r
          return { code: r, name }
        }))
        if (response.data && response.data.length === 0) {
          return commit('setStatus', {type: 'info', scope: 'app', msg: 'No results found!'})
        }
        commit('resetStatus')
        resolve('completed successfully')
      }).catch(err => {
        console.log(`Error fetching locale list: ${err}`)
        commit('setStatus', {type: 'error', scope: 'app', msg: 'HUD locale data is unavailable at this time.  Try again later or contact your administrator.'})
        reject(err)
      })
    })
  },

  loadReportData: function ({ commit }, allFilters) {
    return new Promise((resolve, reject) => {
      let formattedQuery
      commit('setShowReportSpinner', true)
      _.forIn(allFilters, (value, key) => {
        if (formattedQuery) formattedQuery += `&${key}=${value.toString()}`
        else formattedQuery = `${key}=${value.toString()}`
      })
      return axios.get(`/api/applicants/summary?${formattedQuery}`).then(response => {
        commit('updateReportData', response.data)
        commit('setShowReport', true)
        commit('setShowReportSpinner', false)
        if (response.data && response.data.length === 0) {
          return commit('setStatus', {type: 'info', scope: 'app', msg: 'No results found!'})
        }
        commit('resetStatus')
        resolve('completed successfully')
      }).catch(err => {
        console.log(`Error fetching FEMA data: ${err}`)
        commit('setStatus', {type: 'error', scope: 'app', msg: 'FEMA report data is unavailable at this time.  Try again later or contact your administrator.'})
        reject(err)
      })
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
    const numericConversionList = {
      numberOfRecords: {text: 'Number of households affected', format: '0,0'},
      total_dmge_amnt: {text: 'Total FEMA verified real property loss', format: '$0,0.00'},
      hud_unmt_need_amnt: {text: 'HUD estimated unmet need', format: '$0,0.00'}
    }
    let newSummaryRecord = {}
    for (var key in state.summaryRecords) {
      let newKey = numericConversionList[key] ? numericConversionList[key].text : key
      let format = numericConversionList[key] ? numericConversionList[key].format : null
      let value = numericConversionList[key] ? Number(state.summaryRecords[key]) : state.summaryRecords[key]
      if (format) newSummaryRecord[newKey] = numeral(value).format(format)
      else newSummaryRecord[newKey] = value
    }

    return newSummaryRecord
  },

  summaryColumns: state => {
    return state.summaryColumns
  },

  selectedSummaryColumns: state => {
    return _.map(_.filter(state.summaryColumns, 'selected'), c => c.name)
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
    showReportSpinner: false,
    summaryColumns: [
      { name: 'hshd_size_cnt', selected: false },
      { name: 'dpndnt_cnt', selected: false },
      { name: 'incm_amnt', selected: false },
      { name: 'hzrd_insnc_amnt', selected: false },
      { name: 'flood_insnc_amnt', selected: false },
      { name: 'other_insnc_amnt', selected: false },
      { name: 'real_prop_loss_amnt', selected: false },
      { name: 'flood_dmge_amnt', selected: false },
      { name: 'fndtn_dmge_amnt', selected: false },
      { name: 'roof_dmge_amnt', selected: false },
      { name: 'tmp_shltr_rcvd_amnt', selected: false },
      { name: 'rent_asstn_amnt', selected: false },
      { name: 'repr_amnt', selected: false },
      { name: 'rpmt_amnt', selected: false },
      { name: 'sba_rcvd_amnt', selected: false },
      { name: 'prsnl_prop_asstn_amnt', selected: false },
      { name: 'other_asstn_amnt', selected: false },
      { name: 'total_dmge_amnt', selected: true },
      { name: 'total_asstn_amnt', selected: false },
      { name: 'hud_unmt_need_amnt', selected: true }
    ]
  },
  actions,
  mutations,
  getters
}

export default reportStore
