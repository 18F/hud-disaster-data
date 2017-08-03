/* global describe, it, expect */
import 'es6-promise/auto' // eslint-disable-line
import Vue from 'vue' // eslint-disable-line
import '@/vue-mixins'
import sprites from '@/components/Sprites' // eslint-disable-line

Vue.config.productionTip = false

describe('Sprites', () => {
  it('should render svg', done => {
    const Constructor = Vue.extend(sprites)
    const vm = new Constructor().$mount()
    Vue.nextTick(function () {
      let $symbols = vm.$el.querySelectorAll('symbol')
      ;($symbols.length).should.be.above(1)
      done()
    })
  })
})
