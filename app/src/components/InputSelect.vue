<template lang="pug">
  .input-select
    .search-wrapper.input-group(aria-live="assertive")
      label.sr-only(for='search-text') {{ searchInputLabel }}
      input.search-text(
        type='search'
        :placeholder='searchInputLabel'
        autocomplete='off'
        v-model='queryValue'
        @keydown.esc='reset'
        @keydown.enter='update'
        @keydown.down.prevent="selectDown"
        @keydown.up.prevent="selectUp"
        @click='inputReaction'
        @keydown='inputReaction'
        @focus='checkForReset'
        @blur="close"
        :class="isDisabled"
        :disabled="isDisabled")
      icon.search-icon(name="fa-search")
      button.clear-text(@click='reset'
       v-if='isDirty'
        :title='`Clear Search Text for ${componentDescription}`'
        :class="isDisabled"
        :disabled="isDisabled")
        icon(classes='clear-text' name='fa-times')
      span.input-group-btn
        button.usa-button.btn.toggle-btn(type="button"
          :title='`Toggle Drop Down List for ${componentDescription}`'
          @click="toggleDropdown"
          :class="isDisabled"
          :disabled="isDisabled")
          icon(v-show="contentVisible" name='fa-caret-up')
          icon(v-show="!contentVisible" name='fa-caret-down')
    .results-list(ref="dropdownMenu" v-if="contentVisible")
      ul.dropdown-content(@blur="close")
        li(v-for='(item, index) in unMatchedItems' :class="{ active: item.selected, highlight: index === listIndex }" @mouseover="listIndex = index")
          span(@mousedown.prevent="select(item)")
            | {{ item.name }}
</template>
<script>
import _ from 'lodash'
import adjustScroll from '../mixins/adjustScroll'

