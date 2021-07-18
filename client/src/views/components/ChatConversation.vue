<script>
import { mapGetters } from 'vuex';
import MessageBubble from './MessageBubble.vue';

export default {
  name: 'ChatConversation',
  components: {
    MessageBubble,
  },
  props: {
    incomingMessage: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      newMessage: '',
      chatMessages: [],
    };
  },
  computed: {
    ...mapGetters(['user', 'activeChat', 'activeConversation']),
  },
  watch: {
    activeConversation(newVal) {
      this.chatMessages = newVal.messages;
      console.log(newVal.messages);
      this.scrollToEnd();
    },
    incomingMessage(newVal) {
      this.chatMessages.push(newVal);
      this.scrollToEnd();
    },
  },
  methods: {
    sendMessage() {
      const messageData = {
        senderName: this.user.username,
        messageFrom: this.user._id,
        messageTo: this.activeChat._id,
        targetSocket: this.activeChat.socket,
        senderSocket: this.user.socket,
        content: this.newMessage,
        dateSend: new Date(),
      };

      this.$emit('sendNewMessage', messageData);
      this.chatMessages.push(messageData);
      this.newMessage = '';
      this.scrollToEnd();
    },
    scrollToEnd() {
      setTimeout(() => {
        const container = this.$el.querySelector('.conversation-content');
        container.scrollTop = container.scrollHeight;
      }, 100);
    },
  },
};
</script>

<template>
  <v-layout column id="chat-conversation">
    <v-flex shrink>
      <v-layout align-center class="conversation-header">
        <v-flex shrink class="mr-2">
          <v-icon color="#673AB7">mdi-chat</v-icon>
        </v-flex>

        <v-flex>
          {{ activeConversation.title }}
        </v-flex>
      </v-layout>
    </v-flex>

    <v-flex class="conversation-content">
      <v-layout>
        <v-flex grow>
          <div
            v-for="(message, index) in chatMessages"
            :key="message.id"
          >
            <message-bubble
              :message="message"
              :prev-message="index === 0 ? {} : chatMessages[index - 1]"
              :next-message="index === chatMessages.length - 1
              ? {} : chatMessages[index + 1]"
            />
          </div>
        </v-flex>
      </v-layout>
    </v-flex>

    <v-flex shrink justify-self-end>
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
            @keyup.enter.prevent="sendMessage"
          />
        </v-flex>

        <v-flex md1 mr-2>
          <v-btn icon class="send-btn mx-2" color="#673AB7" @click="sendMessage">
            <v-icon>mdi-send</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<style lang="scss">
#chat-conversation {
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
      overflow: auto;
      padding: 8px 8px;
    }

    &-actions {
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
