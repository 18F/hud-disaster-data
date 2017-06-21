<template>
  <div class="wrapper container-fluid">
    <div class="row">
      <div class="col-xs-12 col-md-6 search-container">
        <div id="opaque-bg" class="row">
              <div class="col" id="message">
                <h2>Disaster search</h2>
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
                        <icon v-if="loading" classes="fa-spin" name="fa-spinner"></icon>
                        <template v-else>
                          <icon name="fa-search" v-show="isEmpty"></icon>
                          <a href="#" @click="reset" v-if="isDirty">
                            <icon classes="clear-text" name="fa-times"></icon>
                          </a>
                        </template>
                      </div>
                      <div class="message-wrapper">
                       <div class="messages" v-show="displayMessage" tabindex="0" ref="messages" id="search-message">
                         <div :class="status.type">
                           <icon :classes="`status-type ${status.type}`" :name="iconName()"></icon>
                           {{status.message}}
                           <label for="app-message-clear-button" class="sr-only">Close {{ status.type }} message</label>
                           <button @click="hideMessage" class="usa-button clear-message" title="app message clear button" id="app-message-clear-button">
                            <icon classes="close-message" name="fa-times"></icon>
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
    }
  }
}
</script>
<style src="../../public/assets/_scss/app.scss" lang="scss"/>
