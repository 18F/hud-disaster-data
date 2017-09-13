<template lang="pug">
  div(id="sideBar")
      div.rp-wrapper
        div.rp-container.col-xs-12.col-sm-12.col-md-4.col-lg-4
          div.rp-header
            | Report Parameters
          div.rp-group
            | State
            span.rp-required *
            #stateSelect
              inputselect(
                :value.sync="stateSelected"
                :items="states"
                label="name"
                componentDescription="State Select"
                :on-change="changeState"
                :on-reset="openDialogue"
                v-on:clear="reset"
                style="background:#fff;"
                ref="stateSelector"
                required="true"
              )
              span.float-right(style="font-size:13px; color:#f00;")
                | * required
          div.rp-group.rp-geo-level
            | Geographic Level
            #geographicLevelSelect
              inputselect(
                :value.sync="geographicLevelSelected"
                componentDescription="Geographic level select"
                :items="geographicLevels"
                label="geographicLevels"
                :on-change="setLevel"
                style="background:#fff;"
                :hassubList="true"
                v-on:clear="setLevel"
                ref="geographicLevelSelector"
                :disabled="disableLevels"
              )
            div.locale.col-lg-12(name="lsGeographicLevels")
              div(class="input-group")
                #localeSelect
                  inputselect(
                    :value.sync="localeSelected"
                    componentDescription="Location select"
                    :items="localeItems",
                    label="localeName",
                    ref="localeSelect"
                    :disabled="disableLocales"
                  )
                span(class="input-group-btn")
                  button.add-locale(type="button" @click="addLocale" :disabled="disableLocales" title="Add locale button")
                    | Add
              div.locale-selection-list
                ul(id="SelectedLocaleList")
                  li.selected-locale(v-for="locale in $store.getters.localeFilter")
                    span
                      | {{ locale.name }}
                    button.clear-text(@click='removeLocale(locale)' :title='`Remove ${locale.name}`')
                      icon(name='fa-times')
          div.rp-group.disasters
            | Disasters
            div
              div.no-padding.col-lg-12
                div(class="input-group")
                  div(id="disasterIdInput")
                    inputselect(
                      :value.sync="disasterSelected"
                      componentDescription="Disaster select"
                      :items="disasterItems",
                      label="disasterNumber"
                      ref="disasterSelect"
                      :dropdownMenuStyle="'max-height:350px; overflow:true;'"
                      :disabled="disableDisasters"
                    )
                  span(class="input-group-btn")
                    button.add-disaster(type="button" @click="addDisaster" :disabled="disableDisasters" title="Add disaster button")
                      | Add
                div.disaster-selection-list
                  ul(id="SelectedDisasterList")
                    li.selected-disaster(v-for="disaster in $store.getters.disasterFilter")
                      span
                        | {{ disaster.name }}
                      button.clear-text(@click='removeDisaster(disaster)' :title='`Remove ${disaster.name}`')
                        icon(name='fa-times')
          div.rp-action-buttons
            button.usa-button.alt-button(type="button" @click="clearAll" title="Clear all report parameters button")
              | Clear
            button.usa-button.green(type="button" @click="pushReportUrl" :disabled="disableCreate" title="Create report button")
              | Create Report
              icon(name='fa-bar-chart')
</template>

<script>
// input(type="text" placeholder="search ..." style="position:absolute; padding-left:35px;")
// icon(name='fa-search' style="position:relative; fill:#ccc; position:relative; top:15px; left:10px;")
import inputselect from '@/components/InputSelect'
// import magic from '@/bus'
import _ from 'lodash'

