<script>
import { mapGetters } from 'vuex';
import MessageBubble from './MessageBubble.vue';

export default {
  name: 'ChatConversation',
  components: {
    MessageBubble,
  },
  props: {
    messages: {
      type: Array,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['user', 'activeChat', 'activeConversation']),
  },
  methods: {

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


    <v-layout class="conversation-content">
      <v-flex>
        <div
          v-for="message in activeConversation.messages"
          :key="message.id"
          class="pt-5"
        >
          <message-bubble
            :message="message"
            :is-room-message="false"
          />
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<style lang="scss">
#chat-conversation {
  height: 100%;
  background-color: #F4F0F9;

  .conversation {
    &-header {
      background-color: #D1C4E9;
      height: 48px;
      font-size: 20px;
      font-weight: 600;
      padding-left: 8px;
      text-transform: capitalize;
    }

    &-content {
      padding: 0 8px;
    }
  }
}
</style>
