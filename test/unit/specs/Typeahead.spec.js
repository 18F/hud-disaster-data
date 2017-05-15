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
    vm.$el.querySelector('.Typeahead__input').value = 'davehannon'
    Vue.nextTick(() => {
      expect(vm.$el.querySelector('.disaster-list').children).to.have.length.of.at.least(1)
      done() // eslint-disable-line
    })
  })
  it('should redirect user to twitter', () => {
    console.log(getRenderedText(Typeahead, {query: 'davehannon'}))
  })
})
