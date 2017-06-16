<template>
  <div class="extracts">
    <div id="saved_searches">
      <div>
        <select required v-show="!newExtract" @change="loadExtract" v-model="selectedExtractName">
          <option value="" disabled selected>Saved searches......</option>
          <option v-for="extract in savedExtracts" v-bind:value="extract.name">{{extract.name}}</option>
        </select>
        <label for="extract-name" class="sr-only">Search Name</label>
        <input v-show="newExtract" v-model="extractName" name="extract-name" id="extract-name" type="text" placeholder="Enter a name for your search"></input>
      </div>
      <div id="cta">
        <label for="save-button" class="sr-only">Save selected disaster search</label>
        <button @click="saveExtract" class="usa-button" id="save-button" :disabled="!newExtract" style="vertical-align:top;">
          <!-- <i class="fa fa-2x fa-save"></i> -->
          <svg class="hdd-icon ico-lg gray">
            <use xlink:href="#fa-save"></use>
          </svg>
        </button>
        <label for="delete-button" class="sr-only">delete saved search: {{ selectedExtractName }}</label>
        <button @click="deleteExtract" class="usa-button" id="delete-button" :disabled="selectedExtractName === ''">
          <!-- <i class="fa fa-2x fa-trash-o"></i> -->
          <svg class="hdd-icon ico-lg gray">
            <use xlink:href="#fa-trash-o"></use>
          </svg>
        </button>
      </div>
    </div>
    <div class="message-wrapper">
      <div class="messages" v-show="displayMessage" tabindex="0" ref="messages">
        <div :class="status.type">
          <svg :class="`hdd-icon status-type ${status.type }`"><use :xlink:href="iconName()"></use></svg>
          {{status.message}}
          <label for="extract-message-clear-button" class="sr-only">Close {{ status.type }} message</label>
          <button @click="hideMessage" class="usa-button clear-message" id="extract-message-clear-button">
            <svg class="hdd-icon close-message"><use xlink:href="#fa-times"></use></svg>
          </button>
        </div>
      </div>
    </div>
    <div id="list">
      <div v-if="loading">
        <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
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
      <button id='export-button' class="usa-button green" :disabled="items.length === 0">Export 
        <svg class="hdd-icon export">
          <use xlink:href="#fa-sign-out"></use>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import disaster from './Disaster'
import magic from '@/bus'
const messages = {
  success: '#fa-check-circle',
  error: '#fa-times-circle',
  warning: 'fa-warning',
  info: '#fa-info-circle'
}

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
    },
    iconName () {
      return messages[this.status.type]
    }
  }
}
</script>
<style lang="scss">
//moved to 03-modules/_extracts.scss
</style>
