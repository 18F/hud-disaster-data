// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import './vue-mixins' // All vue components will share these
import Vuex from 'vuex'
import Axios from 'axios'
import store from './store' // This is our Vuex store.  It helps us manage state.
import Sprites from './components/Sprites'
import DisasterSearch from './components/DisasterSearch'
import AppHeader from './components/Header'
import AppFooter from './components/Footer'
import es6Promise from 'es6-promise'
es6Promise.polyfill()

Vue.use(Vuex)
Vue.config.productionTip = false
Vue.prototype.$http = Axios

/* eslint-disable no-new */
new Vue({
  el: '#page',
  store,
  components: {
    Sprites,
    AppHeader,
    DisasterSearch,
    AppFooter
  }
})
