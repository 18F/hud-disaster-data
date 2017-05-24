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
        <button class="select-button" @click="select(item)" v-bind:disabled="selected">{{ this.selected ? 'SELECTED' : 'SELECT' }}</button>
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
      selected: false
    }
  },
  methods: {
    select (item) {
      this.$emit('selected', item)
      this.selected = true
    }
  }
}
</script>
