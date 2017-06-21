import Vue from 'vue'
import icon from './components/Icon'
const messages = {
  success: 'fa-check-circle',
  error: 'fa-times-circle',
  warning: 'fa-warning',
  info: 'fa-info-circle'
}
Vue.mixin({
  components: {icon},
  methods: {
    iconName () {
      return messages[this.status.type]
    }
  }
})
