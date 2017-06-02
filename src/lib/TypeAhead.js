export default {
  data () {
    return {
      query: '',
      current: -1,
      loading: false,
      selectFirst: false
    }
  },

  computed: {
    hasItems () {
      return this.items.length > 0
    },

    isEmpty () {
      return !this.query
    },

    isDirty () {
      return !!this.query
    }
  },

  methods: {
    cancel () {
      // used to 'cancel' previous searches
    },

    setActive (index) {
      this.current = index
    },

    activeClass (index) {
      return {
        active: this.current === index
      }
    },

    hit () {
      if (this.current !== -1) {
        this.onHit(this.items[this.current])
      }
    }
  }
}
