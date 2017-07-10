<template lang="pug">
  .disaster.container-fluid
    .row
      .col-xs-12.col-sm-4.col-md-3
        h5 {{disasterId}}
        label.sr-only(v-if='item.currentExtract', :for='labelId')
          | {{ `Unselect ${disasterId} ${item.title} incident type:${item.incidentType} declaration date:${item.declarationDate}` }}
        label.sr-only(v-else='', :for='labelId')
          | {{ `Select ${disasterId} ${item.title} incident type:${item.incidentType} declaration date:${item.declarationDate}` }}
        button.select-button(@click='toggleSelected(item)', :id='labelId', :name='disasterId')
          icon.ico-xl(v-if='item.currentExtract', name='fa-check-square-o')
          icon.ico-xl(v-else='', name='fa-square-o')
      .col-xs-12.col-sm-8.col-md-9
        h5 {{ item.title }}
        div Incident Type: {{ item.incidentType }}
        div Declaration Date: {{ item.declarationDate }}
    .row
      .col-xs-12.col-sm-4.col-md-3
      .col-xs-12.col-sm-8.col-md-9
        label.sr-only(v-if='!showAreas' :for='`show-areas-${labelId}`') Show {{ item.declaredCountyArea.length }} affected areas for {{ disasterId }}
        label.sr-only(v-else :for='`hide-areas-${labelId}`') Hide {{ item.declaredCountyArea.length }} affected areas for {{ disasterId }}
        button.usa-button(v-if='!showAreas', @click='showAreas=!showAreas', :id='`show-areas-${labelId}`' :title='`Show Affected Areas for ${disasterId}`')
          | Show Affected Areas ({{ item.declaredCountyArea.length }}) &nbsp;
          icon(classes='affected-areas', name='fa-caret-down')
        button.usa-button-secondary(v-else, @click='showAreas=!showAreas', :id='`hide-areas-${labelId}`', :title='`Hide Affected Areas for ${disasterId}`')
          | Hide Affected Areas ({{ item.declaredCountyArea.length }}) &nbsp;
          icon(classes='affected-areas', name='fa-caret-up')
    .row
      .col-md-12
        .counties(v-show='showAreas', tabindex='0')
          div
            ul
              li(v-for='(area,index) in item.declaredCountyArea', :key='area.id')
                | {{ area }}
</template>
<script>
import { mapMutations } from 'vuex'
/**
* A disaster info card.  Used for adding and removing disasters from an extract
* @module components/Disaster
*/
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
//moved to 03-modules/_disaster.scss
</style>
