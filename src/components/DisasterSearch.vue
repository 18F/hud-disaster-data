<template lang="pug">
  .wrapper.container-fluid
    .row
      .col-xs-12.col-md-6.search-container
        #opaque-bg.row
          h2 Disaster search
          .col.DisasterSearch
            #search
              .offset-bg
                .search-wrapper.input-group
                  label.sr-only(for='search-text') search FEMA disasters
                  input#search-text.DisasterSearch__input(
                    type='text',
                    ref='searchText',
                    placeholder='Search by disaster number, type, or state',
                    autocomplete='off',
                    v-model='query',
                    @keydown.esc='reset',
                    @keydown.enter='update')
                  icon(v-if="loading", classes='fa-spin', name='fa-spinner')
                  template(v-else)
                    button#clear-text(@click='reset', v-if='isDirty')
                      icon(classes='clear-text', name='fa-times')
                  span.input-group-btn
                    button#search-btn.btn.btn-default(type="button", @click="update")
                      icon(name='fa-search')
                .message-wrapper
                  message(:status="status" :locationOfMessage="'app-message'")
                .disaster-list(v-show='hasItems')
                  ul.disaster-search-recs
                    li(v-for='(item, $item) in items')
                      disaster(:prefix="'search'", :item='item')
                .link-advanced-search
                  a(href='#') Advanced Search
      .col-xs-12.col-md-6.no-padding
        savedextracts(ref='extracts')
</template>

<script>
import disaster from './Disaster'
import message from './Message'
import savedextracts from './SavedExtracts'
import magic from '@/bus'

/**
* Component responsible for enabling a user to search for and select disasters to be included in a data export.
* @module components/DisasterSearch
*/
export default {
  name: 'disaster-search',
  components: {disaster, savedextracts, message},
  mounted () {
    magic.$on('clearQuery', () => {
      if (this.$refs.searchText.value === '') this.query = ''
    })
  },
  data () {
    return {
      query: ''
    }
  },
  computed: {
    items () {
      return this.$store.getters.currentSearchResult
    },
    hasItems () {
      return this.items && this.items.length > 0
    },
    isEmpty () {
      return !this.query
    },
    isDirty () {
      return !!this.query
    },
    status () {
      return this.$store.getters.status
    },
    loading () {
      return this.$store.getters.searchLoading
    }
  },
  methods: {
    update () {
      if (!this.query) return this.reset()
      if (/^\d+$/.test(this.query) && this.query.length < 4) return
      if (this.query.length < 2) return
      this.$store.dispatch('loadDisasterList', this.query)
    },
    reset () {
      this.query = ''
      this.$store.commit({type: 'clearSearch'})
    }
  }
}
</script>
<style src="../../public/assets/_scss/app.scss" lang="scss"/>
