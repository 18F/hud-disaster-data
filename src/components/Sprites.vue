<template lang="pug">
  div(v-once v-html="sprites")
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
