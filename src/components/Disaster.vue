<template>
  <div class="disaster">
    <div class="name">
      <div>{{ `${item.disasterType}-${item.disasterNumber}-${item.state}` }}</div>
      <div>{{ item.title }}</div>
    </div>
    <div style="clear:both; float:right; padding:10px 5px;">
      <button class="select-button" @click="select(item)" v-bind:disabled="item.currentExtract" style="background:transparent; outline:none;">
        <i v-if="item.currentExtract" class="fa fa-2x fa-check-square-o" style="color:#000; cursor:pointer;"></i>
        <i v-else class="fa fa-2x fa-square-o" style="color:#000; cursor:pointer;"></i>
      </button>
    </div>
    <div style="clear:both;">
        Incident Type: {{ item.incidentType }}
    </div>
    <div>
      <div style="width:50%; float:left;">
        Declaration Date: {{ item.declarationDate }}
      </div>
      <div style="width:50%; float:left; text-align:right;">
        <a @click="showAreas=!showAreas">Affected Areas<i class="fa fa-caret-down"></i></a>
      </div>
    </div>
    <div class="counties" v-show="showAreas">
      <div>
        <ul>
          <li v-for="(area,index) in item.declaredCountyArea" :key="area.id">
            {{ area }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'

export default {
  props: ['item'],
  data () {
    return {
      showAreas: false,
      selected: false
    }
  },
  methods: {
    ...mapMutations({
      select: 'addToCurrentExtract'
    })
  }
}
</script>
<style>
.select-button{}
.disaster {   padding-bottom:10px; background:#fff;}
.disaster input[type="checkbox"] {
  position:relative;
  left:0;
  width:24px;
  height:24px;
}
.disaster .name {
  font-weight:bold;
}
.disaster .name div:first-child {
  float:left;
  height:40px;
  padding-right:15px;
}
.disaster i {
  position:relative;
  top:0;
  right:0;
  margin-left:10px;
  opacity:1.0;
}
</style>
