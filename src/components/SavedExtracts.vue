<template>
  <div class="extracts">
    <div id="saved_searches">
      <div class="hdd-label">
        Saved searches
      </div>
      <div>
        <select required v-show="!newExtract" @change="loadExtract" v-model="selectedExtractName">
          <option value="" disabled selected>Select a search...</option>
          <option v-for="extract in savedExtracts" v-bind:value="extract.name">{{extract.name}}</option>
        </select>
        <label for="extract-name" class="sr-only">Search Name</label>
        <input v-show="newExtract" v-model="extractName" name="extract-name" id="extract-name" type="text" placeholder="Enter a name for your search"></input>
      </div>
      <div id="cta">
        <label for="save-button" class="sr-only">Save selected disaster search</label>
        <button @click="saveExtract" class="usa-button" id="save-button" :disabled="!newExtract" style="vertical-align:top;">
          <icon classes="ico-lg gray" name="fa-save"></icon>
        </button>
        <label for="delete-button" class="sr-only">delete saved search: {{ selectedExtractName }}</label>
        <button @click="deleteExtract" class="usa-button" id="delete-button" :disabled="selectedExtractName === ''">
          <icon classes="ico-lg gray" name="fa-trash-o"></icon>
        </button>
      </div>
    </div>
    <div class="hdd-label">
      Selected disasters list
    </div>
    <div class="message-wrapper">
      <div class="messages"  v-show="displayMessage" tabindex="0" ref="messages">
        <div :class="status.type">
          <div style="padding:10px; overflow:hidden;">
            <div id="container_03" style="float:left; width:10%; padding:5px;">
               <icon :classes="`ico-lg status-type ${status.type}`" :name="iconName()"></icon>
            </div>
            <div id="container_02" style="float:left; width:80%;">
              <div style="line-height: 20px; padding:12px 0;">
                {{status.message}}
              </div>
            </div>
            <div id="container_03" style="float:left;">
              <label for="extract-message-clear-button" class="sr-only">Close {{ status.type }} message</label>
              <button @click="hideMessage" class="usa-button clear-message" id="extract-message-clear-button">
                <icon classes="close-message" name="fa-times"></icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="list">
      <div class="list-loader" v-if="loading">
        <icon class="fa-spin ico-xl" name="fa-spinner"></icon>
        <span class="fa-spin-text">
          Loading ...
        </span>
        <span class="sr-only">Loading...</span>
      </div>
      <ul>
        <li v-for="(item, $item) in items">
          <disaster :prefix="'saved'" :item="item"></disaster>
        </li>
      </ul>
    </div>
    <div id="action-buttons">
      <button @click="clear" class="usa-button alt-button" id="clear-button">Clear</button>
      <a :href="download()" download>
      <button id='export-button' class="usa-button green" :disabled="items.length === 0">Export
        <icon classes="export" name="fa-sign-out"></icon>
      </button>
      </a>
    </div>
  </div>
</template>

<script>
import disaster from './Disaster'
import magic from '@/bus'
import moment from 'moment'

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
      if (this.selectedExtractName) return `/api/export/${this.selectedExtractName}`
      const timeStamp = moment().format('YYYY-MM-DD-kk:mm:ss')
      return `/api/export/${timeStamp}`
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
