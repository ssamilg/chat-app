<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ChatList',
  props: {
    rooms: {
      type: Array,
      required: true,
    },
    onlineUsers: {
      type: Array,
      required: true,
    },
    offlineUsers: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedList: [],
      selectedChat: null,
    };
  },
  computed: {
    ...mapGetters(['activeChatList']),
  },
  watch: {
    activeChatList() {
      if (this.activeChatList === 1) {
        this.selectedList = this.rooms;
      } else if (this.activeChatList === 2) {
        this.selectedList = this.mergeUsers();
      } else {
        this.selectedList = [];
      }
    },
  },
  mounted() {
    console.log(this.rooms);
    console.log(this.onlineUsers);
    console.log(this.offlineUsers);
  },
  methods: {
    selectChat(item) {
      this.selectedChat = item.title;
    },
    mergeUsers() {
      const users = this.onlineUsers.map((u) => ({ title: u, isOnline: true }));
      const offlineUsers = this.offlineUsers.map((u) => ({ title: u, isOnline: false }));

      return users.concat(offlineUsers);
    },
  },
};
</script>

<template>
  <v-list id="chat-list">
    <v-list-item
      v-for="item in selectedList"
      :key="item.id"
      :class="selectedChat === item.title ? 'selected-item' : ''"
      @click="selectChat(item)"
    >
      <template v-if="activeChatList === 1">
        {{ item.members.length }}
      </template>

      <template v-else-if="activeChatList === 2">
        <v-icon
          size="15"
          class="pr-2"
          :color="item.isOnline ? 'green' : 'gray'"
        >
          mdi-circle
        </v-icon>
      </template>

      {{ item.title }}
    </v-list-item>
  </v-list>
</template>

<style lang="scss">
#chat-list {
  background-color: #FFF3E0;
  height: 100vh;
  overflow: auto;

  .selected-item {
    background-color: #FF9800;
  }

}
::-webkit-scrollbar {
  width: 6px !important;
}

::-webkit-scrollbar-track {
  background: #FFF3E0;
  border-radius: 50px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #FFE0B2;
  border-radius: 50px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #FFCC80;
  border-radius: 50px;
}
</style>
