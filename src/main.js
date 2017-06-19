// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import store from './store'
import Sprites from './components/Sprites'
import Typeahead from './components/Typeahead'
import AppHeader from './components/Header'
import AppFooter from './components/Footer'
import icon from './components/Icon'

import es6Promise from 'es6-promise'
es6Promise.polyfill()

const messages = {
  success: 'fa-check-circle',
  error: 'fa-times-circle',
  warning: 'fa-warning',
  info: 'fa-info-circle'
}
Vue.mixin({
  components: {icon},
  methods: {
    iconName () {
      return messages[this.status.type]
    }
  }
})

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
    Typeahead,
    AppFooter
  }
})
