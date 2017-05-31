<template>
  <div class="extracts">
    <div id="saved_searches">
        <select v-show="!newExtract" @change="loadExtract" v-model="selectedExtractName">
          <option v-for="extract in savedExtracts" v-bind:value="extract.name">{{extract.name}}</option>
        </select>
        <input v-show="newExtract" v-model="extractName" name="extract-name" type="text"></input>
        <button @click="saveExtract" class="usa-button">
          <i class="fa fa-2x fa-save"></i>
        </button>
        <button @click="deleteExtract" class="usa-button">
          <i class="fa fa-2x fa-trash-o"></i>
        </button>
    </div>
    <div id="message-wrapper">
      <div id="messages">
        <div class="success">
          <i class="fa fa-lg"></i>
          Successfully saved! <!-- DYNAMIC MESSAGE HERE -------------------- -->
        </div>
        <i class="close-message fa fa-times"></i>
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
      <button disabled="true" class="usa-button usa-button-disabled">Export</button>
      <button @click="clear" class="usa-button">Clear</button>
    </div>
  </div>
</template>
<script>
import disaster from './Disaster'
import { mapMutations } from 'vuex'

export default {
  components: {disaster},
  data: function () {
    return {
      extractName: '',
      selectedExtractName: this.$store.getters.defaultExtractName || ''
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
    }
  },
  methods: {
    ...mapMutations({
      clear: 'clearCurrentExtract'
    }),
    saveExtract: function () {
      try {
        this.$store.commit('saveExtract', this.extractName)
      } catch (e) {
        console.log(e)
      }
      this.selectedExtractName = this.extractName
      this.extractName = ''
    },
    deleteExtract: function () {
      if (!confirm(`Are you sure you want to delete "${this.selectedExtractName}"`)) return
      try {
        this.$store.commit('deleteExtract', this.selectedExtractName)
        this.selectedExtractName = this.$store.getters.defaultExtractName
      } catch (e) {
        console.log(e)
      }
      this.extractName = ''
    },
    loadExtract: function () {
      this.$store.commit('loadExtract', this.selectedExtractName)
    }
  }
}
</script>
<style lang="scss">
/* Messages styles ------------------------------------ */
#message-wrapper { min-height:20px; }
#messages {
    div {
      display:none;
      border:1px solid #000;
      padding:1em;
      position:relative;
      top:20px;
    }
    i {
      color:#000;
      margin-right:10px;
    }
    .close-message {
      cursor:pointer;
      position:relative;
      top:-20px;
      right:5px;
      float:right;
      opacity:.4;
    }
    .success { background:#e7f4e4; }
    .success i:before { content: "\f058"; }
    .fail { background:#f9dede; }
    .fail i:before { content: "\f057"; }
    .warning { background: #fff1d2; }
    .warning i:before { content:"\f071"; }
    .info { background:#e1f3f8; }
    .info i:before { content: "\f05a"; }
}
/* Extract list styles --------------------------------- */
.extracts {
  background: url('/static/img/bg_80_opacity.png');
  overflow:hidden;
  border-radius:20px;
  padding:30px 20px;
}
.extracts div#saved_searches {
  height:50px;
}
.extracts div#saved_searches {
  select, input {
    float:left;
    margin-right:20px;
    width:75%;
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
  background: url('/static/img/bg_35_opacity.png');
  border:1px solid #353434;
  clear:both;
  overflow-y:scroll;
  overflow:auto;
  height:410px;
}

.extracts ul {
  display:block;
  margin:0;
  list-style-type: none;
}
.extracts li:before { content: ''; }
.extracts li {
  background: white;
  display:block;
  border-bottom: 1px solid #ccc;
  margin:0;
  line-height:20px;
  cursor: pointer;
}

.extracts div#action-buttons {
  height:50px;
  margin-top:20px;
}
.extracts div#action-buttons button {
  margin-left:20px;
  float:right;
}
</style>
