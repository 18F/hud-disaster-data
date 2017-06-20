<template lang="pug">
  #appHeader.header.--global
    .header.header--pre
      .container-block
        p
          span.icon.icon--flag(alt='U.S. flag')
          | {{premsg}}
          button(:class="[showGovBanner ? 'usa-banner-button-alt expanded' : 'usa-banner-button-alt']", @click='showGovBanner=!showGovBanner')
            | Here's how you know
            icon(:name="[showGovBanner ? 'fa-caret-up' : 'fa-caret-down']")
    #gov-banner(v-show='showGovBanner', tabindex='0')
      .gov-banner-outer
        .container-fluid
          .row.gov-banner-inner
            .col-lg-6
              .col-lg-2.gov-banner-img
                img(src='/static/img/icon-dot-gov.svg', alt='Official U.S.gov website seal')
              .col-lg-10.gov-banner-text
                span(style='font-weight:bold;') The .gov means it’s official.
                |                   Federal government websites always use a .gov or .mil domain. Before sharing sensitive
                |                   information online, make sure you’re on a .gov or .mil site by inspecting your browser’s
                |                   address (or “location”) bar.
            .col-lg-6
              .col-lg-2.gov-banner-img
                img(src='/static/img/icon-https.svg', alt='Official secure sockets layer endorsement seal')
              .col-lg-10.gov-banner-text
                | This site is also protected by an SSL (Secure Sockets Layer) certificate that’s been signed
                | by the U.S. government. The https:// means all transmitted data is encrypted  — in other
                | words, any information or browsing history that you provide is transmitted securely.
    .header.header--masthead
      .container-block
        .logo.logo--block
          span.logo-img(alt='U.S. Department of Housing and Urban Development logo')
          p(ref='title') {{title}}
        #tabs
          .tab.selected
              icon.ico-lg(name='fa-sign-out')
              span
                | Data Export
          .tab
              icon.ico-lg(name='fa-globe')
              span
                | View Map
          .tab
              icon.ico-lg(name='fa-bar-chart')
              span
                | Reports
        .avi.avi--block.pull-right
          span.icon.icon--avatar
          icon(name='fa-caret-down')
    #ribbon
      span
        | Need Help?
      button.usa-button.green(@click='startTour')
        | Guide Me
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
