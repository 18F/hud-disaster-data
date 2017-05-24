<template>
  <ul id="extracts">
    <li v-for="(item, $item) in items">
      <disaster :item="item" v-on:unselected="onUnSelected" v-bind:propselected="true"></disaster>
    </li>
  </ul>
</template>
<script>

import disaster from './Disaster'
export default {
  components: {disaster},
  data () {
    return {
      items: []
    }
  },
  methods: {
    add (item) {
      this.items.push(item)
    },
    onUnSelected (item) {
      let index = this.items.indexOf(item)
      if (index < 0) return
      this.items.splice(index, 1)
      this.$emit('unselected', item)
    }
  }
}
</script>
<style>
/* #extracts { float: right; } */
</style>