export default {
  name: 'selectLocationSideBar',
  components: {inputselect},
  mounted () {
    this.$nextTick(function () {
      console.log('firing initializeValuesFromURL from mounted()')
      this.initializeValuesFromURL()
    })
  },
  watch: {
    '$route' (to, from) {
      if (to !== from) {
        console.log('firing initializeValuesFromURL from watch of $route')
        this.initializeValuesFromURL()
      }
    }
  },
  beforeDestroy () {
    this.reset()
    this.$store.commit('initStore', null)
  },
  data () {
    return {
      stateSelected: null,
      geographicLevelSelected: null,
      localeSelected: null,
      disasterSelected: null,
      disableLevels: true,
      disableLocales: true,
      disableDisasters: true,
      disableCreate: true,
      states: [
        { name: 'Alabama', code: 'AL' }, { name: 'Alaska', code: 'AK' }, { name: 'American Samoa', code: 'AS' },
        { name: 'Arizona', code: 'AZ' }, { name: 'Arkansas', code: 'AR' }, { name: 'California', code: 'CA' }, { name: 'Colorado', code: 'CO' },
        { name: 'Connecticut', code: 'CT' }, { name: 'Delaware', code: 'DE' }, { name: 'District Of Columbia', code: 'DC' },
        { name: 'Federated States Of Micronesia', code: 'FM' }, { name: 'Florida', code: 'FL' }, { name: 'Georgia', code: 'GA' },
        { name: 'Guam', code: 'GU' }, { name: 'Hawaii', code: 'HI' }, { name: 'Idaho', code: 'ID' }, { name: 'Illinois', code: 'IL' },
        { name: 'Indiana', code: 'IN' }, { name: 'Iowa', code: 'IA' }, { name: 'Kansas', code: 'KS' }, { name: 'Kentucky', code: 'KY' },
        { name: 'Louisiana', code: 'LA' }, { name: 'Maine', code: 'ME' }, { name: 'Marshall Islands', code: 'MH' }, { name: 'Maryland', code: 'MD' },
        { name: 'Massachusetts', code: 'MA' }, { name: 'Michigan', code: 'MI' }, { name: 'Minnesota', code: 'MN' }, { name: 'Mississippi', code: 'MS' },
        { name: 'Missouri', code: 'MO' }, { name: 'Montana', code: 'MT' }, { name: 'Nebraska', code: 'NE' }, { name: 'Nevada', code: 'NV' },
        { name: 'New Hampshire', code: 'NH' }, { name: 'New Jersey', code: 'NJ' }, { name: 'New Mexico', code: 'NM' },
        { name: 'New York', code: 'NY' }, { name: 'North Carolina', code: 'NC' }, { name: 'North Dakota', code: 'ND' },
        { name: 'Northern Mariana Islands', code: 'MP' }, { name: 'Ohio', code: 'OH' }, { name: 'Oklahoma', code: 'OK' },
        { name: 'Oregon', code: 'OR' }, { name: 'Palau', code: 'PW' }, { name: 'Pennsylvania', code: 'PA' }, { name: 'Puerto Rico', code: 'PR' },
        { name: 'Rhode Island', code: 'RI' }, { name: 'South Carolina', code: 'SC' }, { name: 'South Dakota', code: 'SD' },
        { name: 'Tennessee', code: 'TN' }, { name: 'Texas', code: 'TX' }, { name: 'Utah', code: 'UT' }, { name: 'Vermont', code: 'VT' },
        { name: 'Virgin Islands', code: 'VI' }, { name: 'Virginia', code: 'VA' }, { name: 'Washington', code: 'WA' }, { name: 'West Virginia', code: 'WV' },
        { name: 'Wisconsin', code: 'WI' }, { name: 'Wyoming', code: 'WY' }
      ],
      geographicLevels: [{name: 'City', code: 'city'}, {name: 'County', code: 'county'}, {name: 'Congressional District', code: 'congrdist'}],
      queryValue: ''
    }
  },

  computed: {
    disasterItems () {
      return this.$store.getters.disasterNumberResults
    },

    localeItems () {
      return this.$store.getters.localeResults
    }
  },

  methods: {
    changeState (val) {
      console.log(`inside changeState(${JSON.stringify(val)})`)
      if (val && val.code && val.code.length > 1) {
        if (!this.stateSelected || val.code !== this.stateSelected.code) {
          this.stateSelected = val
          this.localeSelected = null
          this.disasterSelected = null
          this.setLevel(null)
          this.clearDisaster()
          this.$store.commit('initStore', val)
          console.log('calling loadFilteredDisasters')
          this.$store.dispatch('loadFilteredDisasters').then(result => {
            console.log(`returned from loadFilteredDisasters promise with result: ${result}`)
          })
        }
      }
      this.checkDisabled()
    },

    clearStateSelected () {
      this.stateSelected = null
      this.$refs.stateSelector.clearValue()
      this.$store.commit('setState', null)
    },

    setLevel (val) {
      console.log(`inside setLevel(${JSON.stringify(val)}) with this.stateSelected: ${JSON.stringify(this.stateSelected)}`)
      this.geographicLevelSelected = val
      this.$store.commit('setSelectedGeographicLevel', val)
      if (!val) this.$refs.geographicLevelSelector.clearValue()
      this.clearLocales()
      if (this.$store.getters.stateFilter) {
        this.filterDisasters()
        this.$store.dispatch('loadLocales').then(result => console.log(`finished loadLocales from setLevel() with result: ${result}`))
      }
      this.checkDisabled()
    },

    clearLocales () {
      this.localeSelected = null
      this.$store.commit('updateLocaleList', [])
      this.$refs.localeSelect.clearValue()
    },

    addLocale () {
      console.log('inside addLocale')
      if (!this.localeSelected) return
      // DOING: Make a dry run of loading new disasters
      this.$store.commit('addLocaleFilter', this.localeSelected)
      this.$refs.localeSelect.clearValue()
      this.filterDisasters()
    },

    filterDisasters () {
      console.log('calling loadFilteredDisasters')
      this.$store.dispatch('loadFilteredDisasters').then(result => {
        console.log('finished loadFilteredDisasters, inside filterDisasters() with result: ' + result)
      })
    },

    addDisaster () {
      if (!this.disasterSelected) return
      this.$store.commit('addDisasterFilter', this.disasterSelected)
      this.$refs.disasterSelect.clearValue()
    },

    clearDisaster () {
      console.log('inside clearDisaster')
      this.disasterSelected = null
      this.$store.commit('updateReportDisasterList', [])
      this.$refs.disasterSelect.clearValue()
    },

    clearAll () {
      if (this.openDialogue()) {
        this.reset()
      }
    },

    openDialogue () {
      // being used as a callback in inputselects that need a modal
      if (confirm('This will clear all of your input selections. Proceed?')) {
        return true
      } else {
        return false
      }
    },

    reset () {
      this.clearStateSelected()
      this.setLevel(null)
      this.clearDisaster()
      this.checkDisabled()
    },

    checkDisabled () {
      // a function to manage which inputs are disabled
      if (!this.stateSelected) {
        // disable all the things
        this.disableLocales = true
        this.disableCreate = true
        this.disableDisasters = true
        this.disableLevels = true
      } else {
        this.disableCreate = false
        this.disableDisasters = false
        this.disableLevels = false
        if (!this.geographicLevelSelected) {
          this.disableLocales = true
        } else {
          this.disableLocales = false
        }
      }
    },

    pushReportUrl () {
      if (!this.$store.getters.stateFilter) return
      let query = {}
      if (this.$store.getters.stateFilter) query.stateFilter = this.$store.getters.stateFilter.code
      if (this.$store.getters.geographicLevel) query.geographicLevel = this.$store.getters.geographicLevel.code
      if (this.$store.getters.localeFilter.length > 0) query.localeFilter = _.map(this.$store.getters.localeFilter, l => l.code).join(',')
      if (this.$store.getters.disasterFilter.length > 0) query.disasterFilter = _.map(this.$store.getters.disasterFilter, d => d.code).join(',')
      this.$router.push({name: 'reports', query})
    },

    createReport () {
      console.log('inside createReport')
      let allFilters = {}
      let summaryDisplayData = {
        stateName: this.$store.getters.stateFilter.name,
        disasters: this.$store.getters.disasterFilter,
        locales: this.$store.getters.localeFilter,
        level: this.$store.getters.geographicLevel.name
      }

      if (this.$store.getters.stateFilter) allFilters.states = this.$store.getters.stateFilter.code
      if (this.$store.getters.disasterFilter.length > 0) allFilters.disasters = _.flatMap(this.$store.getters.disasterFilter, dstr => dstr.code.split('-')[1])
      if (this.$store.getters.geographicLevel && this.$store.getters.localeFilter.length > 0) {
        allFilters.localeType = this.$store.getters.geographicLevel.code.toLowerCase()
        allFilters.locales = _.flatMap(this.$store.getters.localeFilter, loc => loc.code)
      }
      this.$emit('updateSummaryDisplay', summaryDisplayData)
      this.$store.dispatch('loadReportData',
        { summaryCols: 'total_dmge_amnt,hud_unmt_need_amnt',
          allFilters
        })
    },

    removeDisaster (disaster) {
      this.$store.commit('removeDisasterFilter', disaster)
    },

    removeLocale (locale) {
      this.$store.commit('removeLocaleFilter', locale)
      this.filterDisasters()
    },

    initializeValuesFromURL () {
      console.log('inside initializeValuesFromURL')
      this.clearStateSelected()
      const vm = this
      let queryParams = this.$route.query
      let stateParam
      if (queryParams && queryParams.stateFilter) stateParam = queryParams.stateFilter
      else return
      let geographicLevelParam
      let localeParam = []
      let disasterParam = []
      if (queryParams && queryParams.geographicLevel !== undefined) geographicLevelParam = queryParams.geographicLevel
      if (queryParams && queryParams.localeFilter !== undefined) localeParam = queryParams.localeFilter.split(',')
      if (queryParams && queryParams.disasterFilter !== undefined) disasterParam = queryParams.disasterFilter.split(',')

      let stateObj = _.find(this.states, ['code', stateParam])
      console.log('setting stateSelector from initializeValuesFromURL')
      this.$refs.stateSelector.select(stateObj)

      if (geographicLevelParam) {
        let level = _.find(this.geographicLevels, ['code', geographicLevelParam])
        console.log('setting geographicLevelSelector from initializeValuesFromURL')
        this.geographicLevelSelected = level
        this.$refs.geographicLevelSelector.queryValue = level.name
        vm.$store.commit('setSelectedGeographicLevel', level)
        this.checkDisabled()
        vm.$store.dispatch('loadLocales').then(locResult => {
          vm.$store.commit('setLocalesFilter', localeParam)
          vm.$store.dispatch('loadFilteredDisasters').then(result => {
            console.log('finished loadFilteredDisasters, inside disasterParam with result: ' + result)
            this.$nextTick(function () {
              vm.$store.commit('setDisastersFilter', disasterParam)
              vm.createReport()
            })
          })
        })
      } else if (disasterParam) {
        vm.$store.dispatch('loadFilteredDisasters').then(result => {
          console.log('finished loadFilteredDisasters, inside disasterParam with result: ' + result)
          this.$nextTick(function () {
            vm.$store.commit('setDisastersFilter', disasterParam)
            vm.createReport()
          })
        })
      } else {
        this.$nextTick(function () {
          vm.createReport()
        })
      }
    }
  }
}
</script>

