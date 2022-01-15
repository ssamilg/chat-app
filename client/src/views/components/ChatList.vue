<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'ChatList',
  props: {
    users: {
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
    ...mapGetters(['activeChatList', 'user']),
    listHeader() {
      const header = {
        title: 'Choose one to chat !',
        icon: 'mdi-chat',
      };

      if (this.activeChatList === 1) {
        header.title = 'Rooms';
        header.icon = 'mdi-account-group';
      } else if (this.activeChatList === 2) {
        header.title = 'Peoples';
        header.icon = 'mdi-account';
      }

      return header;
    },
  },
  watch: {
    users() {
      this.selectedList = this.getUserList();
    },
    activeChatList() {
      if (this.activeChatList === 1) {
        this.selectedList = [];
      } else if (this.activeChatList === 2) {
        this.selectedList = this.getUserList();
      } else {
        this.selectedList = [];
      }
    },
  },
  methods: {
    ...mapActions(['setActiveChat']),
    selectChat(item) {
      item.unreadMessages.splice(0);
      this.setActiveChat(item);
      this.selectedChat = item._id;
    },
    getUserList() {
      return this.users.filter((u) => u._id !== this.user._id);
    },
  },
};
</script>

<template>
  <v-list id="chat-list" class="pa-0">
    <v-list-item class="list-header">
      <v-layout align-center>
        <v-icon color="white" class="pr-1">
          {{ listHeader.icon }}
        </v-icon>

        {{ listHeader.title }}
      </v-layout>
    </v-list-item>

    <template v-if="selectedList.length">
      <v-list-item
        v-for="item in selectedList"
        :key="item.id"
        :class="selectedChat === item._id ? 'selected-item' : ''"
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

        {{ item.username }}

        <template v-if="item.unreadMessages && item.unreadMessages.length">
          {{ ' - ' }}
          {{ item.unreadMessages.length }}
        </template>
      </v-list-item>
    </template>

    <template v-else>
      <v-list-item>
        Coming Soon...
      </v-list-item>
    </template>
  </v-list>
</template>

<style lang="scss">
#chat-list {
  background-color: #FFF3E0;
  height: 100%;
  overflow: auto;

  .list-header {
    background-color: #FB8C00;
    color: white !important;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .selected-item {
    background-color: #FFCC80;
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
