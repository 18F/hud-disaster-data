import 'es6-promise/auto' // eslint-disable-line
const adjustScroll = require('@/mixins/adjustScroll')
import _ from 'lodash' // eslint-disable-line
import should from 'should'
import sinon from 'sinon' // eslint-disable-line

describe('adjustScroll', function () {
  describe('maybeAdjustScroll', function () {
    it('should return pixelsToPointerTop if pixelsToPointerTop <= viewport.top', function () {
      let pixelsToPointerTop = () => 20
      let pixelsToPointerBottom = () => 25
      let viewport = () => { return {top: 40, bottom: 40} }
      let scrollTo = sinon.stub().returnsArg(0)
      let returnedValue = adjustScroll.methods.maybeAdjustScroll.call({pixelsToPointerTop, pixelsToPointerBottom, viewport, scrollTo})
      should(returnedValue).be.equal(pixelsToPointerTop())
    })
    it('should return pixelsToPointerTop if pixelsToPointerBottom >= viewport.bottom', function () {
      let pixelsToPointerTop = () => 20
      let pixelsToPointerBottom = () => 25
      let viewport = () => { return {top: 10, bottom: 10} }
      let scrollTo = sinon.stub().returnsArg(0)
      let returnedValue = adjustScroll.methods.maybeAdjustScroll.call({pixelsToPointerTop, pixelsToPointerBottom, viewport, scrollTo})
      should(returnedValue).be.equal(pixelsToPointerTop())
    })
  })

  describe('pixelsToPointerTop', function () {
    it('should return number of pixels from the top of the dropdown to the top of the current pointer element', function () {
      let $refs = {dropdownMenu: { children: [{children: [{offsetHeight: 10}, {offsetHeight: 10}]}] }}
      let listIndex = 2
      let returnedValue = adjustScroll.methods.pixelsToPointerTop.call({$refs, listIndex})
      should(returnedValue).be.equal(20)
    })
  })

  describe('pixelsToPointerBottom', function () {
    it('should return distance in pixels from the top of the dropdown list to the bottom of the current pointer element', function () {
      let pixelsToPointerTop = () => 20
      let pointerHeight = () => 25
      let returnedValue = adjustScroll.methods.pixelsToPointerBottom.call({pixelsToPointerTop, pointerHeight})
      should(returnedValue).be.equal(45)
    })
  })

  describe('pointerHeight', function () {
    it('should return the offsetHeight of the current pointer element', function () {
      let $refs = {dropdownMenu: { children: [{offsetHeight: 10}, {offsetHeight: 30}] }}
      let listIndex = 1
      let returnedValue = adjustScroll.methods.pointerHeight.call({$refs, listIndex})
      should(returnedValue).be.equal(30)
    })
  })

  describe('viewport', function () {
    it('should return the currently viewable portion of the dropdownMenu', function () {
      let $refs = {dropdownMenu: { scrollTop: 45, offsetHeight: 22 }}
      let returnedValue = adjustScroll.methods.viewport.call({$refs})
      should(returnedValue.top).be.equal(45)
      should(returnedValue.bottom).be.equal(67)
    })
  })

  describe('scrollTo', function () {
    it('should return the value of the dropdownMenu scrollTop, which is set to position', function () {
      let $refs = {dropdownMenu: { scrollTop: 45, offsetHeight: 22 }}
      let returnedValue = adjustScroll.methods.scrollTo.call({$refs}, 34)
      should(returnedValue).be.equal(34)
      should($refs.dropdownMenu.scrollTop).be.equal(34)
    })
  })
})
