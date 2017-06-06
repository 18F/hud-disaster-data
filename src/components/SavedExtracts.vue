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
        <button @click="saveExtract" class="usa-button" id="save-button" :disabled="!newExtract">
          <i class="fa fa-2x fa-save"></i>
        </button>
        <label for="delete-button" class="sr-only">delete saved search: {{ selectedExtractName }}</label>
        <button @click="deleteExtract" class="usa-button" id="delete-button" :disabled="selectedExtractName === ''">
          <i class="fa fa-2x fa-trash-o"></i>
        </button>
      </div>
    </div>
    <div class="message-wrapper">
      <div class="messages" v-show="displayMessage" tabindex="0" ref="messages">
        <div :class="status.type">
          <i class="m-icon fa fa-lg"></i>
          {{status.message}}
          <label for="extract-message-clear-button" class="sr-only">Close {{ status.type }} message</label>
        </div>
        <button @click="hideMessage" class="usa-button clear-message" id="extract-message-clear-button">
          <i class="close-message fa fa-times"></i>
        </button>
      </div>
    </div>
    <div id="list">
      <ul>
        <li v-for="(item, $item) in items">
          <disaster :prefix="'saved'" :item="item"></disaster>
        </li>
      </ul>
    </div>
    <div id="action-buttons">
      <button @click="clear" class="usa-button alt-button" id="clear-button">Clear</button>
      <button class="usa-button green">Export <i class="fa fa-sign-out"></i></button> <!-- disabled="true"  usa-button-disabled -->
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
    }
  },
  methods: {
    clear () {
      this.$store.commit('clearCurrentExtract')
      this.selectedExtractName = ''
    },
    saveExtract () {
      this.$store.commit('saveExtract', this.extractName)
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
/* Messages styles ------------------------------------ */
.normal { display:none; }
/* Extract list styles --------------------------------- */
.extracts {
  background: url('/static/img/bg_50_opacity.png');
  overflow:hidden;
  border-radius:10px;
  padding:20px;

  div#saved_searches {
    height:50px;

    select, input {
      float:left;
      display:block;
      max-height:44px;
    }
    select {
      -webkit-appearance: none;
      -webkit-border-radius: 0px;
      background: url("data:image/svg+xml;utf8,%3Csvg%20version%3D%271.1%27%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20xmlns%3Axlink%3D%27http%3A//www.w3.org/1999/xlink%27%20width%3D%2724%27%20height%3D%2724%27%20viewBox%3D%270%200%2024%2024%27%3E%3Cpath%20fill%3D%27%23000%27%20d%3D%27M7.406%207.828l4.594%204.594%204.594-4.594%201.406%201.406-6%206-6-6z%27%3E%3C/path%3E%3C/svg%3E");
      background-position: 100% 50%;
      background-repeat: no-repeat;
      background-color: white;
      height: 44px;
    }

    button {
      background:transparent;
      border-radius:4px;
      margin:0;
      padding:10px;

      &:focus {
        box-shadow:none;
      }
    }

    i {
      cursor:pointer;
      float:left;
    }

    &>div {
      float:left;
      width:75%;

      select:required:invalid { color:gray; }
      option {
        color:#000;
      }
    }
    &>div#cta {
      float:right;
      text-align:right;
      width:25%;

      button[disabled=disabled] {
        color: gray;
        opacity: 0.3;
      }
    }

  }

  ul {
    display:block;
    margin:0;
    list-style-type: none;
  }
  li:before { content: ''; }
  li {
    &:hover {
       background: #f1f1f1;
       span {
          color: white;
        }
      }
    background: white;
    display:block;
    border-bottom: 1px solid #ccc;
    margin:0;
    line-height:20px;
    cursor: pointer;
  }

  div#list {
    background: url('/static/img/bg_25_opacity.png');
    border:1px solid #353434;
    clear:both;
    overflow-y:scroll;
    overflow:auto;
    height:410px;
  }

  div#action-buttons {
    height:50px;
    margin-top:20px;
    text-align: right;

    button {
    margin-left:20px;
    margin-right:0;
    }
  }
}
</style>
