<template lang="pug">
  div
    selectLocationSideBar
    div.col-lg-8.reports
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
        div.col-lg-12.report-actions
          button.usa-button.green(type="button" name="Export")
            |Export
          div.btn-group
            button.summary-selections(type="button" @click="showSummarySelections=!showSummarySelections" @blur="close" title="Select summary values" )
              icon(name='fa-columns' style="padding:0; margin-right:5px;")
              icon(name="fa-caret-down")
            div(v-show="showSummarySelections" id="SummarySelectionList")
              span
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
          table#report-display
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
  },
  methods: {
    close () {
      this.showSummarySelections = false
    }
  }
}
</script>

<style lang="scss">
.reports{
  padding:10px 20px;
  min-height:700px;

  div:first-child {
    height:60px;
    padding:0;

    h1 {
      color:#fff;
      margin-top:0;
    }
  }
  .report-summary {
    padding:0;

    table {
      color: #fff;

      td{
        text-align:left;
        border:none;
        padding:0;

        &#creationDate { text-align:right;}
      }
      .btn-group {
        vertical-align: inherit;
      }
    }
  }

  .report-actions {
    margin:10px 0;
    padding:0;
    text-align:right;

    button {
      height:39.5px;
      margin-right:0;

      &.summary-selections{ margin-left:20px;}
    }
    /*
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
    */

    div#SummarySelectionList {
      span {
        font-weight:bold;
        padding-bottom:10px;
      }
    }
  }
}

#report-display {
  color: #000;
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
