<script>
import ChatConversation from './ChatConversation.vue';

export default {
  name: 'ChatConversationContainer',
  components: {
    ChatConversation,
  },
  props: {
    isConversationSelected: {
      type: Boolean,
      required: true,
    },
    incomingMessage: {
      type: Object,
      required: true,
    },
  },
  methods: {
    sendNewMessage(value) {
      this.$emit('sendNewMessage', value);
    },
  },
};
</script>

<template>
  <v-layout id="chat-conversation-container">
    <template v-if="isConversationSelected">
      <chat-conversation
        :incoming-message="incomingMessage"
        @sendNewMessage="sendNewMessage"
      />
    </template>

    <template v-else>
      <v-flex align-self-center class="welcome-message">
        <v-layout row align-center justify-center>
          <v-flex shrink>
            Welcome to
          </v-flex>
        </v-layout>

        <v-layout row align-center justify-center>
          <v-flex shrink class="brand-title">
            <v-icon color="#333">mdi-chat</v-icon>
            ChatApp Alpha
          </v-flex>
        </v-layout>
      </v-flex>
    </template>
  </v-layout>
</template>

<style lang="scss">
#chat-conversation-container {
  height: 100%;
  background-color: #F4F0F9;

  .welcome-message {
    font-size: 24px;

    .brand-title {
      font-weight: 900;
    }
  }
}
</style>
