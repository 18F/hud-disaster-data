<template>
  <div id="app">
    <div class="header --global">
      <div class="header header--pre">
        <div class="container-block">pre header</div>
      </div>
    </div>
    <img src="../../public/assets/logo_global.svg">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>
<style src="../../public/assets/_scss/app.scss" lang="scss"/>
