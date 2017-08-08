<template lang="pug">
  #appHeader.header.--global
    <!-- REQUIRED for 508 compliancy -->
    #skiptocontent
      a(tabindex="0" @click="skipToContent" @keyup.enter="skipToContent") skip to main content
    .header.header--pre
      .container-block
        p
          span.icon.icon--flag(alt='U.S. flag')
          | {{premsg}}
          button(:class="[showGovBanner ? 'usa-banner-button-alt expanded' : 'usa-banner-button-alt']", @click='showGovBanner=!showGovBanner')
            | Here's how you know
            icon(:name="[showGovBanner ? 'fa-caret-up' : 'fa-caret-down']")
    #gov-banner(v-show='showGovBanner')
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
          h1(ref='title') {{title}}
        user-selector
        #burger.hidden-md.hidden-lg.pull-right.padding-top(@click='toggleBurger' style="margin-right:20px;")
          icon(name='fa-bars' classes='ico-lg fill-black')
        #burger-menu.hidden-md.hidden-lg.hidden(ref='burgerMenu')
          ul
            li
              router-link(:to='{name: "disasterSearch"}' href="")
                icon.ico-md(name='fa-sign-out')
                | Data Export
            li
              router-link(:to='{name: "reports"}'  href="")
                icon.ico-md(name='fa-bar-chart')
                | Reports
        #tabs(role="navigation").hidden-sm.hidden-xs
          router-link(:to='{name: "disasterSearch"}' href="")
            .tab(tabindex='-1')
                icon.ico-md(name='fa-sign-out')
                span
                  | Data Export
          router-link(:to='{name: "reports"}'  href="")
            .tab(tabindex='-1')
                icon.ico-md(name='fa-bar-chart')
                span
                  | Reports
    #ribbon
      div
        span
          | Need Help?
        button.usa-button.green(@click='startTour' title='Guide Me Button' ref="guideMe")
          | Guide Me
</template>

<script>
import tour from '../tour'
import UserSelector from '@/components/UserSelector'
/**
* The standard header for the site.  Contains official logo, government site statement, and tabs for navigation.
* @module components/Header
*/

export default {
  components: {UserSelector},
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
    },
    toggleBurger () {
      this.$refs.burgerMenu.classList.toggle('hidden')
    },
    skipToContent () {
      this.$refs.guideMe.focus()
    }
  }
}
</script>
