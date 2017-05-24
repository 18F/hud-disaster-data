<script>
export default {
  name: 'header',
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
