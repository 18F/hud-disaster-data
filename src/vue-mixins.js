import Vue from 'vue'
import icon from './components/Icon'
/**
* These are mixins for all components.  Helping us stay DRY!
* @module vueMixins
*/

const messages = {
  success: 'fa-check-circle',
  error: 'fa-times-circle',
  warning: 'fa-warning',
  info: 'fa-info-circle'
}
Vue.mixin({
  components: {icon},
  methods: {
/**
* return the correct icon based on status
* @function iconName
*/
    iconName () {
      return messages[this.$store.getters.status.type]
    }
  }
})
