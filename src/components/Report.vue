<template lang="pug">
  div
    selectLocationSideBar
    div.col-lg-8(style="padding:10px 20px; min-height:700px;")
      div.col-lg-12(style="height:60px; padding:0;")
        h1(style="color:#fff; margin-top:0;")
          |Summary Report
      div.col-lg-12(style="padding:0;")
        table.usa-table-borderless.report-summary(style="color: #fff;")
          tr
            td
              |State: {{ stateName }}
            td(style="text-align:right;")
              |Created on: {{ new Date() }}
          tr
            td(colspan="2" style="text-align:left;")
              |Disaster(s): {{ disasters }}
          tr
            td(colspan="2")
              |Geographic Level: {{ level }}
          tr
            td(colspan="2")
              |Selected Locations: {{ locales }}
        div.col-lg-12(style="text-align:right; padding:0; margin:0;")
          button(type="button" name="Export" style="height:39.5px; margin-right:10px;")
            |Export
          div.btn-group
            button(type="button" @click="showSummarySelections=!showSummarySelections" title="Select summary values" style="margin-right:0;")
              icon(name='fa-columns' style="padding:0; margin-right:5px;")
              icon(name="fa-caret-down")
            div(v-show="showSummarySelections" id="SummarySelections")
              span(style="padding-bottom:10px; font-weight:bold;")
                |Summary Values
              //- TODO  REWORK THIS AS A COMPONENT AND MAKE 508 COMPLIANT!!
              //- div(id="lsSummaryValues")
              //-   table
              //-     tr.table-header
              //-       td
              //-         button(type="button")
              //-           icon.ico-lg(name="fa-square-o")
              //-       td
              //-         |All
              //-     tr
              //-       td
              //-         button(type="button")
              //-           icon.ico-lg(name="fa-check-square-o")
              //-       td
              //-         |Unmet Need
              //-     tr
              //-       td
              //-         button(type="button")
              //-           icon.ico-lg(name="fa-square-o")
              //-       td
              //-         |FEMA County Funding Average
              //-     tr
              //-       td
              //-         button(type="button")
              //-           icon.ico-lg(name="fa-square-o")
              //-       td
              //-         |FEMA Household Funding Average
        div
          table
            thead
              tr
                th(style="width:65%;") Type
                th Amount
            tbody(style="background:#fff; text-align:left;")
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
                td &nbsp;
                td
              tr
                td Total Households
                td 999,999,999
</template>
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
  },
  data () {
    return {
      showSummarySelections: false
    }
  }
}
</script>

<style lang="scss">
.report-summary{
  td{
    border:none;
    padding:0;
  }
  .btn-group {
    vertical-align: inherit;
  }
}
#SummarySelections{
  text-align:left;
  font-size:15px;
  border:1px solid #ccc;
  position:absolute;
  top:100%;
  right:5px;
  border-radius:4px;
  background-color:#fff;
  padding:20px;
  background:#fff;
}
#lsSummaryValues{
  height:300px;
  width:375px;
  overflow:scroll;
  overflow-x:hidden;
  border:1px solid #ccc;

  table {
    margin:0;
    border:none;

    tr {
      border:none;
      border-bottom:1px solid #ccc;

      &.table-header{
        background:#000;
        color:#fff;
        .hdd-icon { fill:#fff !important; }
      }
      td {
        margin:0;
        border:none;
        padding:0;

        &:first-child {
          width:40px;
          padding:0;
          border:none;
        }

        button{
          background:transparent;
          padding:10px;
          margin:0;

          .hdd-icon { fill:#000; }
        }
      }
    }
  }
  ul {
    width:300px;
    font-size:initial;
    padding:0;
    margin:0;

    li:before { content: ""; }
    li {
      padding-top:10px;
      border-bottom:1px solid #ccc;

      &:hover{
        cursor:pointer;
        background:#ff0000;
      }

      button {
        background: transparent;
        padding:15px 0;
        margin:0 0 0 10px;
      }

      span{
        display:inline-block;
      }
    }
  }
}
</style>
