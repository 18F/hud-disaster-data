<template lang="pug">
  div(id="sideBar")
    div(id="stateSelect" style="width: 350px; background-color: #fff; margin-bottom: 2em;")
      v-select(:value.sync="stateSelected" :options="states", label="stateName")
    div(id="localeSelect" style="width: 350px; background-color: #fff;")
      v-select(:value.sync="localeSelected" :options="locales", label="localName")
</template>
<script>
import vSelect from 'vue-select'

export default {
  name: 'selectLocation',
  components: {vSelect},

  data () {
    return {
      stateSelected: null,
      localeSelected: null,
      states: [{stateName: 'Texas', stateCode: 'TX'}, {stateName: 'Wisconsin', stateCode: 'WI'}, {stateName: 'New York', stateCode: 'NY'}],
      query: '',
      locales: ''
    }
  },
  methods: {
    update () {
      if (!this.stateSelected) return this.reset()
      if (this.stateSelected.stateCode.length < 2) return
      this.$store.dispatch('loadLocales', this.stateSelected.stateCode)
    },
    reset () {
      this.stateSelected = ''
      this.$store.commit({type: 'clearSearch'})
    }
  }
}
</script>
