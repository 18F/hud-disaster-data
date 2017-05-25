<template>
  <ul id="extracts">
    <li v-for="(item, $item) in items">
      <disaster :item="item"></disaster>
    </li>
  </ul>
</template>
<script>

import disaster from './Disaster'
export default {
  components: {disaster},
  computed: {
    items () {
      return this.$store.getters.currentExtract
    }
  }
}
</script>
<style>
/* #extracts { float: right; } */
</style>
