<template>
  <svg :class="getClasses()"><use :xlink:href="getIcon()"></use></svg>
</template>
<script>
const iconClass = 'hdd-icon'

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
