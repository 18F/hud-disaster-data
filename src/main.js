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
import router from './router'
import es6Promise from 'es6-promise'
es6Promise.polyfill()

Vue.use(Vuex)
Vue.config.productionTip = false
Vue.prototype.$http = Axios
Vue.directive('tabbable', {
  // When the bound element is inserted into the DOM...
  inserted: function (el) {
    // See if it can be tabbable
    let shepherdClassName = 'shepherd-enabled'
    let shepherdTourActive = document.querySelector('.shepherd-active')
    if (!shepherdTourActive) return // don't run any of this, if we are not in a tour
    let currIndex = el.tabIndex
    let currElement = el
    let isVisible = currElement.className.includes(shepherdClassName)
    while (currElement && currElement.parentElement && !isVisible) {
      currElement = currElement.parentElement
      let className = currElement.className
      isVisible = className.includes(shepherdClassName)
    }
    if (!isVisible) {
      el.setAttribute('data-tabindex', currIndex)
      el.tabIndex = -1
    }
  }
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
    AppFooter
  }
})
