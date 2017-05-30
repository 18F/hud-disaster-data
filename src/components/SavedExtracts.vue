<template>
  <div class="extracts">
    <div id="saved_searches">
        <select v-show="!newExtract">
          <option v-for="extract in savedExtracts" value="extract.name">{{extract.name}}</option>
        </select>
        <input v-show="newExtract" v-model="extractName" name="extract-name" type="text"></input>
        <button @click="saveExtract" class="usa-button">
          <i class="fa fa-2x fa-save"></i>
        </button>
        <button class="usa-button">
          <i class="fa fa-2x fa-trash-o"></i>
        </button>
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
      extractName: ''
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
      this.$store.commit('saveExtract', this.extractName)
    }
  }
}
</script>
<style lang="scss">
/* Extract list styles --------------------------------- */
.extracts {
  background: url('/static/img/bg_80_opacity.png');
  overflow:hidden;
  border-radius:20px;
  padding:30px 20px;
}
.extracts div#saved_searches {
  height:70px;
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
  background: url('/static/img/bg_80_opacity.png');
  border:1px solid #000;
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
