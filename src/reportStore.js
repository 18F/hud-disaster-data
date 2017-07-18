import Vue from 'vue'
import Vuex from 'vuex'
// import axios from 'axios'
// import _ from 'lodash'
import es6Promise from 'es6-promise'
// import magic from '@/bus'
es6Promise.polyfill()
Vue.use(Vuex)
/**
* Manages the state for client functions.
* @module reportStore
*/

export const mutations = {}
/**
These are the vuex actions
*/
export const actions = {}

export const getters = {}

const reportStore = {
  state: {},
  actions,
  mutations,
  getters
}

export default reportStore
