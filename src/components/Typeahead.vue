<template>
  <div class="wrapper">
    <div>
      <div class="Typeahead">
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
          <ul id="disaster-list" v-show="hasItems" class="disaster-list">
            <li v-for="(item, $item) in items" :class="activeClass($item)" @mousemove="setActive($item)">
              <disaster v-bind:item="item"></disaster>
            </li>
          </ul>
        </div>
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
.wrapper div:first-child {
  width:50%;
  margin:0 auto;
}
.Typeahead {  position: relative; padding:10px 0;}
.Typeahead__input {
  margin:0 auto;
  font-size: 14px;
  color: #2c3e50;
  line-height: 1.42857143;
  font-weight: 300;
  max-width:100%;
  border: 1px solid #ccc;
  letter-spacing: 1px;
  box-sizing: border-box;
}
.Typeahead__input:focus {
  outline: 0;
}

.fa-times { cursor: pointer; }
i {
  float: right;
  position: relative;
  top: 30px;
  right: 29px;
  opacity: 0.4;
}

#disaster-list {
  position: absolute;
  top:35px;
  border-right:1px solid #ccc;
  border-left:1px solid #ccc;
  padding: 0;
  min-width: 100%;
  background-color: #fff;
  list-style-type: none;
  z-index: 1000;
}
#disaster-list li:before { content: ''; }
#disaster-list li {
  display:block;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  margin:0;
  line-height:20px;
  cursor: pointer;
}
#disaster-list li:first-child {}
#disaster-list li:last-child {}

span {
  display: block;
  color: #2c3e50;
}

.active { background-color: #f1f1f1; }
.active span {
  color: white;
}

.name {
  font-weight: 700;
  font-size: 18px;
}
.screen-name { font-style: italic; }
</style>
