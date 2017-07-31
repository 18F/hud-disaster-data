<template lang="pug">
  div(id="sideBar")
      div(style='color: #fff; font-size: xx-large;', tabindex='0')
        div(style="font-size:17px;")
          div.col-xs-12.col-sm-12.col-md-4.col-lg-4(style="padding:0 20px; min-height:700px; background:url('../../static/img/bg_50_opacity.png')")
            div(style="border:1px solid #fff; border-top:none; border-right:none; border-left:none; margin-top:20px; padding-bottom:10px;")
              | Report Parameters
            div(style="margin-top:20px;")
              | State
              #stateSelect
                inputselect(
                  :value.sync="stateSelected"
                  :items="states"
                  label="name"
                  componentDescription="State Select"
                  :on-change="changeState"
                  v-on:clear="clearState"
                  style="background:#fff;"
                )
            div(style="margin-top:20px; overflow:hidden;")
              | Geographic Level
              #geographicLevelSelect
                inputselect(
                  :value.sync="geographicLevelSelected"
                  :items="geographicLevels"
                  label="geographicLevels"
                  :on-change="setLevel"
                  style="background:#fff;"
                  :hassubList="true"
                )
              div.col-lg-12(name="lsGeographicLevels" style="background:url('/static/img/bg_25_opacity.png'); overflow:hidden; padding:10px;")
                div(class="input-group")
                  #localeSelect
                    inputselect(
                      :value.sync="localeSelected"
                      :items="localeItems",
                      label="localeName",
                      ref="localeSelect"
                    )
                  span(class="input-group-btn")
                    button(type="button" style="min-width:70px; border-radius:0px; margin:0; padding:15px 20px;" @click="addLocale")
                      | Add
                div.locale-list(style="border:1px solid #353434; border-top:0px; overflow-y:scroll; height:170px;")
                  ul(id="SelectedLocaleList")
                    li.selected-locale(v-for="locale in $store.getters.localeFilter")
                      span
                        | {{ locale.name }}
                      button.clear-text(@click='' :title='`Remove ${locale.name}`')
                        icon(name='fa-times')
            div(style="margin-top:20px; overflow:hidden;")
              | Disasters
              div
                div.col-lg-12(style="padding:0px;")
                  div(class="input-group")
                    div(id="disasterIdInput")
                      inputselect(
                        :value.sync="disasterSelected"
                        :items="disasterItems",
                        label="disasterNumber"
                        :dropdownMenuStyle="'max-height:350px; overflow:true;'"
                      )
                    span(class="input-group-btn")
                      button(type="button" style="min-width:70px; border-radius:0px; margin:0; padding:15px 20px;" @click="addDisaster")
                        | Add
                  div.disaster-list(style="clear:left; border:1px solid #353434; border-top:0px; overflow-y:scroll; height:120px; background:url('/static/img/bg_25_opacity.png')")
                    ul(id="SelectedDisasterList")
                      li.selected-disaster(v-for="disaster in $store.getters.disasterFilter")
                        span
                          | {{ disaster.name }}
                        button.clear-text(@click='' :title='`Remove ${disaster.name}`')
                          icon(name='fa-times')
            div(style="margin-top:10px; text-align:center; padding-bottom:10px;")
              button.usa-button.alt-button(type="button" style="margin-right:20px;" @click="clearState")
                | Clear
              button.usa-button.green(type="button")
                | Create Report
</template>

<script>
// input(type="text" placeholder="search ..." style="position:absolute; padding-left:35px;")
// icon(name='fa-search' style="position:relative; fill:#ccc; position:relative; top:15px; left:10px;")
import inputselect from '@/components/InputSelect'

export default {
  name: 'selectLocationSideBar',
  components: {inputselect},

  data () {
    return {
      stateSelected: null,
      geographicLevelSelected: this.$store.getters.geographicLevel,
      localeSelected: null,
      disasterSelected: null,
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
      geographicLevels: [{name: 'City', code: 'City'}, {name: 'County', code: 'County'}, {name: 'Congressional District', code: 'Congressional District'}],
      query: ''
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
      if (val && val.code && val.code.length > 1) {
        if (!this.stateSelected || val.code !== this.stateSelected.code) {
          this.localeSelected = null
          this.disasterSelected = null
          this.$store.dispatch('setSelectedState', val)
          this.$store.dispatch('loadLocales', val.code)
          this.$store.dispatch('loadDisasterList', val.code)
        }
      }
    },

    addLocale () {
      if (!this.localeSelected) return
      this.$store.commit('addLocaleFilter', this.localeSelected)
      this.$refs.localeSelect.reset()
    },

    addDisaster () {
      if (!this.disasterSelected) return
      this.$store.commit('addDisasterFilter', this.disasterSelected)
    },

    reset () {
      this.localeSelected = null
      this.disasterSelected = null
      this.stateSelected = null
      this.$store.commit('clearStore')
    },

    setLevel (val) {
      if (!val) return
      this.$store.commit('setSelectedGeographicLevel', val)
      this.changeState(this.stateSelected)
    },

    clearState (val) {
      this.reset()
    }
  }
}
</script>

<style lang="scss">
.locale-list, .disaster-list {
  ul {
    width:100%;
    margin:0px;
    padding:10px 10px 0 10px;
    color:#000;

    li:before { content: ""; display:block; }
    li{
      display:block;
      border-radius:8px;
      background-color:#dbdbdb;
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
        //position:relative;
      //  top:35%;
        fill:#b0b0b0;
        &:hover {
          cursor:pointer;
          fill: #000;
        }
      }
    }
  }
}
</style>
