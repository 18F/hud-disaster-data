import Vue from 'vue'
import Typeahead from '@/components/Typeahead'
import VueResource from 'vue-resource'
Vue.use(VueResource)
Vue.http.options.emulateJSON = true
const http = Vue.http
export default http
Vue.fetch = function () {
  return {
    disasterNumber: 4312,
    state: 'CA',
    declarationDate: '2017-05-02T22:00:00.000Z',
    disasterType: 'DR',
    incidentType: 'Severe Storm(s)',
    title: 'FLOODING',
    declaredCountyArea: 'Resighini Rancheria (Indian Reservation)',
    placeCode: 60347,
    id: '59092d0bb5ad0d1a0200cd9c'
  }
}

const testItems = [
  { declarationDate: '2017-04-21T15:17:00.000Z',
    declaredCountyArea: 'Box Elder (County)',
    disasterNumber: 4311,
    disasterType: 'DR',
    id: '58fa2e008a4f31363dac2c6a',
    incidentType: 'Flood',
    placeCode: 99003,
    state: 'UT',
    title: 'SEVERE WINTER STORMS AND FLOODING' },
  { declarationDate: '2017-04-21T15:17:00.000Z',
    declaredCountyArea: 'Cache (County)',
    disasterNumber: 4311,
    disasterType: 'DR',
    id: '58fa2e008a4f31363dac2c70',
    incidentType: 'Flood',
    placeCode: 99005,
    state: 'UT',
    title: 'SEVERE WINTER STORMS AND FLOODING'
  }
]

const Ctor = Vue.extend(Typeahead)
const vm = new Ctor({
  data () {
    return {
      items: testItems
    }
  }
}).$mount()

describe('Typeahead.vue', () => {
  it('should render correct list item contents', () => {
// TODO can we clean up the DOM stuff below?
    (vm.$el.children[3].childNodes[0].textContent).should.be
      .equal('DR-4311-UT title:  SEVERE WINTER STORMS AND FLOODING incidentType: Flood declaredCountyArea: Box Elder (County) 2017-04-21T15:17:00.000Z')
  })

  it('should set the proper disaster number in search field', () => {
    vm.onHit(testItems[0])
    const srchFieldVal = vm.$el.children[2].outerText
    debugger
    console.log(`search field value: ${srchFieldVal}`)
  })
})
