<template lang="pug">
  .value-selector
    div.report-actions
      div.btn-group
        label.sr-only(for='SummariesSelector') Show summary values selector
        button(type="button" @click="toggleSummarySelection" name="SummariesSelector" title="Select summary values" :class="selectionListExpanded")
          icon(name='fa-columns' classes="columns")
          icon(name="fa-caret-up" v-show="showSelectionList")
          icon(name="fa-caret-down" v-show="!showSelectionList")
      div.summary-selection-list(v-show="showSelectionList")
        span
          |Summary Values
        table
          tr.table-header
            td
              label.sr-only(for='SelectAllSummaryValues') Select all summary values
              button(type="button" name="SelectAllSummaryValues" title="Select all summary values")
                icon.ico-md(name="fa-square-o")
            td
              |All
        .summary-values
          ul
            li
              label.sr-only(for='UnmetNeeds') Select unmet needs summary
              button(type="button" name="UnmetNeeds" title="Unmet needs summary")
                icon.ico-md(name="fa-check-square-o")
              span
                |Unmet Need
            li
              label.sr-only(for='TotalDamages') Select total damages summary
              button(type="button" name="TotalDamages" title="Total damages summary")
                icon.ico-md(name="fa-check-square-o")
              span
                |Total Damages
            li
              label.sr-only(for='FEMACityFundingAverage') Select FEMA city funding average summary
              button(type="button" name="FEMACityFundingAverage" title="FEMA city funding average summary")
                icon.ico-md(name="fa-square-o")
              span
                |FEMA City Funding Average
            li
              label.sr-only(for='FEMAAverageLoss') Select FEMA average loss summary
              button(type="button" name="FEMAAverageLoss" title="FEMA average loss summary")
                icon.ico-md(name="fa-square-o")
              span
                |FEMA Average Loss
</template>
<script>
export default {
  name: 'value-selector',
  data () {
    return {
      showSelectionList: false
    }
  },
  props: ['showSummarySelections'],
  methods: {
    toggleSummarySelection () {
      this.showSelectionList = !this.showSelectionList
    }
  },
  computed: {
    selectionListExpanded () {
      return this.showSelectionList ? 'expanded' : false
    }
  }
}
</script>

<style lang="scss">
.value-selector {
  float:right;

  .report-actions {
    text-align:right;

    .btn-group {
      padding-left:20px;

      .hdd-icon.columns {
        padding:0;
        margin-right:5px;
      }

      button {
        background-color:#0071bc;
        .hdd-icon { fill:#fff; }

        &.expanded { background-color:#205493; }
        &[disabled] {
          background-color: #e3e3e3;
          .hdd-icon { fill: #000; }
        }
      }
    }

    button {
      height:40px;
      margin-right:0;
    }

    .summary-selection-list {
      //background-color:#000;
      background: url("/femadata/static/img/bg_90_opacity.png");
      box-shadow:5px 5px 10px rgba(0,0,0,0.5);
      position: absolute;
      right:0;
      text-align:left;

      span {
        color:#fff;
        font-weight:bold;
        padding:10px;
      }

      table {
        background-color:#0071bc;
        /* background-color:#ccc; */
        margin:0;
        border:none;
        text-align:left;

        tr {
          &.table-header {
            color:#fff;
            font-weight:bold;
          } /* color:#000; */

          td {
            margin:0;
            border:none;
            padding:5px 0 0 10px;

            &:first-child {
              width:40px;
              padding:5px;
              border:none;
            }

            button{
              background:transparent;
              padding:10px 5px 10px 5px;
              margin:0;
              .hdd-icon { fill:#fff; } /* fill:#000; */
            }
          }
        }
      }

      .summary-values {
        background-color:#fff;
        height:300px;
        width:375px;
        color:inherit !important;
        overflow:scroll;
        overflow-x:hidden;
        border:1px solid #ccc;
        border-top:none;
        text-align:left;
        z-index:10;

          ul {
            color:#000;
            width:300px;
            font-size: initial;
            padding:0;
            margin:0;
            width:100%;

            li {
              &:before { content: ""; display:none; }
              &:hover { background-color: #e2f6fd; }

              button {
                background:transparent;
                float:left;
                padding:15px 10px;
                margin:0;
                .hdd-icon { fill:#000; }
              }

              span {
                background-color:transparent;
                color:#000;
                padding-top:15px;
                font-weight: normal;
                margin-left:40px;
              }
            }
          }
        }
      }
   }
}
</style>
