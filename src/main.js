// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import store from './store'
import Typeahead from './components/Typeahead'
import AppHeader from './components/Header'

Vue.use(Vuex)
Vue.config.productionTip = false
Vue.prototype.$http = Axios

/* eslint-disable no-new */
new Vue({
  el: '#page',
  store,
  components: {
    AppHeader,
    Typeahead
  }
})