export default {
  name: 'input-select',
  mixins: [adjustScroll],
  props: ['items', 'onChange', 'value', 'disabled', 'componentDescription'],
  data () {
    return {
      matchingItems: [],
      listIndex: -1,
      queryValue: _.get(this, 'value.name'),
      contentVisible: false,
      ref: 'inputSelectText',
      placeholder: 'type here',
      searchButtonTitle: 'Search Magnifying Glass Icon',
      searchInputLabel: '' // search for something
    }
  },
  computed: {
    hasItems () {
      return this.items && this.items.length > 0
    },
    isEmpty () {
      return !this.queryValue
    },
    isDirty () {
      return !!this.queryValue
    },
    unMatchedItems () {
      return _.reject(this.getMatchingItems(this.queryValue), 'selected')
    },
    isDisabled () {
      return this.disabled ? 'disabled' : false
    }
  },
  methods: {
    /**
    * Will submit queryValue to load items
    * @function update
    */
    update () {
      if (this.listIndex > -1) {
        if (this.queryValue && this.queryValue.length > 0) {
          if (this.matchingItems && this.matchingItems.length > 0) {
            // use matchingItems if there is a queryValue text, and matching options
            this.select(this.matchingItems[this.listIndex])
          }
        } else {
          // use items array, as there is no queryValue text
          this.select(this.items[this.listIndex])
        }
        this.close()
      }
    },
    reset () {
      this.queryValue = ''
      this.listIndex = -1
      this.$emit('clear', null)
      this.matchingItems = _.clone(this.items)
    },
    checkForReset () {
      if (this.queryValue === '' && this.items.length > 0) this.reset()
    },
    toggleDropdown () {
      this.contentVisible = !this.contentVisible
    },
    close () {
      this.contentVisible = false
    },
    select (item) {
      if (this.isSelected(item)) {
        this.deselect(item)
      } else {
        this.matchingItems = [item]
        this.queryValue = item.name
        if (this.onChange) this.onChange(item)
        this.contentVisible = false
        this.$emit('update:value', item)
      }
    },
    selectDown () {
      let checkItemsLength = this.matchingItems.length || this.items.length
      if (this.listIndex < checkItemsLength - 1) {
        this.listIndex++
        // probably need to adjust scroll location
      }
    },
    selectUp () {
      if (this.listIndex > 0) {
        this.listIndex--
        // probably need to adjust scroll location
      }
    },
    isSelected (item) {
      return item && item.selected
    },
    deselect (item) {
      delete item.selected
    },
    getMatchingItems (queryValue) {
      if (!queryValue) {
        this.matchingItems = this.items
        this.listIndex = -1
      } else {
        this.matchingItems = []
        this.items.forEach((i) => {
          if (i.name.toUpperCase().includes(queryValue.toUpperCase())) {
            this.matchingItems.push(i)
          }
        })
      }
      return this.matchingItems
    },
    inputReaction (event) {
      if (event.type === 'keydown') {
        if (this.filterInput(event)) {
          if (event.which === 13 || event.keyCode === 13) {
            this.contentVisible = false
          } else {
            this.contentVisible = true
          }
          return true
        } else {
          event.preventDefault()
          return false
        }
      }
      return true
    },
    filterInput (event) {
      let keyCode = ('which' in event) ? event.which : event.keyCode
      let isNumeric = (keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105)
      let alpha = (keyCode >= 65 && keyCode <= 90)
      let specialCodes = [ 17, 32, 13, 189, 8, 9, 35, 36, 37, 38, 39, 40, 46, 27, 91, 93 ]
      let isSpecial = (specialCodes.indexOf(keyCode) > -1)
      return isNumeric || alpha || isSpecial
    }
  }
}
</script>
<style lang="scss">
.input-select {
  /* -- default styles ------------------- */
  border:0px;
  position:relative;
  width:100%;

  ul {
    margin-top:10px;
    padding:0;
    li:before { content: ""; }
  }

  .sr-only { color: #767676; }
  .toggle-btn {
    background: #fff;
    border:none;
    border-top-right-radius:0px;
    border-bottom-right-radius:0px;
    svg { fill:#000; }
  }

  .search-text {
    margin: 0;
    max-width:100%;
    padding-left:35px;
  }
  .toggle-btn, .search-text {
    border:none;
    border-radius:0px;
    height: 46px;
    margin: 0;
  }

  .search-wrapper.input-group {
    border-bottom:1px solid #ccc;
    overflow:hidden;
    position:relative;

    .search-icon {
      position:absolute;
      top:12px;
      left:10px;
      fill:#a9a9a9;
      padding:0;
    }
  }

  button {
    &.clear-text {
      background: none;
      cursor:pointer;
      float: right;
      right:8px;
      margin-top:-32px;
      max-width: 24px;
      padding: 0;
      position: relative;
      .hdd-icon { fill: #b0b0b0; }
      &:hover {
        .hdd-icon { fill: #000; }
      }
    }
  }

  .results-list {
    background: #fff;
    color: black;
    cursor:pointer;
    list-style: none;
    max-height: 195px;
    overflow: auto;
    position: absolute;
    /* width: 89.5%; */
    width:100%;
    z-index: 100;
    -moz-box-shadow:5px 5px 5px rgba(0,0,0,0.5);
    -webkit-box-shadow:5px 5px 5px rgba(0,0,0,0.5);
    box-shadow:5px 5px 5px rgba(0,0,0,0.5);

    .dropdown-content {
      width:100%;
      padding:0;
      margin:0;
      li {
        /* height:50px; */
        &:before { display:none;}

        span {
          padding:5px;
          margin-top:5px;
          width:100%;
        }

        &.selected {
          color: #000;
          background-color: #ccc;
        }
        &.highlight {
          background-color: #E2F6FD;
        }
      }
    }
  }

  /* -- disabled styles ------------------ */
  &.disabled{
    input, button {
      background-color:#f0f0f0;
      border:0px;
      color:#808080;
      cursor: default;
    }
    .search-wrapper.input-group { border-bottom:1px solid transparent; }
    .toggle-btn svg { fill:#ccc; }
  }
}

</style>
