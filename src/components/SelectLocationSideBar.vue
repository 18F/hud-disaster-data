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
                v-select(:on-change="changeState" :value.sync="stateSelected" :options="states", label="name" class="vueSelectCustom" style="background:#fff;")
            div(style="margin-top:20px; overflow:hidden;")
              | Geographic Level
              #geographicLevelSelect.vueSelectContainer
                v-select(:value="geographicLevelSelected" :options="geographicLevels", label="geographicLevels" class="vueSelectCustom" :on-change="setLevel" style="padding-left:35px; background:#fff;")
              div.col-lg-12(name="lsGeographicLevels" style="background-color:#000; overflow:hidden; padding:10px;")
                div(class="input-group")
                  #localeSelect.vueSelectContainer
                    v-select(:value="localeSelected" :options="localeNames", label="localeName" class="vueSelectCustom" :on-change="setLocales")
                  span(class="input-group-btn")
                    button(type="button" style="min-width:70px; border-radius:0px; margin:0; padding:14px 20px;")
                      | Add
                div(style="clear:left; border:1px solid #ccc; border-top:0px; overflow-y:scroll; height:100px;")
            div(style="margin-top:20px; overflow:hidden;")
              | Disasters
              div
                div.col-lg-12(style="padding:0px;")
                  div(class="input-group")
                    div(id="disasterIdInput" class="vueSelectContainer")
                      v-select(:value="disasterSelected" :options="disasterIds", label="disasterNumber" class="vueSelectCustom" :on-change="setDisaster")
                    span(class="input-group-btn")
                      button(type="button" style="min-width:70px; border-radius:0px; margin:0; padding:14px 20px;")
                        | Add
                  div(style="clear:left; border:1px solid #ccc; border-top:0px; overflow-y:scroll; height:100px;")
            div(style="margin-top:20px; text-align:center; padding-bottom:10px;")
              button.usa-button.alt-button(type="button" style="margin-right:20px;")
                | Clear
              button.usa-button.green(type="button")
                | Create
</template>

<script>
// input(type="text" placeholder="search ..." style="position:absolute; padding-left:35px;")
// icon(name='fa-search' style="position:relative; fill:#ccc; position:relative; top:15px; left:10px;")
import vSelect from 'vue-select'

export default {
  name: 'selectLocationSideBar',
  components: {vSelect},

  data () {
    return {
      stateSelected: null,
      localeSelected: null,
      disasterSelected: null,
      geographicLevelSelected: null,
      states: [
        { name: 'Alabama', code: 'AL' }, { name: 'Alaska', code: 'AK' }, { name: 'American Samoa', code: 'AS' }, { name: 'Arizona', code: 'AZ' }, { name: 'Arkansas', code: 'AR' }, { name: 'California', code: 'CA' }, { name: 'Colorado', code: 'CO' }, { name: 'Connecticut', code: 'CT' }, { name: 'Delaware', code: 'DE' }, { name: 'District Of Columbia', code: 'DC' }, { name: 'Federated States Of Micronesia', code: 'FM' }, { name: 'Florida', code: 'FL' }, { name: 'Georgia', code: 'GA' }, { name: 'Guam', code: 'GU' }, { name: 'Hawaii', code: 'HI' }, { name: 'Idaho', code: 'ID' }, { name: 'Illinois', code: 'IL' }, { name: 'Indiana', code: 'IN' }, { name: 'Iowa', code: 'IA' }, { name: 'Kansas', code: 'KS' }, { name: 'Kentucky', code: 'KY' }, { name: 'Louisiana', code: 'LA' }, { name: 'Maine', code: 'ME' }, { name: 'Marshall Islands', code: 'MH' }, { name: 'Maryland', code: 'MD' }, { name: 'Massachusetts', code: 'MA' }, { name: 'Michigan', code: 'MI' }, { name: 'Minnesota', code: 'MN' }, { name: 'Mississippi', code: 'MS' }, { name: 'Missouri', code: 'MO' }, { name: 'Montana', code: 'MT' }, { name: 'Nebraska', code: 'NE' }, { name: 'Nevada', code: 'NV' }, { name: 'New Hampshire', code: 'NH' }, { name: 'New Jersey', code: 'NJ' }, { name: 'New Mexico', code: 'NM' }, { name: 'New York', code: 'NY' }, { name: 'North Carolina', code: 'NC' }, { name: 'North Dakota', code: 'ND' }, { name: 'Northern Mariana Islands', code: 'MP' }, { name: 'Ohio', code: 'OH' }, { name: 'Oklahoma', code: 'OK' }, { name: 'Oregon', code: 'OR' }, { name: 'Palau', code: 'PW' }, { name: 'Pennsylvania', code: 'PA' }, { name: 'Puerto Rico', code: 'PR' }, { name: 'Rhode Island', code: 'RI' }, { name: 'South Carolina', code: 'SC' }, { name: 'South Dakota', code: 'SD' }, { name: 'Tennessee', code: 'TN' }, { name: 'Texas', code: 'TX' }, { name: 'Utah', code: 'UT' }, { name: 'Vermont', code: 'VT' }, { name: 'Virgin Islands', code: 'VI' }, { name: 'Virginia', code: 'VA' }, { name: 'Washington', code: 'WA' }, { name: 'West Virginia', code: 'WV' }, { name: 'Wisconsin', code: 'WI' }, { name: 'Wyoming', code: 'WY' }
      ],
      geographicLevels: ['City', 'County', 'Congressional District'],
      query: '',
      locales: [],
      stateDisasters: []
    }
  },

  computed: {
    disasterIds () {
      return this.$store.getters.disasterNumberResults
    },

    localeNames () {
      return this.$store.getters.localeResults
    },

    disabled () {
      debugger
      switch (this.id) {
        case 'geographicLevel':
          if (this.stateSelected) return false
          break
        case 'localeSelect':
          if (this.geographicLevelSelected && this.stateSelected) return false
          break
        case 'disasterIdInput':
          if (this.stateSelected) return false
          break
        default:
          return true
      }
    }
  },

  methods: {
    changeState (val) {
      this.reset()
      if (val && val.code && val.code.length > 1) {
        this.stateSelected = val
        this.$store.dispatch('loadLocales', val.code)
        this.$store.dispatch('loadDisasterNumbers', val.code)
      }
    },

    setLocales (val) {
      this.localeSelected = val
    },

    setDisaster (val) {
      this.disasterSelected = val
    },

    reset () {
      this.localeSelected = null
      this.disasterSelected = null
      this.$store.commit({type: 'clearState'})
    },

    setLevel (val) {

    }
  }
}
</script>
