<template lang="pug">
  div(id="sideBar")
      div(style='color: #fff; font-size: xx-large;', tabindex='0')
        div(style="font-size:17px;")
          div.col-sm-6.col-md-4.col-lg-4(style="padding:0 20px; min-height:700px; background:url('../../static/img/bg_50_opacity.png')")
            div(style="border:1px solid #fff; border-top:none; border-right:none; border-left:none; margin-top:20px; padding-bottom:10px;")
              | Report Parameters
            div(style="margin-top:20px;")
              | State
              #stateSelect.vueSelectContainer
                inputselect(:on-change="changeState" :value="stateSelected" :items="states", label="name" class="vueSelectCustom" style="background:#fff;")
            div(style="margin-top:20px; overflow:hidden;")
              | Geographic Level
              #geographicLevelSelect.vueSelectContainer
                inputselect(:value="geographicLevelSelected" :items="geographicLevels", label="geographicLevels" class="vueSelectCustom" :on-change="setLevel" style="padding-left:35px; background:#fff;")
              div.col-lg-12(name="lsGeographicLevels" style="background:url('/static/img/bg_25_opacity.png'); overflow:hidden; padding:10px;")
                div(class="input-group")
                  #localeSelect.vueSelectContainer
                    inputselect(:multiple="true" :value="localeSelected" :items="localeNames", label="localeName" class="vueSelectCustom" :on-change="setLocales")
                  span(class="input-group-btn")
                    button(type="button" style="min-width:70px; border-radius:0px; margin:0; padding:14px 20px;")
                      | Add
                div(style="clear:left; border:1px solid #353434; border-top:0px; overflow-y:scroll; height:120px;")
            div(style="margin-top:20px; overflow:hidden;")
              | Disasters
              div
                div.col-lg-12(style="padding:0px;")
                  div(class="input-group")
                    div(id="disasterIdInput" class="vueSelectContainer")
                      inputselect(:value="disasterSelected" :items="disasterIds", label="disasterNumber" class="vueSelectCustom" :on-change="setDisaster")
                    span(class="input-group-btn")
                      button(type="button" style="min-width:70px; border-radius:0px; margin:0; padding:14px 20px;")
                        | Add
                  div(style="clear:left; border:1px solid #353434; border-top:0px; overflow-y:scroll; height:120px; background:url('/static/img/bg_25_opacity.png')")
            div(style="margin-top:10px; text-align:center; padding-bottom:10px;")
              button.usa-button.alt-button(type="button" style="margin-right:10px;")
                | Clear
              button.usa-button.green(type="button")
                | Create Report
</template>

<script>
// input(type="text" placeholder="search ..." style="position:absolute; padding-left:35px;")
// icon(name='fa-search' style="position:relative; fill:#ccc; position:relative; top:15px; left:10px;")
import inputselect from '@/components/InputSelect'
import _ from 'lodash'

export default {
  name: 'selectLocationSideBar',
  components: {inputselect},

  data () {
    return {
      stateSelected: '',
      geographicLevelSelected: '',
      localeSelected: '',
      disasterSelected: '',
      states: [
        { name: ' ', code: '' }, { name: 'Alabama', code: 'AL' }, { name: 'Alaska', code: 'AK' }, { name: 'American Samoa', code: 'AS' },
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
      geographicLevels: [{name: '-', code: '-'}, {name: 'City', code: 'City'}, {name: 'County', code: 'County'}, {name: 'Congressional District', code: 'Congressional District'}],
      query: '',
      locales: [],
      stateDisasters: []
    }
  },

  computed: {
    disasterIds () {
      return _.map(this.$store.getters.disasterNumberResults, (disaster) => { return { name: disaster, code: disaster } })
    },

    localeNames () {
      return _.map(this.$store.getters.localeResults, (locale) => { return { name: locale, code: locale } })
    }
  },

  methods: {
    changeState (val) {
      this.reset()
      this.$store.commit('setSelectedState', val)
      if (val && val.code && val.code.length > 1) {
        this.$store.dispatch('loadLocales', val.code)
        this.$store.dispatch('loadDisasterNumbers', val.code)
        this.$store.commit('setSelectedState', val)
      }
    },

    setLocales (val) {
      // this.localeSelected.push(val)
      // this.$store.commit('setSelectedLocales', val) // needs to be moved to add button callback
    },

    setDisaster (val) {
      // this.disasterSelected.push(val)
      // this.$store.commit('setSelectedDisasters', val) // needs to be moved to add button callback
    },

    reset () {
      this.localeSelected = null
      this.disasterSelected = null
    },

    setLevel (val) {

    }
  }
}
</script>
