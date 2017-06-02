<template>
  <div class="header --global" id="appHeader">
    <div class="header header--pre">
      <div class="container-block">
        <p>
          <i class="icon icon--flag" alt="U.S. flag"></i>{{premsg}}
          <button :class="[showGovBanner ? 'usa-banner-button-alt expanded' : 'usa-banner-button-alt']" @click="showGovBanner=!showGovBanner">
              Here's how you know <i class="fa"></i>
          </button>
        </p>
      </div>
    </div>
    <div id="gov-banner" v-show="showGovBanner" tabindex="0">
      <div class="gov-banner-outer">
        <div class="container-fluid">
          <div class="row gov-banner-inner">
              <div class="col-lg-6">
                <div class="col-lg-2 gov-banner-img">
                    <img src="/static/img/icon-dot-gov.svg" />
                </div>
                <div class="col-lg-10 gov-banner-text">
                  <span style="font-weight:bold;">The .gov means it’s official.</span>
                  Federal government websites always use a .gov or .mil domain. Before sharing sensitive
                  information online, make sure you’re on a .gov or .mil site by inspecting your browser’s
                  address (or “location”) bar.
                </div>
              </div>
              <div class="col-lg-6">
                <div class="col-lg-2 gov-banner-img">
                    <img src="/static/img/icon-https.svg"  />
                </div>
                <div class="col-lg-10 gov-banner-text">
                This site is also protected by an SSL (Secure Sockets Layer) certificate that’s been signed
                by the U.S. government. The https:// means all transmitted data is encrypted  — in other
                words, any information or browsing history that you provide is transmitted securely.
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
    <div class="header header--masthead">
      <div class="container-block">
        <div class="logo logo--block">
          <p class="logo-img"></p>
          <p ref="title">{{title}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: 'Disaster Data Portal',
      premsg: 'An official website of the United States Government',
      showGovBanner: false
    }
  }
}
</script>

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

#gov-banner {
  background:#fff;
  padding:0 5%;
  text-align:center;
}
.gov-banner-outer {
  margin:0 auto;
  width:80%;
}
.gov-banner-inner { padding:2.3rem 10%; }
.gov-banner-img {
  float:left;
  text-align:right;
  padding-right:10px;

  img{
    border:none;
    height:38px;
    width:38px;
  }
}
.gov-banner-text {
  font-size:14px;
  float:left;
  text-align:left;
}
</style>
