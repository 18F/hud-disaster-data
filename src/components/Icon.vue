<template lang="pug">
  svg(:class="getClasses()")
    use(:xlink:href="getIcon()")
</template>
<script>
const iconClass = 'hdd-icon'
/**
* Displays an svg version of font-awesome icons
* @module components/Icon
*/
export default {
  props: [
    'classes',
    'name'
  ],
  methods: {
    getClasses () {
      if (!this.classes) return iconClass
      return `${iconClass} ${this.classes}`
    },
    getIcon () {
      return `#${this.name}`
    }
  }
}
</script>
