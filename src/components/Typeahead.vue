<template lang="pug">
  .wrapper.container-fluid
    .row
      .col-xs-12.col-md-6.search-container
        #opaque-bg.row
          #message     <!-- .col -->
            h2 Disaster search
          .col.Typeahead
            #search
              .offset-bg
                .search-wrapper
                  label.sr-only(for='search-text') search FEMA disasters
                  input#search-text.Typeahead__input(type='text', ref='searchText', placeholder='Search by disaster number, type, or state', autocomplete='off', v-model='query', @keydown.esc='reset', @input='update')
                  icon(v-if='loading', classes='fa-spin', name='fa-spinner')
                  template(v-else='')
                    icon(name='fa-search', v-show='isEmpty')
                    a(href='#', @click='reset', v-if='isDirty')
                      icon(classes='clear-text', name='fa-times')
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

export default {
  components: {disaster, savedextracts, message},
  mounted () {
    magic.$on('clearQuery', () => {
      if (this.$refs.searchText.value === '') this.query = ''
    })
  },
  data () {
    return {
      query: '',
      loading: false
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
    }
  },
  methods: {
    update () {
      if (!this.query) return this.reset()
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
