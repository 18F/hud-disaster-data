<script>
import Header from './Header/'
export default {
  name: 'hello',
  components: { Header },
  data () {
    return {
      msg: 'Relax, Finding things just got easier!'
    }
  }
}
</script>

<template>
  <div class="content content--block">
    <Header></Header>
    <h1>{{ msg }}</h1>
    <p>Type your search into the box below and press the search button</p>
  </div>
</template>
