import Vue from 'vue'
import VueRouter from 'vue-router'
import DisasterSearch from './components/DisasterSearch'
import Report from './components/Report'
import Map from './components/Map'
import _ from 'lodash'

Vue.use(VueRouter)
/**
* Creates the routes for navigation.
* @module router
*/
/**
* @@function DisasterSearch.beforeRouteEnter
* Sets focus to first tabbable element on the rendered component
* @param {to} - the destination route
* @param {from} - the from route
* @param {next} - the callback for next
*/
export const beforeRouteEnter = function (to, from, next) {
  next(vm => {
    let done
    _.each(vm.$el.querySelectorAll('*'), el => {
      if (done || el.tabIndex < 0) return
      el.focus()
      done = true
    })
    if (!done && vm.$el.tabIndex > -1) vm.$el.focus()
  })
}

DisasterSearch.beforeRouteEnter = beforeRouteEnter
Report.beforeRouteEnter = beforeRouteEnter
Map.beforeRouteEnter = beforeRouteEnter

const routes = [
  { path: '/', name: 'disasterSearch', component: DisasterSearch },
  { path: '/reports', name: 'reports', component: Report },
  { path: '/maps', name: 'maps', component: Map }
]

const router = new VueRouter({
  mode: 'history',
  routes,
  linkExactActiveClass: 'selected'
})

export default router
