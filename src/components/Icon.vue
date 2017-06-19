<template>
  <svg :class="classes()"><use :xlink:href="icon()"></use></svg>
</template>
<script>
const iconClass = 'hdd-icon'

export default {
  props: [
    'class',
    'name'
  ],
  methods: {
    classes () {
      if (!this.class) return iconClass
      return `${iconClass} ${this.class}`
    },
    icon () {
      return `#${this.name}`
    }
  }
}
</script>
