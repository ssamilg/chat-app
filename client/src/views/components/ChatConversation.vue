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
    ...mapGetters(['user', 'activeChat', 'activeConversation']),
  },
};
</script>

<template>
  <div id="chat-conversation">
    <v-layout align-center class="conversation-header">
      <v-flex shrink class="mr-2">
        <v-icon>mdi-chat</v-icon>
      </v-flex>

      <v-flex>
        {{ activeConversation.title }}
      </v-flex>
    </v-layout>

    <v-layout
      v-for="message in activeConversation.messages"
      :key="message.id"
    >
      {{ message }}
    </v-layout>
  </div>
</template>

<style lang="scss">
#chat-conversation {
  height: 100%;

  .conversation-header {
    background-color: #D1C4E9;
    height: 48px;
    font-size: 20px;
    font-weight: 600;
    padding-left: 8px;
    text-transform: capitalize;
  }
}
</style>
