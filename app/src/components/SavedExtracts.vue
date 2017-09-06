<template lang="pug">
  .extracts
    #saved_searches
      h3 Saved Disaster Lists
      div
        select(required='', v-show='!newExtract', @change='loadExtract', v-model='selectedExtractName', title='Saved disaster lists')
          option(value='', disabled='', selected='') Select a list...
          option(v-for='extract in savedExtracts', v-bind:value='extract.name') {{extract.name}}
        label.sr-only(for='extract-name') Search Name
        input#extract-name(v-show='newExtract', v-model='extractName', @keydown.enter='saveExtract' name='extract-name', type='text', placeholder='Enter a name for your list')
      #cta
        label.sr-only(for='save-button') Save selected disaster list
        button#save-button.usa-button(@click='saveExtract', title='Save button', :disabled='!newExtract', style='vertical-align:top;')
          icon(classes='ico-lg gray', name='fa-save')
        label.sr-only(for='delete-button') delete saved disaster list: {{ selectedExtractName }}
        button#delete-button.usa-button(@click='deleteExtract', title='Delete button', :disabled="selectedExtractName === ''")
          icon(classes='ico-lg gray', name='fa-trash-o')
    h3 Selected Disasters List
    .message-wrapper
      message(:status="status" :locationOfMessage="'extract-message'")
    #list
      .list-loader(v-if='loading')
        icon.fa-spin.ico-xl(name='fa-spinner')
        span.fa-spin-text
          | Loading ...
        span.sr-only Loading...
      ul
        li(v-for='(item, $item) in items')
          disaster(:prefix="'saved'", :item='item')
    #action-buttons
      button#clear-button.usa-button.alt-button(@click='clear' title='Clear button') Clear
      a(:href='download()' tabindex='-1' download='')
        button#export-button.usa-button.green(:disabled='items.length === 0' title='Export button')
          | Export
          icon(classes='export', name='fa-sign-out')
</template>

<script>
import disaster from './Disaster'
import message from './Message'
import magic from '@/bus'
import moment from 'moment'
import _ from 'lodash'

/**
* Component responsible for enabling a user to build and save criteria for data exports.
* @module components/SavedExtracts
*/
export default {
  components: {disaster, message},
  created () {
    magic.$on('clearCurrentExtract', () => (this.selectedExtractName = ''))
  },
  data: function () {
    return {
      extractName: '',
      selectedExtractName: ''
    }
  },
  computed: {
    items () {
      return this.$store.getters.currentExtract || []
    },
    savedExtracts () {
      return this.$store.getters.savedExtracts
    },
    newExtract () {
      let newExtract = this.$store.getters.newExtract
      if (newExtract) this.selectedExtractName = ''
      return newExtract
    },
    status () {
      return this.$store.getters.status
    },
    loading () {
      return this.$store.getters.extractLoading
    }
  },
  methods: {
    download () {
      if (!this.items || this.items.length === 0) return
      const timeStamp = moment().format('YYYY-MM-DD-kk:mm:ss')
      const url = this.selectedExtractName ? `/api/export/${this.selectedExtractName}-${timeStamp}` : `/api/export/${timeStamp}`
      const data = _.map(this.$store.getters.currentExtract, disaster => {
        return `${disaster.disasterType}-${disaster.disasterNumber}-${disaster.state}`
      })
      return `${url}?disasters=${data}`
    },
    clear () {
      this.$store.commit('clearCurrentExtract')
    },
    saveExtract () {
      this.$store.commit('saveExtract', this.extractName)
      if (this.status.type === 'error') return (this.extractName = '')
      this.selectedExtractName = this.extractName
      this.extractName = ''
    },
    deleteExtract () {
      if (!confirm(`Are you sure you want to delete "${this.selectedExtractName}"?`)) return
      this.$store.commit('deleteExtract', this.selectedExtractName)
      this.selectedExtractName = ''
      this.extractName = ''
    },
    loadExtract () {
      this.$store.commit('loadExtract', {name: this.selectedExtractName, user: this.$store.getters.user})
    }
  }
}
</script>
<style lang="scss">
  //moved to 03-modules/_extracts.scss
</style>
