<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>Type your search into the box below and press the search button</p>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Relax, Finding things just got easier!'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
