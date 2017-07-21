<template lang="pug">
  div
    selectLocationSideBar
    div.col-lg-8(style="padding:0 20px; border:1px solid #ff0000;min-height:700px;")
      .col-lg-6
        table.usa-table-borderless.report-summary(style="color: #fff;")
          tr
            th State:
            td {{ stateName }}
          tr
            th Disaster(s):
            td {{ selectedDisasters }}
          tr
            th Geographic Level:
            td City
          tr
            th Selected Locations:
            td {{ selectedLocales }}
</template>

<style lang="scss">
  .report-summary {
    tr {
      th:first-child {
        width: 19rem;
        border: 0;
        padding: 0;
      }

      td {
        border: 0;
        padding: 0;
        font-weight: normal;
      }
    }
  }
</style>

<script>
import selectLocationSideBar from './SelectLocationSideBar'
import { mapGetters } from 'vuex'
import _ from 'lodash'
/**
* Component responsible for displaying a report or reports.  This is just a stub, at this time.
* @module components/Report
*/
export default {
  name: 'report',
  components: {selectLocationSideBar},
  computed: {
    ...mapGetters([
      'selectedState',
      'selectedLocales',
      'selectedDisasters'
    ]),
    stateName () {
      return _.get(this.selectedState, 'name') || ''
    }
  }
}
</script>
