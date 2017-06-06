<template>
  <div class="wrapper container-fluid">
    <div class="row">
      <div class="col-xs-12 col-md-6 search-container">
        <div id="opaque-bg" class="row">
              <div class="col" id="message">
                <h3>Relax, Finding things just got easier!</h3>
              </div>
              <div class="col Typeahead">
                <div id="search">
                    <div class="offset-bg">
                      <div class="search-wrapper">
                        <label for="search-text" class="sr-only">search FEMA disasters</label>
                        <input type="text" id="search-text"
                                 class="Typeahead__input"
                                 placeholder="Search by disaster number, type, or state"
                                 autocomplete="off"
                                 v-model="query"
                                 @keydown.esc="reset"
                                 @input="update"/>
                        <i class="fa fa-spinner fa-spin" v-if="loading"></i>
                        <template v-else>
                          <i class="fa fa-search" v-show="isEmpty"></i>
                          <i class="fa fa-times" v-show="isDirty" @click="reset"></i>
                        </template>
                      </div>
                      <div class="message-wrapper">
                       <div class="messages" v-show="displayMessage" tabindex="0" ref="messages">
                         <div :class="status.type">
                           <i class="m-icon fa fa-lg"></i>
                           {{status.message}}
                           <label for="app-message-clear-button" class="sr-only">Close {{ status.type }} message</label>
                         </div>
                         <button @click="hideMessage" class="usa-button clear-message" id="app-message-clear-button">
                           <i class="close-message fa fa-times"></i>
                         </button>
                       </div>
                      </div>
                      <div v-show="hasItems" class="disaster-list">
                        <ul class="disaster-search-recs">
                          <li v-for="(item, $item) in items">
                            <disaster :prefix="'search'" :item="item"></disaster>
                          </li>
                        </ul>
                      </div>
                    </div>
                </div>
                <div class="link-advanced-search">
                  <!-- <a href="#">Advanced Search</a> -->
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
import store from '../store'

export default {
  components: {disaster, savedExtracts},
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
      return this.items.length > 0
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
      store.commit({type: 'clearSearch'})
    },
    hideMessage () {
      this.$store.commit('resetStatus')
    }
  }
}
</script>


<style src="../../public/assets/css/font-awesome.min.css"/>
<style src="../../public/assets/_scss/app.scss" lang="scss"/>
<style lang="scss">
/* global overrides ----------------------------------- */
span {
  display: block;
  color: #2c3e50;
}

.screen-name { font-style: italic; }
.no-padding { padding: 0; }
.wrapper input[type="text"] { width:100%; max-width:100%; }

#opaque-bg {
  background: url('/static/img/bg_50_opacity.png');
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  margin:0 auto;
  overflow: hidden;
}
.offset-bg {
  padding:0 10px 0 30px;
}
.message-wrapper { min-height:20px;  }
.messages {
    position: relative;
    div {
      padding:1em;
      padding-right: 3em;
      margin-top:20px;
      padding-left: 2.5em;
    }
    i {
      color:#000;
      margin-right:10px;
      margin-left: -1.5em;
    }
    .close-message:before { content:"\f00d"; }
    .close-message {
      cursor:pointer;
      position:absolute;
      top:0;
      right:0;
      opacity:.4;
    }
    .success { background:#e7f4e4; }
    .success .m-icon:before { content: "\f058"; }
    .error { background:#f9dede; }
    .error .m-icon:before { content: "\f057"; }
    .warning { background: #fff1d2; }
    .warning .m-icon:before { content:"\f071"; }
    .info { background:#e1f3f8; }
    .info .m-icon:before { content: "\f05a"; }
    .usa-button.clear-message {
    	background: transparent;
      cursor:pointer;
      position:absolute;
      top:.8em;
      right:0;
      opacity:.4;
    }
}

.search-container {
  margin-top:125px;
  padding:0;

  div#message {
    color: #fff;
    text-align: center;
    height:50px;
  }

  .search-wrapper {
    .fa-times { cursor:pointer; }
    .fa {
      float: right;
      font-size:24px;
      position: relative;
      top: -40px;
      right: 18px;
    }
  }
  .disaster-list {
    background-color: #fff;
    box-shadow:0 5px 10px #000;
    height:355px;
    left:31px;
    overflow-x:hidden;
    overflow-y:scroll;
    padding:0;
    position: absolute;
    right:11px;
    top:136px;
    z-index: 1000;
    ul {
      display:block;
      margin:0;
      list-style-type: none;
      li {
        display:block;
        border-bottom: 1px solid #ccc;
        margin:0;
        line-height:20px;
        cursor: pointer;
        &:before { content: ''; }
        &:hover {
          background-color: #f1f1f1;
          span {
            color: white;
          }
        }
      }
    }
  }
}


/* Disaster list styles --------------------------------- */
/* Typeahead styles ----------------------------------- */
.Typeahead {
  padding-bottom:20px;
}
.Typeahead__input {
  font-size: 14px;
  color: #2c3e50;
  line-height: 1.42857143;
  font-weight: 300;
  border: 1px solid #ccc;
  letter-spacing: 1px;
  box-sizing: border-box;
}
.Typeahead__input:focus {
  outline: 0;
}
.link-advanced-search {
  padding:20px 40px;
  text-align:right;
}
</style>
