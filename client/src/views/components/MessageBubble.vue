<script>
import { mapGetters } from 'vuex';

export default {
  name: 'MessageBubble',
  props: {
    message: {
      type: Object,
      required: true,
    },
    prevMessage: {
      type: Object,
      required: true,
    },
    nextMessage: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['user']),
    isSentByMe() {
      return this.message.messageFrom === this.user.username;
    },
    isSequel() {
      return this.prevMessage.messageFrom === this.message.messageFrom;
    },
    bubbleClass() {
      let messageBubbleClass = 'message-bubble';

      if (this.isSentByMe) {
        messageBubbleClass += ' sender';

        if (this.isSequel) {
          messageBubbleClass += ' sender-sequel';
        }
      } else {
        messageBubbleClass += ' receiver';

        if (this.isSequel) {
          messageBubbleClass += ' receiver-sequel';
        }
      }

      return messageBubbleClass;
    },
    messageTime() {
      const messageDate = new Date(this.message.dateSend);

      return `${messageDate.getHours()}.${messageDate.getMinutes()}`;
    },
    messageDate() {
      let displayingMessageDate = false;
      const prevMessageDate = new Date(this.prevMessage.dateSend);
      const messageDate = new Date(this.message.dateSend);

      if (prevMessageDate.toDateString() !== messageDate.toDateString()) {
        displayingMessageDate = `${messageDate.getDate()}.${messageDate.getMonth() + 1}.${messageDate.getFullYear()}`;
      }

      return displayingMessageDate;
    },
  },
};
</script>

<template>
  <div id="message-bubble-wrapper">
    <v-layout v-if="messageDate" justify-center align-center>
      <v-flex class="message-date"/>

      <v-flex shrink>
        {{ messageDate }}
      </v-flex>

      <v-flex class="message-date"/>
    </v-layout>

    <v-layout align-center :reverse="isSentByMe">
      <v-flex shrink :class="bubbleClass">
        <v-layout v-if="!isSequel || messageDate" :class="isSentByMe ? 'justify-end' : ''">
          <v-flex shrink class="message-sender">
            {{ message.messageFrom }}
          </v-flex>
        </v-layout>

        <v-layout :reverse="isSentByMe">
          <v-flex shrink>
            {{ message.content }}
          </v-flex>
        </v-layout>
      </v-flex>

      <v-icon size="20" class="message-time px-1">
        mdi-circle-medium
      </v-icon>

      <v-flex shrink px-1 class="message-time">
        {{ messageTime }}
      </v-flex>
    </v-layout>
  </div>
</template>

<style lang="scss">
#message-bubble-wrapper {
  margin-top: 2px;

  &:hover {
    .message-time {
      display: block;
    }
  }

  .message-bubble {
    padding: 8px;
    min-width: 10vh;

    .message-sender {
      font-weight: 600;
    }
  }

  .message-time {
    display: none;
  }

  .message-date {
    // padding: 4px;
    // border-radius: 12px;
    border-top: 1px solid #D1C4E9;
  }

  .sender {
    border-radius: 12px 12px 0 12px;
    background-color: #673AB7;
    color: white;

    &-sequel {
      border-radius: 12px 0 0 12px;
    }

  }

  .receiver {
    border-radius: 12px 12px 12px 0;
    background-color: #D1C4E9;
    color: #311B92;

    &-sequel {
      border-radius: 0 12px 12px 0;
    }
  }

}
</style>
