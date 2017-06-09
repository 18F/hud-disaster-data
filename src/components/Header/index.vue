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
                    <img src="/static/img/icon-dot-gov.svg" alt="Official U.S.gov website seal"/>
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
                    <img src="/static/img/icon-https.svg" alt="Official secure sockets layer endorsement seal"/>
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
          <span class="logo-img" alt="U.S. Department of Housing and Urban Development logo"></span>
          <p ref="title">{{title}}</p>
        </div>
        <div class="avi avi--block pull-right" @click="startTour">
          <span class="icon icon--avatar"></span>
          <i class=" fa fa-caret-down"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import tour from '../../tour'
export default {
  data () {
    return {
      title: 'Disaster Data Portal',
      premsg: 'An official website of the United States Government',
      showGovBanner: false
    }
  },
  methods: {
    startTour () {
      tour.start(this.$store)
    }
  }
}
</script>
