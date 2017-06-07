<template>
  <div class="disaster container-fluid">
    <div class="row">
      <div class="col-xs-12 col-sm-4 col-md-3">
          <h5>{{disasterId}}</h5>
          <label v-if="item.currentExtract" :for="labelId" class="sr-only">{{ `Unselect ${disasterId} ${item.title} incident type:${item.incidentType} declaration date:${item.declarationDate}` }}</label>
          <label v-else :for="labelId" class="sr-only">{{ `Select ${disasterId} ${item.title} incident type:${item.incidentType} declaration date:${item.declarationDate}` }}</label>
          <button @click="toggleSelected(item)" class="select-button" :id="labelId" :name="disasterId">
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
        <label :for="`show-areas-${labelId}`" class="sr-only">Show {{ item.declaredCountyArea.length }} affected areas for {{ disasterId }}</label>
        <label :for="`hide-areas-${labelId}`" class="sr-only">Hide {{ item.declaredCountyArea.length }} affected areas for {{ disasterId }}</label>
        <button v-if="!showAreas" @click="showAreas=!showAreas" class="usa-button" :id="`show-areas-${labelId}`">({{ item.declaredCountyArea.length }}) Affected Areas <i class="fa fa-caret-down"></i></button>
        <button v-else="!showAreas" @click="showAreas=!showAreas" class="usa-button-secondary" :id="`hide-areas-${labelId}`"> ({{ item.declaredCountyArea.length }}) Affected Areas <i class="fa fa-caret-up"></i></button>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="counties" v-show="showAreas" tabindex="0">
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
  props: ['item', 'prefix'],
  data () {
    return {
      showAreas: false,
      selected: false
    }
  },
  computed: {
    labelId () {
      return `${this.prefix}-${this.disasterId}`
    },
    disasterId () {
      return `${this.item.disasterType}-${this.item.disasterNumber}-${this.item.state}`
    }
  },
  methods: {
    ...mapMutations({
      toggleSelected: 'toggleCurrentExtract'
    })
  }
}
</script>
<style lang="scss">
$check-color: #2e8540;

.disaster {
  font-size:15px;
  button:focus {
    outline: 1px dotted $check-color;
  }
  .select-button {
    background:transparent;
    color:#000;
    margin: 0 2rem;
    padding: 0;
    &:focus {
      box-shadow:none;
    }
  }
  input[type="checkbox"] {
    position:relative;
    left:0;
    width:24px;
    height:24px;
  }
  h5 {
    font-family: "Source Sans Pro", "Roboto", sans-serif;
  }
  i.fa-check-square-o {
    color: $check-color;
  }
  .counties {
    background-color:#fff;
    border:1px solid #ccc;
    padding:10px;
    margin-top:10px;

    ul li {
      border:none;
      display: block;
    }
  }
}
</style>
