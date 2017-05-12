import Vue from 'vue'
import Typeahead from '@/components/Typeahead'

describe('Typeahead.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Typeahead)
    const vm = new Constructor().$mount()
    vm.$el.querySelector('.Typeahead__input').value = 'davehannon'
    Vue.nextTick(() => {
      expect(vm.$el.querySelector('.disaster-list').children).to.have.length.of.at.least(1)
      done()
    })
  })
})
