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
* @module searchStore
*/

function findDisaster (list, disaster) {
  return _.find(list, {disasterType: disaster.disasterType, disasterNumber: disaster.disasterNumber, state: disaster.state})
}

function loadSavedExtracts () {
  let item = localStorage.getItem('saved-extracts')
  if (!item) return []
  return JSON.parse(item)
}

function storeSavedExtracts (extracts) {
  localStorage.setItem('saved-extracts', JSON.stringify(extracts))
}

export const mutations = {
  /**
  Saves the current list of select disasters to storage
  @function saveExtract
  @param {String} name - The name for the list being saved
  */
  saveExtract: function (state, name) {
    if (_.find(state.savedExtracts, { name })) {
      state.status = { type: 'error', scope: 'extract', message: 'The list name "' + name + '" already exists' }
      return
    }
    if (!name || name === '') {
      state.status = { type: 'error', scope: 'extract', message: 'The list name can not be empty' }
      return
    }
    state.savedExtracts.push({
      name,
      disasters: _.map(state.currentExtract, function (disaster) {
        return `${disaster.disasterType}-${disaster.disasterNumber}-${disaster.state}`
      })
    })
    storeSavedExtracts(state.savedExtracts)
    state.newExtract = false
    state.status = { type: 'success', scope: 'extract', message: 'The list “' + name + '” has been saved' }
  },
  /**
  Delete a saved disaster list from storage
  @function deleteExtract
  @param {String} name - Name of the list to delete
  */
  deleteExtract: function (state, name) {
    let extracts = loadSavedExtracts()
    _.remove(extracts, {name: name})
    storeSavedExtracts(extracts)
    state.savedExtracts = extracts
    mutations.clearCurrentExtract(state)
    state.newExtract = (extracts.length < 1)
    state.currentExtract = []
    state.status = { type: 'success', scope: 'extract', message: 'The list “' + name + '” has been deleted' }
  },
  /**
  Load a saved disaster list into the currentExtract (selected disaster list)
  @function loadExtract
  @param {String} name - Name of the list to load
  */
  loadExtract: function (state, name) {
    mutations.clearCurrentExtract(state, true)
    let savedExtracts = loadSavedExtracts()
    let disasterNumbers = _.find(savedExtracts, {name}).disasters.join()
    state.extractLoading = true
    axios.get(`/api/disasternumber/${disasterNumbers}`).then((response) => {
      state.currentExtract = _.map(response.data, (disaster) => {
        disaster.currentExtract = true
        return disaster
      })
      state.extractLoading = false
    })
    state.newExtract = false
  },
  /**
  Update the disaster search list with fresh data
  @function updateDisasterList
  @param {Array} list - A list of disasters
  */
  updateDisasterList: function (state, list) {
    _.each(list, disaster => {
      var disasterInExtract = findDisaster(state.currentExtract, disaster)
      if (disasterInExtract) disaster.currentExtract = true
    })
    state.disasters = list
  },
  /**
  Add or remove a disaster from the currentExtract (selected disaster list)
  @function toggleCurrentExtract
  @param {Object} disaster - The disaster object to toggle
  */
  toggleCurrentExtract: function (state, disaster) {
    disaster = _.clone(disaster)
    disaster.currentExtract = !disaster.currentExtract

    let disasterInCurrentExtract = findDisaster(state.currentExtract, disaster)
    let disasterInResult = findDisaster(state.disasters, disaster)

    if (disaster.currentExtract) {
      if (!disasterInCurrentExtract) state.currentExtract.push(disaster)
    } else if (disasterInCurrentExtract) {
      // it's being toggled off, so remove it from currentExtract list
      let index = state.currentExtract.indexOf(disasterInCurrentExtract)
      state.currentExtract.splice(index, 1)
    }

    if (disasterInResult) {
      let index = state.disasters.indexOf(disasterInResult)
      state.disasters.splice(index, 1, disaster)
    }
    state.newExtract = true
  },
  /**
  Clear the selected disaster list
  @function clearCurrentExtract
  @param {boolean} noemit - Do not emit 'clearCurrentExtract' event from the magic bus
  */
  clearCurrentExtract: function (state, noemit) {
    if (!noemit) magic.$emit('clearCurrentExtract')
    state.currentExtract = []
    state.newExtract = false
    state.disasters = _.map(state.disasters, disaster => _.omit(disaster, 'currentExtract'))
    mutations.resetStatus(state)
  },
  /**
  Clear the search list
  @function clearSearch
  */
  clearSearch: function (state) {
    state.disasters = []
  },
  /**
  Reset message status to normal so messages don't disaply
  @function resetStatus
  */
  resetStatus: function (state) {
    state.status = { type: 'normal', message: '' }
    state.searchLoading = false
  },
  /**
  Set the status, so a message will display
  @function setStatus
  @param status
  @param {String} status.type normal | info | error
  @param {String} status.scope app | extract
  @param {String} status.msg The message to the user
  */
  setStatus: function (state, {type, scope, msg}) {
    state.status = { type: type, scope: scope, message: msg }
    state.searchLoading = false
  },
  /**
  Set the loading status
  @function setSearchLoading
  @param {boolean} status - The loading status (true|false)
  */
  setSearchLoading: function (state, status) {
    state.searchLoading = status
  }
}
/**
These are the vuex actions
*/
export const actions = {
  loadDisasterList: function ({ commit }, qry) {
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
  }
}

export const getters = {
  currentSearchResult: state => {
    return state.disasters
  },
  currentExtract: state => {
    return state.currentExtract
  },
  savedExtracts: state => {
    return state.savedExtracts
  },
  newExtract: state => {
    if (state.currentExtract && state.currentExtract.length === 0) state.newExtract = false
    return state.newExtract
  },
  status: state => {
    return state.status
  },
  extractLoading: state => {
    return state.extractLoading
  },
  searchLoading: state => {
    return state.searchLoading
  }
}

const searchStore = {
  // namespaced: true,
  state: {
    disasters: [],
    currentExtract: [],
    savedExtracts: loadSavedExtracts(),
    newExtract: false,
    status: { type: 'normal', scope: '', message: '' },
    extractLoading: false,
    searchLoading: false
  },
  actions,
  mutations,
  getters
}

export default searchStore
