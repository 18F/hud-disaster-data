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
        | {{ user.login }}
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
        { 'login': 'HUD_HQ_User', 'disasterids': [], 'type': 'HUD', 'hq': true },
        { 'login': 'HUD_Regional_User', 'disasterids': [4187, 4289, 1966], 'type': 'HUD', 'hq': false },
        { 'login': 'Grantee_User', 'disasterids': [4223, 4272, 1791], 'type': 'Grantee', 'hq': false },
        { 'login': 'Other_NoAuth_User', 'disasterids': [], 'type': 'Unauthorized', 'hq': false }
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
  display: true;
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
