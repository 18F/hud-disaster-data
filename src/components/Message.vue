<template lang="pug">
.message-container(v-if='displayMessage', tabindex='0', ref='messages')
  div(:class='status.type')
    .message
      .ico
        icon(:classes='`ico-lg status-type ${status.type}`', :name='iconName()')
      .body
        div {{status.message}}
      .close
        label.sr-only(for='message-clear-button') Close {{ status.type }} message
        button#message-clear-button.usa-button.clear-message(@click='hideMessage', title='message clear button')
          icon(classes='close-message', name='fa-times')
</template>
<script>

export default {
  props: ['locationOfMessage'],
  computed: {
    displayMessage () {
      var status = this.$store.getters.status
      if (status.type === 'normal') return false
      if (status.scope === 'extract' && this.locationOfMessage !== 'extract-message') return false
      if (status.scope === 'app' && this.locationOfMessage !== 'app-message') return false
      this.$nextTick(() => this.$refs.messages.focus())
      return true
    },
    status () {
      return this.$store.getters.status
    }
  },
  methods: {
    hideMessage () {
      this.$store.commit('resetStatus')
    }
  }
}
</script>
