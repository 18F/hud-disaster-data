<template lang="pug">
  div(id="sideBar")

    div(id="stateSelect" class="vueSelectContainer")
      v-select(:on-change="getLocale" :options="states", label="name" class="vueSelectCustom")
    div(id="localeSelect" class="vueSelectContainer")
      v-select(:value="localeSelected" :options="locales", label="localName" class="vueSelectCustom")
    div(id="disasterIdInput" class="vueSelectContainer")
      v-select(:value="disasterSelected" :options="stateDisasters", label="disasterNumber" class="vueSelectCustom")
</template>

<script>
import vSelect from 'vue-select'

export default {
  name: 'selectLocationSideBar',
  components: {vSelect},

  data () {
    return {
      stateSelected: null,
      localeSelected: null,
      disasterSelected: null,
      states: [
        { name: 'Alabama', code: 'AL' }, { name: 'Alaska', code: 'AK' }, { name: 'American Samoa', code: 'AS' }, { name: 'Arizona', code: 'AZ' }, { name: 'Arkansas', code: 'AR' }, { name: 'California', code: 'CA' }, { name: 'Colorado', code: 'CO' }, { name: 'Connecticut', code: 'CT' }, { name: 'Delaware', code: 'DE' }, { name: 'District Of Columbia', code: 'DC' }, { name: 'Federated States Of Micronesia', code: 'FM' }, { name: 'Florida', code: 'FL' }, { name: 'Georgia', code: 'GA' }, { name: 'Guam', code: 'GU' }, { name: 'Hawaii', code: 'HI' }, { name: 'Idaho', code: 'ID' }, { name: 'Illinois', code: 'IL' }, { name: 'Indiana', code: 'IN' }, { name: 'Iowa', code: 'IA' }, { name: 'Kansas', code: 'KS' }, { name: 'Kentucky', code: 'KY' }, { name: 'Louisiana', code: 'LA' }, { name: 'Maine', code: 'ME' }, { name: 'Marshall Islands', code: 'MH' }, { name: 'Maryland', code: 'MD' }, { name: 'Massachusetts', code: 'MA' }, { name: 'Michigan', code: 'MI' }, { name: 'Minnesota', code: 'MN' }, { name: 'Mississippi', code: 'MS' }, { name: 'Missouri', code: 'MO' }, { name: 'Montana', code: 'MT' }, { name: 'Nebraska', code: 'NE' }, { name: 'Nevada', code: 'NV' }, { name: 'New Hampshire', code: 'NH' }, { name: 'New Jersey', code: 'NJ' }, { name: 'New Mexico', code: 'NM' }, { name: 'New York', code: 'NY' }, { name: 'North Carolina', code: 'NC' }, { name: 'North Dakota', code: 'ND' }, { name: 'Northern Mariana Islands', code: 'MP' }, { name: 'Ohio', code: 'OH' }, { name: 'Oklahoma', code: 'OK' }, { name: 'Oregon', code: 'OR' }, { name: 'Palau', code: 'PW' }, { name: 'Pennsylvania', code: 'PA' }, { name: 'Puerto Rico', code: 'PR' }, { name: 'Rhode Island', code: 'RI' }, { name: 'South Carolina', code: 'SC' }, { name: 'South Dakota', code: 'SD' }, { name: 'Tennessee', code: 'TN' }, { name: 'Texas', code: 'TX' }, { name: 'Utah', code: 'UT' }, { name: 'Vermont', code: 'VT' }, { name: 'Virgin Islands', code: 'VI' }, { name: 'Virginia', code: 'VA' }, { name: 'Washington', code: 'WA' }, { name: 'West Virginia', code: 'WV' }, { name: 'Wisconsin', code: 'WI' }, { name: 'Wyoming', code: 'WY' }
      ],
      query: '',
      locales: [],
      stateDisasters: []
    }
  },
  methods: {
    getLocale (val) {
      this.stateSelected = val
      this.$store.dispatch('loadLocales', val.code)
      this.$store.dispatch('loadDisasterList', val.code)
    },

    setLocale (val) {
      this.localeSelected = val
    },

    reset () {
      this.stateSelected = ''
      this.$store.commit({type: 'clearSearch'})
    }
  }
}
</script>
