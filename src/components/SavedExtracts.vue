<template lang="pug">
  .extracts
    #saved_searches
      h4 Saved searches
      div
        select(required='', v-show='!newExtract', @change='loadExtract', v-model='selectedExtractName', title='saved searches')
          option(value='', disabled='', selected='') Select a search...
          option(v-for='extract in savedExtracts', v-bind:value='extract.name') {{extract.name}}
        label.sr-only(for='extract-name') Search Name
        input#extract-name(v-show='newExtract', v-model='extractName', name='extract-name', type='text', placeholder='Enter a name for your search')
      #cta
        label.sr-only(for='save-button') Save selected disaster search
        button#save-button.usa-button(@click='saveExtract', title='save button', :disabled='!newExtract', style='vertical-align:top;')
          icon(classes='ico-lg gray', name='fa-save')
        label.sr-only(for='delete-button') delete saved search: {{ selectedExtractName }}
        button#delete-button.usa-button(@click='deleteExtract', title='delete button', :disabled="selectedExtractName === ''")
          icon(classes='ico-lg gray', name='fa-trash-o')
    h4 Selected disasters list
    .message-wrapper
      .message-container(v-show='displayMessage', tabindex='0', ref='messages')
        div(:class='status.type')
          .message
            .ico
              icon(:classes='`ico-lg status-type ${status.type}`', :name='iconName()')
            .body
              div
                | {{status.message}}
            .close
              label.sr-only(for='extract-message-clear-button') Close {{ status.type }} message
              button#extract-message-clear-button.usa-button.clear-message(@click='hideMessage', title='extract message clear button')
                icon(classes='close-message', name='fa-times')
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
      button#clear-button.usa-button.alt-button(@click='clear') Clear
      a(:href='download()', tabindex='-1', download='')
        button#export-button.usa-button.green(:disabled='items.length === 0')
          | Export
          icon(classes='export', name='fa-sign-out')
</template>

<script>
import disaster from './Disaster'
import magic from '@/bus'
import moment from 'moment'
import _ from 'lodash'

export default {
  components: {disaster},
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
      return this.$store.getters.currentExtract
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
    displayMessage () {
      if (this.status.type === 'normal' || this.status.scope !== 'extract') return false
      this.$nextTick(() => this.$refs.messages.focus())
      return true
    },
    loading () {
      return this.$store.getters.loading
    }
  },
  methods: {
    download () {
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
      if (!confirm(`Are you sure you want to delete "${this.selectedExtractName}"`)) return
      this.$store.commit('deleteExtract', this.selectedExtractName)
      this.selectedExtractName = ''
      this.extractName = ''
    },
    loadExtract () {
      this.$store.commit('loadExtract', this.selectedExtractName)
    },
    hideMessage () {
      this.$store.commit('resetStatus')
    }
  }
}
</script>
<style lang="scss">
  //moved to 03-modules/_extracts.scss
</style>
