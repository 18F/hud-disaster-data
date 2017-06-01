<template>
  <div class="extracts">
    <div id="saved_searches">
      <div id="search">
        <select required v-show="!newExtract" @change="loadExtract" v-model="selectedExtractName">
          <option value="" disabled selected>Saved searches......</option>
          <option v-for="extract in savedExtracts" v-bind:value="extract.name">{{extract.name}}</option>
        </select>
        <input v-show="newExtract" v-model="extractName" name="extract-name" type="text" placeholder="Enter a name for your search"></input>
      </div>
      <div id="cta">
        <button @click="saveExtract" class="usa-button" id="save-button">
          <i class="fa fa-2x fa-save"></i>
        </button>
        <button @click="deleteExtract" class="usa-button" id="delete-button">
          <i class="fa fa-2x fa-trash-o"></i>
        </button>
      </div>
    </div>
    <div id="message-wrapper">
      <div id="messages" v-show="displayMessage">
        <div :class="status.type">
          <i class="m-icon fa fa-lg"></i>
          {{status.message}}
          <i class="close-message fa fa-times" @click="hideMessage"></i>
        </div>
      </div>
    </div>
    <div id="list">
      <ul>
        <li v-for="(item, $item) in items">
          <disaster :item="item"></disaster>
        </li>
      </ul>
    </div>
    <div id="action-buttons">
      <button @click="clear" class="usa-button alt-button" id="clear-button">Clear</button>
      <button class="usa-button green">Export</button> <!-- disabled="true"  usa-button-disabled -->
    </div>
  </div>
</template>
<script>
import disaster from './Disaster'

export default {
  components: {disaster},
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
      return this.$store.getters.newExtract
    },
    status () {
      return this.$store.getters.status
    }
  },
  methods: {
    clear: function () {
      this.$store.commit('clearCurrentExtract')
      this.selectedExtractName = ''
    },
    saveExtract: function () {
      this.$store.commit('saveExtract', this.extractName)
      this.selectedExtractName = this.extractName
      this.extractName = ''
    },
    deleteExtract: function () {
      if (!confirm(`Are you sure you want to delete "${this.selectedExtractName}"`)) return
      this.$store.commit('deleteExtract', this.selectedExtractName)
      this.selectedExtractName = ''
      this.extractName = ''
    },
    loadExtract: function () {
      this.$store.commit('loadExtract', this.selectedExtractName)
    },
    displayMessage: function () {
      if (this.$store.getters.status.type === 'normal') return false
      return true
    },
    hideMessage: function () {
      this.$store.commit('resetStatus')
    }
  }
}
</script>
<style lang="scss">
/* Messages styles ------------------------------------ */
.normal { display:none; }
#message-wrapper { min-height:20px;  }
#messages {
    div {
      padding:1em;
      margin-top:20px;
    }
    i {
      color:#000;
      margin-right:10px;
    }
    .close-message:before { content:"\f00d"; }
    .close-message {
      cursor:pointer;
      position:relative;
      top:5px;
      left:5px;
      float:right;
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
}
/* Extract list styles --------------------------------- */
.extracts {
  background: url('/static/img/bg_50_opacity.png');
  overflow:hidden;
  border-radius:20px;
  padding:20px;

  div#saved_searches { height:50px; }
  div#search{
    float:left;
    width:75%;
  }
  div#search select:required:invalid { color:gray; }
  div#search option {
    color:#000;
  }
  div#cta {
    float:right;
    text-align:right;
    width:25%;
  }
  ul {
    display:block;
    margin:0;
    list-style-type: none;
  }
  li:before { content: ''; }
  li {
    background: white;
    display:block;
    border-bottom: 1px solid #ccc;
    margin:0;
    line-height:20px;
    cursor: pointer;
  }
}
.extracts div#saved_searches {
  select, input {
    float:left;
    display:block;
    max-height:44px;
  }
  select {
    -webkit-appearance: menulist;
    -moz-appearance: menulist;
    appearance: menulist;
  }
}
.extracts div#saved_searches button{
  background:transparent;
  border-radius:4px;
  margin:0;
  padding:10px;
}
.extracts div#saved_searches button:focus {
  box-shadow:none;
}
.extracts div#saved_searches i {
  cursor:pointer;
  float:left;
}
.extracts div#list {
  background: url('/static/img/bg_25_opacity.png');
  border:1px solid #353434;
  clear:both;
  overflow-y:scroll;
  overflow:auto;
  height:410px;
}
.extracts div#action-buttons {
  height:50px;
  margin-top:20px;
  text-align: right;

  button {
  margin-left:20px;
  margin-right:0;
  }
}
</style>
