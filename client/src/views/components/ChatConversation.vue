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
  data() {
    return {
      newMessage: '',
    };
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
        <v-icon color="#673AB7">mdi-chat</v-icon>
      </v-flex>

      <v-flex>
        {{ activeConversation.title }}
      </v-flex>
    </v-layout>


    <v-layout class="conversation-content">
      <v-flex grow>
        <div
          v-for="(message, index) in activeConversation.messages"
          :key="message.id"
        >
          <message-bubble
            :message="message"
            :prev-message="index === 0 ? {} : activeConversation.messages[index - 1]"
            :next-message="index === activeConversation.messages.length - 1
            ? {} : activeConversation.messages[index + 1]"
          />
        </div>
      </v-flex>
    </v-layout>

    <v-layout class="conversation-actions">
      <v-flex md11 class="fill-height">
        <v-textarea
          v-model="newMessage"
          label="Type your message..."
          rows="2"
          color="#673AB7"
          hide-details
          no-resize
          outlined
        />
      </v-flex>

      <v-flex md1>
        <v-btn icon class="send-btn mx-2" color="#673AB7">
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<style lang="scss">
#chat-conversation {
  height: 100vh;
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
      margin-bottom: 8px;
      height: 80%;
      overflow: auto;
      padding: 8px 8px;
    }

    &-actions {
      height: 12%;
      padding: 8px 8px;

      .v-input {
        height: 100%;

        .v-input__control {
          height: 100%;

          .v-input__slot {
            height: 100%;
          }
        }
      }

      .send-btn {
        border: 1px solid #B39DDB;
        // background-color: #673AB7;
        border-radius: 4px;
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
