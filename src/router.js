import Vue from 'vue'
import VueRouter from 'vue-router'
import DisasterSearch from './components/DisasterSearch'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: DisasterSearch, name: 'disasterSearch' },
  { path: '/reports', name: 'reports', component: { template: '<div style="color: #fff; font-size: xx-large;">This is the reports</div>' } },
  { path: '/maps', name: 'maps', component: { template: '<div style="color: #fff; font-size: xx-large;">This is the map</div>' } }
]

export default new VueRouter({
  routes
})

