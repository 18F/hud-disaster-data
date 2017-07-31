<template lang="pug">
  .value-selector
    div.report-actions
      button.usa-button.green(type="button" name="Export" title="Export report")
        |Export
      div.btn-group
        button(type="button" @click="showSummarySelections=!showSummarySelections" name="SummariesSelector" title="Select summary values" :class="selectionListExpanded")
          icon(name='fa-columns' style="padding:0; margin-right:5px;")
          icon(name="fa-caret-up" v-show="showSummarySelections")
          icon(name="fa-caret-down" v-show="!showSummarySelections")
      div.summary-selection-list(v-show="showSummarySelections")
        span
          |Summary Values
        table
          tr.table-header
            td
              button(type="button" name="SelectAllSummaryValues" title="Select all summary values for report")
                icon.ico-lg(name="fa-square-o")
            td
              |All
        .summary-values
          ul
            li
              button(type="button" name="UnmetNeeds" title="Unmet needs summary")
                icon.ico-lg(name="fa-square-o")
              span
                |Unmet Need
            li
              button(type="button" name="FEMACityFundingAverage" title="FEMA city funding average summary")
                icon.ico-lg(name="fa-square-o")
              span
                |FEMA City Funding Average
            li
              button(type="button" name="FEMAAverageLoss" title="FEMA average loss summary")
                icon.ico-lg(name="fa-square-o")
              span
                |FEMA Average Loss
</template>
<script>
export default {
  name: 'value-selector',
  data () {
    return {
      showSummarySelections: false
    }
  },
  props: ['showSummarySelections'],
  methods: {
    close () {
      this.showSummarySelections = false
    }
  },
  computed: {
    selectionListExpanded () {
      return this.showSummarySelections ? 'expanded' : false
    }
  }
}
</script>

<style lang="scss">
.value-selector {
  margin-top:20px;

  .report-actions {
    text-align:right;

    .btn-group {
      padding-left:20px;

      button {
        background-color:#0071bc;
        .hdd-icon { fill:#fff; }

        &.expanded {
          background-color:#ccc;
          .hdd-icon { fill:#666; }
        }
      }
    }

    button {
      height:40px;
      margin-right:0;
    }

    .summary-selection-list {
      background-color:#000;
      box-shadow:5px 5px 10px #000;
      position: absolute;
      right:0;
      text-align:left;

      span {
        color:#fff;
        font-weight:bold;
        padding:10px;
      }

      table {
        background-color:#205493;
        margin:0;
        border:none;
        text-align:left;

        tr {
          &.table-header { color:#fff; }

          td {
            margin:0;
            border:none;
            padding:0;

            &:first-child {
              width:40px;
              padding:5px 0;
              border:none;
            }

            button{
              background:transparent;
              padding:10px;
              margin:0;
              .hdd-icon { fill:#fff; }
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
                padding:10px;
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
