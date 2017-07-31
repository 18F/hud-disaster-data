<template lang="pug">
  div
    selectLocationSideBar
    div.col-xs-12.col-sm-12.col-md-8.col-lg-8.reports
      div.col-lg-12
        h1
          |Summary Report
      div.col-lg-12.report-summary
        table.usa-table-borderless
          tr
            td
              |State: {{ stateName }}
            td(id="creationDate")
              |Created on: {{ new Date() }}
          tr
            td(colspan="2")
              |Disaster(s): {{ disasters }}
          tr
            td(colspan="2")
              |Geographic Level: {{ level }}
          tr
            td(colspan="2")
              |Selected Locations: {{ locales }}
        value-selector
        table.report-values-header
          thead
            tr
              th Type
              th Amount
        div.report-values
          table
              tr
                td Unmet Need
                td $999,999,999
              tr
                td Total Damages
                td $999,999,999
              tr
                td Average Household Income
                td $999,999,999
              tr
                td &nbsp;
                td
              tr
                td Unmet Need
                td $999,999,999
              tr
                td Total Damages
                td $999,999,999
              tr
                td Average Household Income
                td $999,999,999
              tr
                td &nbsp;
                td
              tr
                td Unmet Need
                td $999,999,999
              tr
                td Total Damages
                td $999,999,999
              tr
                td Average Household Income
                td $999,999,999
              tr
                td &nbsp;
                td
              tr
                td BBBBBBBBBBBB
                td
              tr
                td &nbsp;
                td
              tr
                td Total Households
                td 999,999,999
</template>
<script>
import selectLocationSideBar from './SelectLocationSideBar'
import valueSelector from './ValueSelector'
import { mapGetters } from 'vuex'
import _ from 'lodash'
/**
* Component responsible for displaying a report or reports.  This is just a stub, at this time.
* @module components/Report
*/
export default {
  name: 'report',
  components: {selectLocationSideBar, valueSelector},
  computed: {
    ...mapGetters([
      'stateFilter',
      'localeFilter',
      'disasterFilter',
      'geographicLevel'
    ]),
    stateName () {
      return _.get(this.$store.getters.stateFilter, 'name') || ''
    },
    disasters () {
      return _.map(this.$store.getters.disasterFilter, disaster => disaster.name).join(', ')
    },
    locales () {
      return _.map(this.$store.getters.localeFilter, locale => locale.name).join(', ')
    },
    level () {
      return this.$store.getters.geographicLevel.name
    }
  }
}
</script>

<style lang="scss">
table { margin:0; }
.reports {
  padding:10px 20px;
  min-height:700px;

  div:first-child {
    padding:0;

    h1 {
      color:#fff;
      margin:0 0 20px 0;
    }
  }
  .report-summary {
    padding:0;
    table.usa-table-borderless {
      tr {
        td { min-height:40px; }
      }
    }
    table {
      color:#fff;
    //  margin-top:10px;
      text-align:left;
        tr {
          /* min-height:50px; */
          td {
            border:none;
            padding: 0;

            &#creationDate { text-align:right; }
          }
      }
      .btn-group { vertical-align:inherit; }
    }
  }

  table.report-values-header {
    margin-top:10px;
    th {
      color:#000;
      padding:10px;
      border-bottom:none;

      &:first-child { width:65%; }
    }
  }

  .report-values {
    height:455px;
    background:#fff;
    overflow:auto;
    overflow-x:auto;
    border:1px solid #5b616b;

    table {
      color:#000;
      tr {
        td {
          &:first-child { width:65%; }
          padding:5px 0 0 10px;
        }
      }
    }
  }
}
</style>
