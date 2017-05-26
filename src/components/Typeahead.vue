<template>
  <div class="wrapper container-fluid">
    <div class="row">
      <div class="col-xs-12 col-md-6 search-container">
        <div id="opaque-bg" class="row" >
              <div class="col" id="message">
                <h3>{{ msg }}</h3>
              </div>
              <div class="col Typeahead">
                <div id="search">
                    <div class="offset-bg">
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
                               <i class="fa fa-spinner fa-spin" v-if="loading"></i>
                                 <template v-else>
                                   <i class="fa fa-search" v-show="isEmpty"></i>
                                   <i class="fa fa-times" v-show="isDirty" @click="reset"></i>
                                 </template>
                      <div v-show="hasItems" class="disaster-list">
                        <ul>
                           <li v-for="(item, $item) in items" :class="activeClass($item)" @mousemove="setActive($item)">
                             <disaster :item="item" v-on:selected="onSelected" ref="disaster"></disaster>
                           </li>
                        </ul>
                      </div>
                    </div>
                </div>
                <div class="link-advanced-search">
                  <a href="#">Advanced Search</a>
                </div>
            </div>
        </div>
      </div>
      <div class="col-xs-12 col-md-6" style="border:1px solid #00ff00; background:#000; overflow:auto; border-radius:20px;">
        <savedExtracts ref="extracts" v-on:unselected="onUnSelected"></savedExtracts>
      </div>
    </div>
  </div>
</template>

<script>
import VueTypeahead from '../lib/TypeAhead'
import disaster from './Disaster'
import savedExtracts from './SavedExtracts'
import _ from 'lodash'

export default {
  extends: VueTypeahead,
  components: {disaster, savedExtracts},
  data () {
    return {
      msg: 'Relax, Finding things just got easier!',
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
    },
    onSelected (item) {
      this.$refs.extracts.add(item)
    },
    onUnSelected (item) {
      var disaster = _.find(this.$refs.disaster, function (disaster) {
        return disaster.item.disasterType === item.disasterType && disaster.item.disasterNumber === item.disasterNumber && disaster.item.state === item.state
      })
      if (disaster) disaster.selected = false
    }
  }
}
</script>


<style src="../../public/assets/css/font-awesome.min.css"/>
<style>
/* global overrides ----------------------------------- */
.wrapper input[type="text"] { width:100%; max-width:100%; }
.r-align { text-align: right;}

#opaque-bg {
  background: url('/static/img/bg_80_opacity.png');
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  margin:0 auto;
  overflow: hidden;
}
.offset-bg {
  padding:0 50%;
}
#message {
  color: #fff;
  text-align: center;
  height:50px;
}
.search-container {
  margin:75px 0;
  padding:0;
}
#search .fa-times { cursor:pointer; opacity:0.4;}
#search .fa-search, #search .fa-times, #search .fa-spinner {
  float: right;
  position: relative;
  top: -35px;
  right: 20px;
}

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

/* Disaster list styles --------------------------------- */
.disaster-list {
  background-color: #fff;
  height:450px;
  left:41px;
  overflow-x:hidden;
  overflow-y:scroll;
  padding:0;
  position: absolute;
  right:41px;
  top:135px;
  z-index: 1000;
}
.disaster-list ul {
  display:block;
  margin:0;
  list-style-type: none;
}
.disaster-list li:before { content: ''; }
.disaster-list li {
  display:block;
  border-bottom: 1px solid #ccc;
  margin:0;
  line-height:20px;
  cursor: pointer;
}

span {
  display: block;
  color: #2c3e50;
}

.active { background-color: #f1f1f1; }
.active span {
  color: white;
}
.screen-name { font-style: italic; }
</style>
