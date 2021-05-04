<script>
import { mapGetters } from 'vuex';

export default {
  name: 'MessageBubble',
  props: {
    message: {
      type: Object,
      required: true,
    },
    isRoomMessage: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['user']),
    isSentByMe() {
      return this.message.messageFrom === this.user.username;
    },
  },
};
</script>

<template>
  <div id="message-bubble-wrapper">
    <v-layout :reverse="isSentByMe">
      <v-flex shrink class="message-bubble">
        <v-layout v-if="isRoomMessage" :class="isSentByMe ? 'justify-end' : ''">
          {{ message.messageFrom }}
        </v-layout>

        <v-layout>
          {{ message.content }}
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>

<style lang="scss">
#message-bubble-wrapper {

  .message-bubble {
    padding: 8px;
    border: 2px solid red;
    border-radius: 12px;
  }

}
</style>
