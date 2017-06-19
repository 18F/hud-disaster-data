<template>
  <div class="wrapper container-fluid">
    <div class="row">
      <div class="col-xs-12 col-md-6 search-container">
        <div id="opaque-bg" class="row">
              <div class="col" id="message">
                <h3>Disaster search</h3>
              </div>
              <div class="col Typeahead">
                <div id="search">
                    <div class="offset-bg">
                      <div class="search-wrapper">
                        <label for="search-text" class="sr-only">search FEMA disasters</label>
                        <input type="text" id="search-text"
                                 ref="searchText"
                                 class="Typeahead__input"
                                 placeholder="Search by disaster number, type, or state"
                                 autocomplete="off"
                                 v-model="query"
                                 @keydown.esc="reset"
                                 @input="update"/>
                        <i class="fa fa-spinner fa-spin" v-if="loading"></i>
                        <template v-else>
                          <svg class="hdd-icon" v-show="isEmpty">
                            <use xlink:href="#fa-search"></use>
                          </svg>
                          <svg class="hdd-icon clear-text" v-show="isDirty" @click="reset">
                            <use xlink:href="#fa-times"></use>
                          </svg>
                        </template>
                      </div>
                      <div class="message-wrapper">
                       <div class="messages" v-show="displayMessage" tabindex="0" ref="messages" id="search-message">
                         <div :class="status.type">
                           <svg :class="`hdd-icon status-type ${status.type }`"><use :xlink:href="iconName()"></use></svg>
                           {{status.message}}
                           <label for="app-message-clear-button" class="sr-only">Close {{ status.type }} message</label>
                           <button @click="hideMessage" class="usa-button clear-message" id="app-message-clear-button">
                             <svg class="hdd-icon close-message"><use xlink:href="#fa-times"></use></svg>
                           </button>
                         </div>
                       </div>
                      </div>
                      <div v-show="hasItems" class="disaster-list">
                        <ul class="disaster-search-recs">
                          <li v-for="(item, $item) in items">
                            <disaster :prefix="'search'" :item="item"></disaster>
                          </li>
                        </ul>
                      </div>
                      <div class="link-advanced-search">
                          <a href="#">Advanced Search</a>
                      </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <div class="col-xs-12 col-md-6 no-padding">
        <savedExtracts ref="extracts"></savedExtracts>
      </div>
    </div>
  </div>
</template>

<script>
import disaster from './Disaster'
import savedExtracts from './SavedExtracts'
import magic from '@/bus'
const messages = {
  success: '#fa-check-circle',
  error: '#fa-times-circle',
  warning: 'fa-warning',
  info: '#fa-info-circle'
}

export default {
  components: {disaster, savedExtracts},
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
    },
    displayMessage () {
      if (this.status.type === 'normal' || this.status.scope !== 'app') return false
      return true
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
<style src="../../public/assets/_scss/app.scss" lang="scss"/>
