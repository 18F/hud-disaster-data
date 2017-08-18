<template lang="pug">
div.btn-group.user-selector
  label.sr-only(for='UserSelector') User selector
  button(type="button" @click="toggleUserSelector" name="UserSelector" title="Select user" :class="selectUserExpanded" style="color:gray;background:#001a2a;")
    | {{ selectedUser.name }}
    icon(name="fa-caret-up" v-show="showUserSelection")
    icon(name="fa-caret-down" v-show="!showUserSelection")
  div.user-state-list(v-show="showUserSelection")
    ul
      li(v-for="user in availableUsers" @click="selectUser(user)" style="text-align:center;" )
        | {{ user.name }}
</template>
<script>
export default {
  name: 'user-selector',
  created () {
    this.selectUser(this.availableUsers[0])
  },
  data () {
    return {
      showUserSelection: false,
      availableUsers: [
        {name: 'All locations user', username: 'ALL'},
        {name: 'Iowa user', username: 'IA'},
        {name: 'Wisconsin user', username: 'WI'},
        {name: 'Texas user', username: 'TX'}
      ]
    }
  },
  methods: {
    toggleUserSelector () {
      this.showUserSelection = !this.showUserSelection
    },
    selectUser (user) {
      this.$store.commit('setUser', user)
      this.showUserSelection = false
    }
  },
  computed: {
    selectUserExpanded () {
      return this.showUserSelection ? 'expanded' : false
    },
    selectedUser () {
      return this.$store.getters.user
    }
  }
}
</script>
<style lang="scss">
.user-selector {
  display: none;
  z-index: 2;
  position: absolute;
  top: 30px;
  right: 10px;
  background-color: #fff;
  ul li:before {
    content: "";
  }
}
</style>
