<script>
import { mapActions } from 'vuex';

export default {
  Name: 'Login',
  data() {
    return {
      username: '',
    };
  },
  computed: {
  },
  methods: {
    ...mapActions(['setUsername']),
    enter() {
      if (this.username === '') this.username = 'Anonymous';
      this.setUsername(this.username);
      this.$router.push('/');
    },
  },
};
</script>

<template>
  <v-layout justify-center align-center>
    <v-spacer/>
    <v-flex md3>
      <v-card>
        <v-card-title>
          Who Are You ?
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="username"
            label="Your Name"
            @keyup.enter.native="enter"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="success"
            depressed block
            @click.stop="enter"
          >
            Enter
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-spacer/>
  </v-layout>
</template>

<style>

</style>
