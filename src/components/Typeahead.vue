<template>
  <div class="Typeahead">
    <div id="search">
      <i class="fa fa-spinner fa-spin" v-if="loading"></i>
      <template v-else>
        <i class="fa fa-search" v-show="isEmpty"></i>
        <i class="fa fa-times" v-show="isDirty" @click="reset"></i>
      </template>
      <input type="text"
             class="Typeahead__input"
             placeholder="Search disaster #"
             autocomplete="off"
             v-model="query"
             @keydown.down="down"
             @keydown.up="up"
             @keydown.enter="hit"
             @keydown.esc="reset"
             @input="update"/>

      <ul v-show="hasItems" class="disaster-list">
        <li v-for="(item, $item) in items" :class="activeClass($item)" @mousemove="setActive($item)">
          <disaster v-bind:item="item"></disaster>
        </li>
      </ul>
    </div>
    <savedExtracts></savedExtracts>
  </div>
</template>

<script>
import VueTypeahead from '../lib/TypeAhead'
import disaster from './Disaster'
import savedExtracts from './SavedExtracts'

export default {
  extends: VueTypeahead,
  components: {disaster, savedExtracts},
  data () {
    return {
      src: '/api/disasters/',
      limit: 10,
      minChars: 2,
      queryParamName: null
    }
  },
  methods: {
    onHit (item) {
      this.query = `${item.disasterType}-${item.disasterNumber}-${item.state}`
      this.update()
    }
  }
}
</script>


<style src="../../public/assets/css/font-awesome.min.css"/>

<style scoped>
.Typeahead {
  position: relative;
}

.Typeahead__input {
  width: 100%;
  font-size: 14px;
  color: #2c3e50;
  line-height: 1.42857143;
  box-shadow: inset 0 1px 4px rgba(0,0,0,.4);
  -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
  transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
  font-weight: 300;
  padding: 12px 26px;
  border: none;
  border-radius: 22px;
  letter-spacing: 1px;
  box-sizing: border-box;
}

.Typeahead__input:focus {
  border-color: #4fc08d;
  outline: 0;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px #4fc08d;
}

.fa-times {
  cursor: pointer;
}

i {
  float: right;
  position: relative;
  top: 30px;
  right: 29px;
  opacity: 0.4;
}

ul {
  position: absolute;
  padding: 0;
  margin-top: 8px;
  min-width: 100%;
  background-color: #fff;
  list-style: none;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0,0,0, 0.25);
  z-index: 1000;
}

li {
  padding: 10px 16px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}

li:first-child {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

li:last-child {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-bottom: 0;
}

span {
  display: block;
  color: #2c3e50;
}

.active {
  background-color: #3aa373;
}

.active span {
  color: white;
}

.name {
  font-weight: 700;
  font-size: 18px;
}

.screen-name {
  font-style: italic;
}
.disaster {
     font-family:sans-serif;
     padding:10px;
 }
 .disaster a, .disaster a:hover, .disaster a:active {
   text-decoration:none;
 }
 .disaster .name {
     font-weight:bold;
     padding-bottom:20px;
 }
 .disaster .name div:first-child {
   float:left;
   padding-right:15px;
 }
 .disaster .declaration div { float:right; }
 .disaster .declaration div:first-child {
   float:left;
 }
 .disaster .declaration i { margin-left:5px; }
 .disaster .counties {
     clear:both;
     display:block;
     padding:10px 0;
 }
 .disaster .counties div {
   background:#f7f7f7;
   border:1px solid #eee;
 }
 .disaster .counties ul {
     list-style-type:none;
     margin:0;
     padding:10px;
 }
</style>
