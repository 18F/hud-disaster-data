// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import store from './store'
import Typeahead from './components/Typeahead'
import AppHeader from './components/Header'
import AppFooter from './components/Footer'
import tour from './tour'
import es6Promise from 'es6-promise'
es6Promise.polyfill()

Vue.use(Vuex)
Vue.config.productionTip = false
Vue.prototype.$http = Axios

/* eslint-disable no-new */
new Vue({
  mounted () {
    tour.start()
  },
  el: '#page',
  store,
  components: {
    AppHeader,
    Typeahead,
    AppFooter
  }
})
