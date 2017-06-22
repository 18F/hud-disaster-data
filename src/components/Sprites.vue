<template>
  <div v-once v-html="sprites">
  </div>
</template>
<script>
import sprites from '!!raw-loader!@/../public/assets/img/sprites.svg'
export default {
  data () {
    return {
      sprites
    }
  }
}
</script>
