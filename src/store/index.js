import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import _ from 'lodash'
Vue.use(Vuex)

function findDisaster (list, disaster) {
  return _.find(list, {disasterType: disaster.disasterType, disasterNumber: disaster.disasterNumber, state: disaster.state})
}

function getSavedExtracts () {
  let item = localStorage.getItem('saved-extracts')
  if (!item) return []
  return JSON.parse(item)
}

function setSavedExtracts (extracts) {
  localStorage.setItem('saved-extracts', JSON.stringify(extracts))
}

export const mutations = {
  saveExtract: function (state, name) {
    if (_.find(state.savedExtracts, { name })) {
      state.status = { type: 'error', message: 'Extract already exists' }
      return
    }
    if (!name || name === '') {
      state.status = { type: 'error', message: 'Name can not be empty' }
      return
    }
    state.savedExtracts.push({
      name,
      disasters: _.clone(state.currentExtract)
    })
    setSavedExtracts(state.savedExtracts)
    state.newExtract = false
    state.status = { type: 'success', message: 'Extract successfully saved' }
  },
  deleteExtract: function (state, name) {
    let extracts = getSavedExtracts()
    _.remove(extracts, {name: name})
    setSavedExtracts(extracts)
    state.savedExtracts = extracts
    mutations.clearCurrentExtract(state)
    state.newExtract = (extracts.length < 1)
    state.currentExtract = getDefaultExtract()
    state.status = { type: 'success', message: 'Successfully deleted saved extract' }
  },
  loadExtract: function (state, name) {
    mutations.clearCurrentExtract(state)
    let savedExtracts = getSavedExtracts()
    state.currentExtract = _.find(savedExtracts, { name }).disasters
    state.newExtract = false
  },
  updateDisasterList: function (state, { list }) {
    list.forEach(disaster => {
      var disasterInExtract = findDisaster(state.currentExtract, disaster)
      if (disasterInExtract) disaster.currentExtract = true
    })
    state.disasters = list
  },
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
  clearCurrentExtract: function (state) {
    state.currentExtract = []
    state.disasters = _.map(state.disasters, disaster => _.omit(disaster, 'currentExtract'))
  },
  clearSearch: function (state) {
    state.disasters = []
  },
  resetStatus: function (state) {
    state.status = { type: 'normal', message: '' }
  }
}

export const actions = {
  loadDisasterList: function ({ commit }, qry) {
    axios.get(`/api/disasters/${qry}`).then((response) => {
      commit('updateDisasterList', { list: response.data })
    }, (err) => {
      console.log(err) // TODO: Do something with this error other than displaying it to the console :)
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
    return state.newExtract
  },
  defaultExtractName: state => {
    let extracts = getSavedExtracts()
    if (extracts && extracts.length > 0) return extracts[0].name
    return ''
  },
  status: state => {
    return state.status
  }
}

function getDefaultExtract () {
  let extracts = getSavedExtracts()
  if (extracts && extracts.length > 0) return extracts[0].disasters
  return []
}

const store = new Vuex.Store({
  state: {
    disasters: [],
    currentExtract: getDefaultExtract(),
    savedExtracts: getSavedExtracts(),
    newExtract: false,
    status: { type: 'normal', message: '' }
  },
  actions,
  mutations,
  getters
})

export default store
