<script>
export default {
  data () {
    return {
      title: 'Disaster Data Portal',
      premsg: 'An official website of the United States Government'
    }
  }
}
</script>

<template>
  <div class="header --global" id="appHeader">
    <div class="header header--pre">
      <div class="container-block">
      <p><i class="icon icon--flag"></i>{{premsg}}</p>
      </div>
    </div>
    <div class="header header--masthead">
      <div class="container-block">
        <div class="logo logo--block">
          <p class="logo-img"></p>
          <p>{{title}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
/* -- Custom styles ------------------- -- */
.header .header--pre {
  background:#5A616B;

  p { font-size:12px; }
}
.container-block {
  padding:0 5%;

  i { margin:2px 10px 0 0; }
}
.logo--block p { font-size:24px; }
.logo--block .logo-img {
  margin-left: 30px;
}
</style>
