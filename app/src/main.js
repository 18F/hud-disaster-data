// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import './vue-mixins' // All vue components will share these
import Vuex from 'vuex'
import Axios from 'axios'
import store from './store' // This is our Vuex store.  It helps us manage state.
import Sprites from './components/Sprites'
import DisasterSearch from './components/DisasterSearch'
import Report from './components/Report'
import AppHeader from './components/Header'
import AppFooter from './components/Footer'
import ValueSelector from './components/ValueSelector'
import InputSelect from './components/InputSelect'
import router from './router'
import es6Promise from 'es6-promise'
es6Promise.polyfill()

Vue.use(Vuex)
Vue.config.productionTip = false
Vue.prototype.$http = Axios
const contextRoot = window.location.pathname.replace(/\/$/, '')
Axios.interceptors.request.use(function (config) {
  config.url = `${contextRoot}${config.url}`
  return config
}, function (error) {
  return Promise.reject(error)
})

/**
* The main vue component.  All other components are children of this one.
* @module components/App
*/
/* eslint-disable no-new */
new Vue({
  el: '#page',
  store,
  router,
  components: {
    Sprites,
    AppHeader,
    DisasterSearch,
    Report,
    ValueSelector,
    AppFooter,
    InputSelect
  }
})
