import {beforeRouteEnter} from '@/router'
import sinon from 'sinon'

describe('rounter', function () {
  describe('beforeRouteEnter', function () {
    it('should give focus to the first element in the component with a tabIndex', function () {
      const elements = [{
        tabIndex: -1,
        focus: sinon.stub()
      }, {
        tabIndex: 0,
        focus: sinon.stub()
      }]
      const vm = {
        $el: {
          querySelectorAll: sinon.stub().callsFake(selector => {
            return elements
          })
        }
      }
      const next = function (handler) {
        handler(vm)
      }
      beforeRouteEnter(null, null, next)
      expect(vm.$el.querySelectorAll.called).to.be.equal(true)
      expect(elements[1].focus.called).to.be.equal(true)
      expect(elements[0].focus.called).to.be.equal(false)
    })
    it(`should give focus to the component $el if none of it's children have a tabIndex`, function () {
      const vm = {
        $el: {
          querySelectorAll: sinon.stub().callsFake(selector => {
            return []
          }),
          focus: sinon.stub(),
          tabIndex: 0
        }
      }
      const next = function (handler) {
        handler(vm)
      }
      beforeRouteEnter(null, null, next)
      expect(vm.$el.querySelectorAll.called).to.be.equal(true)
      expect(vm.$el.focus.called).to.be.equal(true)
    })
  })
})
