<template lang="pug">
.message-container(v-if='displayMessage', tabindex='0', ref='messages')
  div(:class='statusType')
    .message
      .ico
        icon(:classes='`ico-lg status-type ${statusType}`', :name='iconName()')
      .body
        div {{status.message}}
      .close
        label.sr-only(for='message-clear-button') Close {{ statusType }} message
        button#message-clear-button.usa-button.clear-message(@click='hideMessage', title='message clear button')
          icon(classes='close-message', name='fa-times')
</template>
<script>
import _ from 'lodash'
/**
* User message display component
* @module components/Message
*/
export default {
  props: ['locationOfMessage'],
  computed: {
    /**
    * <ul style="list-style: none;">
    * <li> Will examine the message scope and the location of the message to determine which messages should be displayed.
    * <li> If the scope is extract and location is extract-message, it will display.
    * <li> If the scope is app and location is app-message, it will display.
    * <li> Otherwise, it will not display.
    * </ul>
    * @function displayMessage
    */
    displayMessage () {
      var status = _.get(this.$store.getters, 'status')
      if (!status || status.type === 'normal') return false
      if (status.scope === 'extract' && this.locationOfMessage !== 'extract-message') return false
      if (status.scope === 'app' && this.locationOfMessage !== 'app-message') return false
      this.$nextTick(() => this.$refs.messages.focus())
      return true
    },
    status () {
      return this.$store.getters.status
    },
    statusType () {
      return _.get(this.$store.getters, 'status.type')
    }
  },
  methods: {
    hideMessage () {
      this.$store.commit('resetStatus')
    }
  }
}
</script>
