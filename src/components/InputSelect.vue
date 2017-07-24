<template lang="pug">
  #search
    .offset-bg
      .search-wrapper.input-group(aria-live="assertive")
        label.sr-only(for='search-text' id='search-text-label') {{ searchInputLabel }}
        input#search-text.DisasterSearch__input(
          type='search'
          :placeholder='searchInputLabel'
          autocomplete='off'
          v-model='query'
          @keydown.esc='reset'
          @keydown.enter='update'
          @click='toggleDropdown'
          @focus='checkForReset')
        button#clear-text(@click='reset' v-if='isDirty' title='Clear Search Text')
          icon(classes='clear-text' name='fa-times')
        span.input-group-btn
          button#search-btn.usa-button.btn.btn-default(type="button" @click="toggleDropdown" :title="searchButtonTitle")
            icon(v-show="showDropdown" name='fa-caret-up')
            icon(v-show="!showDropdown" name='fa-caret-down')
      .results-list( style="max-height: 400px; overflow: auto;")
        template(ref="dropdownMenu" v-if="showDropdown")
          ul(v-for='(item, $item) in matchingItems')
            li
              span(@mousedown.prevent="select(item)")
                | {{ item.name }}
</template>
<script>
import _ from 'lodash'
export default {
  name: 'input-select',
  props: ['items', 'onChange', 'multiple'],
  data () {
    return {
      query: '',
      showDropdown: false,
      ref: 'inputSelectText',
      placeholder: 'type here',
      searchButtonTitle: 'Search Magnifying Glass Icon',
      searchInputLabel: 'search for something',
      matchingItems: _.clone(this.items)
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
    }
  },
  methods: {
    /**
    * Will submit query to load disasters if it is a number with a length >= 4 or >= 2 alpha characters
    * @function update
    */
    update () {
      let query = this.query
      if (!this.query) return this.reset()
      this.matchingItems = _.clone(this.items)
      _.remove(this.matchingItems, (i) => {
        if (i.name.includes(query)) { return false }
        return true
      })
      if (this.matchingItems.length > 0) this.showDropdown = true
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
    }
  }
}
</script>
<style>
.results-list {
  color: black;
  list-style: none;
}
</style>
