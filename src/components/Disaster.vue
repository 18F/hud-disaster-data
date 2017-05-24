<template>
  <div class="disaster">
    <div class="name">
      <div>{{ `${item.disasterType}-${item.disasterNumber}-${item.state}` }}</div>
      <div>{{ item.title }}</div>
    </div>
    <div>
        Incident Type: {{ item.incidentType }}
    </div>
    <div class="declaration">
      <div>Declaration Date: {{ item.declarationDate }}</div>
      <div>
        <a @click="showAreas=!showAreas">Affected Areas</a>
        <button class="select-button" @click="select(item)">{{ this.notSelected ? 'SELECT' : 'SELECTED' }}</button>
      </div>
    </div>
    <div class="counties" v-show="showAreas">
      <div>
        <ul>
          <li v-for="(area,index) in item.declaredCountyArea" :key="area.id">
            {{ area }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['item'],
  data () {
    return {
      showAreas: false,
      notSelected: true
    }
  },
  methods: {
    select (item) {
      this.$emit('selected', item)
      this.notSelected = false
    }
  }
}
</script>
