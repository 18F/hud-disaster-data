<template lang="pug">
  .input-select
    .search-wrapper.input-group(aria-live="assertive")
      label.sr-only(for='search-text') {{ searchInputLabel }}
      input.search-text(
        type='search'
        :placeholder='searchInputLabel'
        autocomplete='off'
        v-model='query'
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
          @blur="close"
          :class="isDisabled"
          :disabled="isDisabled")
          icon(v-show="contentVisible" name='fa-caret-up')
          icon(v-show="!contentVisible" name='fa-caret-down')
    .results-list
      ul.dropdown-content(ref="dropdownMenu" v-if="contentVisible")
        li(v-for='(item, index) in unMatchedItems' :class="{ active: item.selected, highlight: index === listIndex }" @mouseover="listIndex = index")
          span(@mousedown.prevent="select(item)")
            | {{ item.name }}
</template>
<script>
import _ from 'lodash'

export default {
  name: 'input-select',
  props: ['items', 'onChange', 'value', 'disabled', 'componentDescription'],
  data () {
    return {
      matchingItems: [],
      listIndex: -1,
      query: _.get(this, 'value.name'),
      contentVisible: false,
      ref: 'inputSelectText',
      placeholder: 'type here',
      searchButtonTitle: 'Search Magnifying Glass Icon',
      searchInputLabel: 'search for something'
    }
  },
  computed: {
    hasItems () {
      return this.items && this.items.length > 0
    },
    isEmpty () {
      return !this.query
    },
    isDirty () {
      return !!this.query
    },
    unMatchedItems () {
      return _.reject(this.getMatchingItems(this.query), 'selected')
    },
    isDisabled () {
      return this.disabled ? 'disabled' : false
    }
  },
  methods: {
    /**
    * Will submit query to load disasters if it is a number with a length >= 4 or >= 2 alpha characters
    * @function update
    */
    update () {
      if (this.listIndex > -1) {
        if (this.query && this.query.length > 0) {
          if (this.matchingItems && this.matchingItems.length > 0) {
            // use matchingItems if there is a query text, and matching options
            this.select(this.matchingItems[this.listIndex])
          }
        } else {
          // use items array, as there is no query text
          this.select(this.items[this.listIndex])
        }
        this.close()
      }
    },
    reset () {
      this.query = ''
      this.listIndex = -1
      this.$emit('update:value', null)
      this.matchingItems = _.clone(this.items)
    },
    checkForReset () {
      if (this.query === '' && this.items.length > 0) this.reset()
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
        this.query = item.name
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
    getMatchingItems (query) {
      if (!query) {
        this.matchingItems = this.items
        this.listIndex = -1
      } else {
        this.matchingItems = []
        this.items.forEach((i) => {
          if (i.name.toUpperCase().includes(query.toUpperCase())) {
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
          }
          this.contentVisible = true
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
  }

  button {
    &.clear-text {
      background: none;
      cursor:pointer;
      float: right;
      margin-top:-32px;
      max-width: 24px;
      padding: 0;
      position: relative;
      .hdd-icon { fill: #ccc; }
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
    max-height: 315px;
    overflow: auto;
    position: absolute;
    /* width: 89.5%; */
    width:100%;
    z-index: 5;

    .dropdown-content {
      width:100%;
      padding:0;
      margin:0;
      li {
        &:before { display:none;}

        span {
          padding:10px;
          margin-top:5px;
          width:100%;
        }

        &.selected {
          color: #333;
          background: rgba(50, 50, 50, .1);
        }
        &.highlight {
          background: #5897fb;
          span {
            color: #fff;
          }
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