<style lang="scss">
.rp-wrapper {
  color:#fff;
  font-size:17px;

  .rp-container {
    background:url('../../static/img/bg_50_opacity.png');
    border-radius:10px;
    min-height:700px;
    padding:0 20px;

    .rp-header {
      border:1px solid #fff;
      border-top:none;
      border-right:none;
      border-left:none;
      margin-top:20px;
      padding-bottom:10px;
    }

    .rp-group {
      margin-top:20px;

      .rp-required {
        font-size:15px;
        color:#f00;
        display:inline;
        padding-left:5px;
      }

      .locale-selection-list, .disaster-selection-list {
        border:1px solid #353434;
        /* border-top:0px; */
        height:160px;
        overflow-y:scroll;
      }

      &.rp-geo-level {
        min-height:300px;

        .locale {
          background:url('../../static/img/bg_25_opacity.png');
          padding:10px;

          .add-locale {
            border-radius:0px;
            margin:0;
            min-width:70px;
            padding:15px 20px;
            &:disabled {
              background-color: #D6D7D9;
              color:#000;
            }
          }
        }
      }
      &.disasters {
        min-height:240px;

        .no-padding { padding:0px; }
        .add-disaster {
          border-radius:0px;
          margin:0;
          min-width:70px;
          padding:15px 20px;
          &:disabled {
            background-color: #D6D7D9;
            color:#000;
          }
        }
        .disaster-selection-list {
          background:url('../../static/img/bg_25_opacity.png');
          clear:left;
        }
      }
    }

    .rp-action-buttons {
      text-align:center;
      padding-bottom:10px;

      /* disabled button styles */
      button {
        &.usa-button.alt-button { margin-right:20px; }
        &[disabled] .hdd-icon {
          fill:#323a45;
        }
        .hdd-icon {
          margin-left: 10px;
        }
        display: inline-flex;
      }
    }
  }
  button[disabled], button:disabled {
    opacity:1.0;
    background-color:#ccc;
    color:#000;
  }
}


  .locale-selection-list, .disaster-selection-list {
    ul {
      width:100%;
      margin:0px;
      padding:10px 10px 0 10px;
      color:#000;

      li:before { content: ""; display:none; }
      li{
        display:block;
        border-radius:8px;
        /* background-color:#e2f6fd; */
        background-color:#eaffee;
        margin-top:0px;
        margin-bottom:0px;

        span {
          font-size:15px;
          display:inline-block;
          width:88%;
          padding:10px;
          padding-right:0px;
        }

        button {
          &.clear-text {
            background: transparent;
            cursor:pointer;
            float: right;
          //  margin-top:-32px;
            max-width: 24px;
            padding: 0;
            position: relative;
            top:5px;
            right:10px;

            .hdd-icon { fill: #b0b0b0; }
            &:hover {
              .hdd-icon { fill: #000; }
            }
          }
        }

        .hdd-icon {
          fill:#000;
          &:hover {
            cursor:pointer;
            fill: #b0b0b0;
          }
        }
      }
    }
  }
  .float-right {
    display: inline;
    float: right;
    font-size: small;
    color: #fff;
    padding-top: 6px;
  }
</style>
