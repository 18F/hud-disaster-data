<template>
  <div id="extract">
    <button @click="clear">clear</button>
    <ul>
      <li v-for="(item, $item) in items">
        <disaster :item="item"></disaster>
      </li>
    </ul>
  </div>
</template>
<script>
import disaster from './Disaster'
import { mapMutations } from 'vuex'

export default {
  components: {disaster},
  computed: {
    items () {
      return this.$store.getters.currentExtract
    }
  },
  methods: {
    ...mapMutations({
      clear: 'clearCurrentExtract'
    })
  }
}
</script>
<style>
 #extract { background: white;}
</style>
