import Vue from 'vue'
import VueRouter from 'vue-router'
import DisasterSearch from './components/DisasterSearch'

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
const beforeRouteEnter = function (to, from, next) {
  next(vm => {
    let done
    vm.$el.querySelectorAll('*').forEach(el => {
      if (done || el.tabIndex < 0) return
      el.focus()
      done = true
    })
    if (!done && vm.$el.tabIndex > -1) vm.$el.focus()
  })
}

DisasterSearch.beforeRouteEnter = beforeRouteEnter

const routes = [
  { path: '/', name: 'disasterSearch', component: DisasterSearch },
  { path: '/reports', name: 'reports', component: { beforeRouteEnter, template: '<div style="color: #fff; font-size: xx-large;" tabindex="0">This is the reports</div>' } },
  { path: '/maps', name: 'maps', component: { beforeRouteEnter, template: '<div style="color: #fff; font-size: xx-large;" tabindex="0">This is the map</div>' } }
]

const router = new VueRouter({
  routes,
  linkExactActiveClass: 'selected'
})

export default router
