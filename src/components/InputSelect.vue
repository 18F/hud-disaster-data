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
        @click='inputReaction'
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
        li(v-for='(item, $item) in matchingItems')
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
    matchingItems () {
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
      if (!this.query) return this.reset()
      if (this.matchingItems && this.matchingItems.length > 0) this.contentVisible = true
    },
    reset () {
      this.query = ''
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
      this.matchingItems = [item]
      this.query = item.name
      if (this.onChange) this.onChange(item)
      this.contentVisible = false
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
    },
    inputReaction () {
      this.contentVisible = true
      if (this.query) this.query = ''
    }
  }
}
</script>
<style lang="scss">
.input-select {
  /* -- default styles ------------------- */
  width:100%;
  border:0px;

  ul {
    margin-top:10px;
    padding-top:0;
    li:before { content: ""; }
  }

  .toggle-btn {
    background: #fff;
    border:none;
    border-top-right-radius:0px;
    border-bottom-right-radius:0px;
    svg { fill:#000; }
  }

  .search-text { margin: 0; }

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
    margin-right:20px;
    max-height: 315px;
    overflow: auto;
    position: absolute;
    width: 89.5%;
    z-index: 5;
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
