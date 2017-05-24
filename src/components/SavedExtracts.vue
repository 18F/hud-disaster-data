<template>
  <ul id="extracts">
    <li v-for="(item, $item) in items">
      <disaster :item="item" v-on:selected="onSelected"></disaster>
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
    onSelected (item) {
      let index = this.items.indexOf(item)
      if (index < 0) return
      this.items.splice(index, 1)
    }
  }
}
</script>
