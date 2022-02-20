<script>

export default {
  name: 'App',
  created() {
    this.userId = localStorage.getItem('chat-user-id');
    if (!this.userId) this.$router.push('/Login');
    else this.$router.push('/');
  },
};
</script>

<template>
  <v-app>
    <router-view/>
  </v-app>
</template>
