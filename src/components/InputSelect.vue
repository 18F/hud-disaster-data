<template lang="pug">
  .input-select
    .search-wrapper.input-group(aria-live="assertive")
      label.sr-only(for='search-text' id='search-text-label') {{ searchInputLabel }}
      input.search-text(
        type='search'
        :placeholder='searchInputLabel'
        autocomplete='off'
        v-model='query'
        @keydown.esc='reset'
        @keydown.enter='update'
        @click='showDropdown = true'
        @focus='checkForReset')
      button.clear-text(@click='reset' v-if='isDirty' title='Clear Search Text')
        icon(classes='clear-text' name='fa-times')
      span.input-group-btn
        button.usa-button.btn.toggle-btn(type="button" @click="toggleDropdown")
          icon(v-show="showDropdown" name='fa-caret-up')
          icon(v-show="!showDropdown" name='fa-caret-down')
    .results-list
      ul.dropdown-content(ref="dropdownMenu" v-if="showDropdown")
        li(v-for='(item, $item) in matchingItems')
          span(@mousedown.prevent="select(item)")
            | {{ item.name }}
</template>
<script>
import _ from 'lodash'

export default {
  name: 'input-select',
  props: ['items', 'onChange', 'multiple', 'value', 'dropdownMenuStyle'],
  data () {
    return {
      query: _.get(this, 'value.name'),
      showDropdown: false,
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
    matchingItems () {
      return this.getMatchingItems(this.query)
    }
  },
  methods: {
    /**
    * Will submit query to load disasters if it is a number with a length >= 4 or >= 2 alpha characters
    * @function update
    */
    update () {
      if (!this.query) return this.reset()
      if (this.matchingItems && this.matchingItems.length > 0) this.showDropdown = true
    },
    reset () {
      this.query = ''
      this.matchingItems = _.clone(this.items)
    },
    checkForReset () {
      if (this.query === '' && this.items.length > 0) this.reset()
    },
    toggleDropdown () {
      this.showDropdown = !this.showDropdown
    },
    select (item) {
      if (this.multiple) {
        this.matchingItems.push(item)
      } else {
        this.matchingItems = [item]
      }
      this.query = item.name
      if (this.onChange) this.onChange(item)
      this.showDropdown = false
      this.$emit('update:value', item)
    },
    getMatchingItems (query) {
      let matchingItems = []
      if (!query) {
        matchingItems = this.items
      } else {
        _.clone(this.items).forEach(function (i) {
          if (i.name.toUpperCase().includes(query.toUpperCase())) {
            matchingItems.push(i)
          }
        })
      }
      return matchingItems
    }
  }
}
</script>
<style lang="scss">
.input-select {
  border-radius: 0 5px 5px 0;
  li:before {
    content: "";
  }

  .toggle-btn, .search-text {
    margin: 0;
    height: 46px;
  }

  .search-text {
    margin: 0;
    border: 1px solid #fff;
    border-bottom: 1px solid #5b616b;
  }
  button.clear-text {
    background: none;
    position: relative;
    float: right;
    margin: -32px 25px 0 0;
    max-width: 24px;
    padding: 0;
    .hdd-icon {
      fill: #000;
    }
  }
  .results-list {
    color: black;
    list-style: none;
    position: absolute;
    z-index: 5;
    background: #fff;
    width: 349px;
    overflow: auto;
    max-height: 350px;
  }
}
</style>
