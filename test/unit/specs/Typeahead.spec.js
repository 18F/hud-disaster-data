import Vue from 'vue'
import Typeahead from '@/components/Typeahead'

function getRenderedText (Component, propsData) {
  const Ctor = Vue.extend(Component)
  const vm = new Ctor({ propsData: propsData }).$mount()
  return vm.$el.textContent
}

describe('Typeahead.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Typeahead)
    const vm = new Constructor().$mount()
    const $el = vm.$el.querySelector('.Typeahead__input')
    $el.value = 'davehannon'
    var e = document.createEvent('HTMLEvents')
    e.initEvent('change', false, true)
    $el.dispatchEvent(e)
    Vue.nextTick(() => {
      // console.log(vm.$el.querySelector('.disaster-list').children[0].tagName)
      expect(vm.$el.querySelector('.disaster-list').children).to.have.length.of.at.least(1)
      done() // eslint-disable-line
    })
  })
  it('should redirect user to twitter', () => {
    console.log(getRenderedText(Typeahead, {query: 'davehannon'}))
  })
})
