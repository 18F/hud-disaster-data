<template lang="pug">
  div
    selectLocationSideBar(v-on:updateSummaryDisplay='updateSummaryDisplay')
    div.col-xs-12.col-sm-12.col-md-8.col-lg-8.reports
      div.col-lg-12
        h1
          |Summary Report
      div.col-lg-12.report-summary
        value-selector(:showSummarySelections="false")
        label.sr-only(for='Export') Export report
        a(:href="exportURI()" download='HUD_FEMA_Report_download.csv' tabindex='-1')
          button.usa-button.green(type="button" name="Export" title="Export report" id="exportReportButton" :disabled="!showReport")
            |Export
        table.usa-table-borderless
          tr
            td
              |State: {{ stateName }}
            td(id="creationDate")
              div(v-show="showReport")
                span Created on:
                span {{ getCreationDate }}
          tr
            td(colspan="2")
              |Disaster(s): {{ disasters }}
          tr
            td(colspan="2")
              |Geographic Level: {{ level }}
          tr
            td(colspan="2")
              |Selected Locations: {{ locales }}
        table.report-values-header
          thead
            tr
              th Type
              th Amount
        .report-shell(v-show="!showReport")
          .loading(v-show="showReportSpinner")
            icon.fa-spin(name='fa-spinner')
            span.fa-spin-text
              | Generating Report ...
              span.sr-only Loading...
        .report-values(v-show="showReport")
          table
              tr(v-for='(amount, desc) in summaryRecords')
                td
                  | {{ desc }}
                td
                  | {{ Math.round(amount * 100) / 100 }}
</template>
<script>
import selectLocationSideBar from './SelectLocationSideBar'
import valueSelector from './ValueSelector'
import { mapGetters } from 'vuex'
import moment from 'moment'
import _ from 'lodash'
/**
* Component responsible for displaying a report or reports.  This is just a stub, at this time.
* @module components/Report
*/
export default {
  name: 'report',
  data () {
    return {
      displayStateName: '',
      displayDisasters: [],
      displayLocales: [],
      displaylevel: ''
    }
  },
  components: {selectLocationSideBar, valueSelector},
  computed: {
    ...mapGetters([
      'stateFilter',
      'localeFilter',
      'disasterFilter',
      'geographicLevel'
    ]),
    showReport () {
      return this.$store.getters.showReport
    },
    showReportSpinner () {
      return this.$store.getters.showReportSpinner
    },
    stateName () {
      return this.displayStateName
    },
    disasters () {
      return _.map(this.displayDisasters, disaster => disaster.name).join(', ')
    },
    locales () {
      return _.map(this.displayLocales, locale => locale.name).join(', ')
    },
    level () {
      return this.displaylevel
    },
    summaryRecords () {
      return this.$store.getters.summaryRecords
    },
    getCreationDate () {
      var date = moment().format('MMMM DD, YYYY - h:mm a')
      return date
    }
  },
  methods: {
    exportURI () {
      var csv = ''
      csv += `Type,Amount\n`
      _.forIn(this.$store.getters.summaryRecords, (value, key) => { csv += `${key}, ${_.round(value, 2)}\n` })
      return 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv)
    },
    updateSummaryDisplay (data) {
      this.displaylevel = data.level
      this.displayStateName = data.stateName
      this.displayDisasters = data.disasters
      this.displayLocales = data.locales
    }
  }
}
</script>

<style lang="scss">
#exportReportButton {
  text-align:right;
  float: right;
  margin-bottom: 20px;
  margin-right: 0;
  .hdd-icon { fill:#fff; }
  height:40px;
  margin-right:0;
}

.hidden { display:none; }
table { margin:0; }
.reports {
  padding:10px 20px 0 20px;
  min-height:700px;

  div:first-child {
    padding:0;

    h1 {
      color:#fff;
      margin:0;
    }
  }
  .report-summary {
    padding:0;
    table.usa-table-borderless {
      tr {
        td { min-height:24px; }
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

            &#creationDate {
              text-align:right;

              span {
                display:inline;
                padding:0 10px;
                  &:first-child { color:#fff; }
                  &:last-child {
                      color:#000;
                      background:#ffffcc;
                      border-radius:4px;
                  }
                }
              }
          }
      }
      .btn-group { vertical-align:inherit; }
    }
  }

  table.report-values-header {
    margin-top:20px;
    th {
      color:#000;
      padding:10px;
      border-bottom:none;

      &:first-child { width:65%; }
    }
  }

  .report-shell {
    background: url('/static/img/bg_50_opacity.png');
    border:1px solid #5b616b;
    height:455px;
    padding-top:18%;
    text-align:center;

    .hdd-icon {
      fill:#fff;
      height:80px;
      margin-bottom:20px;
      width:80px;
    }

    span { color:#fff; }
  }

  .report-values {
    &.hidden { display:none; }
    height:455px;
    background:#fff;
    overflow:auto;
    overflow-x:auto;
    border:1px solid #5b616b;

    table {
      color:#000;
      tr {
        border-bottom:1px solid #ccc;
        &:last-child {
          border-bottom: none;
        }
        td {
          &:first-child { width:65%; }
          padding:5px 0 5px 10px;
        }
      }
    }
  }
}
</style>
