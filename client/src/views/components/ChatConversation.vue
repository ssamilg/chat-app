<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ChatConversation',
  props: {
    messages: {
      type: Array,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['user', 'activeChat']),
  },
};
</script>

<template>
  <div>
    <v-layout>
      {{ activeChat.title }}
    </v-layout>

    <v-layout
      v-for="message in messages"
      :key="message.id"
    >
      {{ message }}
    </v-layout>
  </div>
</template>

<style>

</style>
