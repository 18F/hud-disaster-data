<template>
  <div class="disaster container-fluid">
    <div class="row">
      <div class="col-xs-12 col-sm-4 col-md-3">
          <h5>{{ `${item.disasterType}-${item.disasterNumber}-${item.state}` }}</h5>
          <button @click="toggleSelected(item)" class="select-button">
            <i v-if="item.currentExtract" class="fa fa-3x fa-check-square-o"></i>
            <i v-else class="fa fa-3x fa-square-o"></i>
          </button>
      </div>
      <div class="col-xs-12 col-sm-8 col-md-9">
        <h5>{{ item.title }}</h5>
        <div>Incident Type: {{ item.incidentType }}</div>
        <div>Declaration Date: {{ item.declarationDate }}</div>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-sm-4 col-md-3"></div>
      <div class="col-xs-12 col-sm-8 col-md-9">
        <button v-if="!showAreas" @click="showAreas=!showAreas" class="usa-button">View Affected Areas ({{ item.declaredCountyArea.length }})</button>
        <button v-else="!showAreas" @click="showAreas=!showAreas" class="usa-button">Hide Affected Areas ({{ item.declaredCountyArea.length }})</button>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
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
      toggleSelected: 'toggleCurrentExtract'
    })
  }
}
</script>
<style>
.disaster { font-size:15px; }
.disaster .select-button {
  background:transparent;
  color:#000;
  outline:none;
  padding-top:0;
  padding-bottom:0;
}
.disaster .select-button:focus {
  box-shadow:none;
}

.disaster input[type="checkbox"] {
  position:relative;
  left:0;
  width:24px;
  height:24px;
}
.disaster h5 {
  font-family: "Source Sans Pro", "Roboto", sans-serif;
}
.counties {
  background-color:#fff;
  border:1px solid #ccc;
  padding:10px;
  margin-top:10px;
}
.counties ul li {
  border:none;
  display: block;
  }
</style>
