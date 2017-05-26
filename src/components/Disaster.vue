<template>
  <div class="disaster container-fluid">
    <div class="row">
      <div class="col-xs-12 col-sm-4 col-md-3">
          <h5>{{ `${item.disasterType}-${item.disasterNumber}-${item.state}` }}</h5>
      </div>
      <div class="col-xs-12 col-sm-8 col-md-9">
        <h5>{{ item.title }}</h5>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <button @click="toggleSelected(item)">
          <i v-if="item.currentExtract" class="fa fa-3x fa-check-square-o"></i>
          <i v-else class="fa fa-3x fa-square-o"></i>
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        Incident Type: {{ item.incidentType }}
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-sm-9 col-md-8">
          Declared Date: {{ item.declarationDate }}
      </div>
      <div class="col-xs-12 col-sm-3 col-md-4 r-align">
          <a @click="showAreas=!showAreas">Affected Areas (00)</a>
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
.disaster {
  padding-bottom:10px;
  font-size:15px;
}
.disaster button {
  background:transparent;
  color:#000;
  outline:none;
}
.disaster button:focus {
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
  margin-top:20px;
}
.counties ul li {
  border:none;
  display: block;
  }
</style>
