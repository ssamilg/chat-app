<script>
import socketIO from 'socket.io-client';
import { mapGetters, mapActions } from 'vuex';
import ChatList from './components/ChatList.vue';
import Sidebar from './components/Sidebar.vue';
import ChatConversationContainer from './components/ChatConversationContainer.vue';

export default {
  name: 'Home',
  components: {
    Sidebar,
    ChatList,
    ChatConversationContainer,
  },
  data() {
    return {
      socket: socketIO(process.env.VUE_APP_API_ENDPOINT),
      userId: null,
      rooms: [],
      message: '',
      messages: [],
      users: [],
      welcomeDialog: false,
      createRoomDialog: false,
      isSidebarOn: true,
      newRoom: {},
      incomingMessage: {},
    };
  },
  computed: {
    ...mapGetters(['user', 'activeChat', 'activeChatList']),
    isChatSelected() {
      return typeof this.activeChat._id === 'string';
    },
  },
  watch: {
    activeChat(newVal) {
      this.joinPM(newVal);
    },
  },
  created() {
    this.userId = localStorage.getItem('chat-user-id');
    if (!this.userId) this.$router.push('/Login');
    else this.$router.push('/');
  },
  mounted() {
    this.welcomeDialog = true;

    if (this.userId) {
      this.joinServer();
    }
  },
  methods: {
    ...mapActions(['setUser', 'setActiveChat', 'setActiveConversation']),
    joinServer() {
      this.socket.on('loggedIn', (data) => {
        this.users = data.users;
        this.rooms = data.rooms;

        const user = this.users.find((u) => u._id === this.userId);
        user.socket = data.socket;

        this.setUser(user);
        this.socket.emit('newUser', this.user);
      });

      this.listen();
    },
    listen() {
      this.socket.on('usersChanged', (users) => {
        this.users = users.map((user) => ({ ...user, unreadMessages: [] }));
      });

      this.socket.on('getMessage', (data) => {
        if (data.messageFrom === this.activeChat._id) {
          this.incomingMessage = data;

          const readData = {
            messageId: data._id,
            dateRead: new Date(),
          };

          this.socket.emit('messageFeedback', readData);
        } else {
          const userIndex = this.users.findIndex((user) => user._id === data.messageFrom);
          this.users[userIndex].unreadMessages.push(data);
        }
      });
    },
    sendMessage(message) {
      this.socket.emit('sendMessage', message);
    },
    createRoom() {
      this.createRoomDialog = true;
      this.newRoom.createdBy = this.user.username;

      this.socket.emit('createRoom', this.newRoom);
      this.socket.on('getRooms', (data) => {
        this.rooms = data;
      });
      this.newRoom = {};
      this.createRoomDialog = false;
    },
    joinRoom(room) {
      this.messages = [];
      // this.setActiveChat(room.title);

      const params = {
        // eslint-disable-next-line
        roomId: room._id,
        roomTitle: room.title,
        username: this.user.username,
      };
      this.socket.emit('joinRoom', (params));

      // this.socket.on('userJoinedRoom', (data) => {
      //   // eslint-disable-next-line
      //   this.messages.push({content: `${data.user} joined to
      // ${data.room}`, messageTo: data.room});
      // });
      this.socket.on('roomMessages', (data) => {
        this.messages = data;
      });
    },
    joinPM(targetUser) {
      const params = {
        messageFrom: this.user._id,
        messageTo: targetUser._id,
        userSocket: this.user.socket,
      };
      this.socket.emit('joinPM', (params));

      this.socket.on('pmMessages', (data) => {
        const conversation = {
          title: targetUser.username,
          messages: data,
        };

        this.setActiveConversation(conversation);
      });
    },
    joinGlobal() {
      this.messages = [];
      this.setActiveChat('global');
      this.socket.emit('joinGlobal');
      this.socket.on('getGlobalMessages', ((data) => {
        this.messages = data;
      }));
    },
  },
};

</script>

<template>
  <div id="main-wrapper">
    <v-layout align-center justify-center fill-height>
      <div class="content-frame">
        <v-layout fill-height>
          <v-flex shrink>
            <sidebar/>
          </v-flex>

          <v-flex v-if="activeChatList !== 0" xs12 sm3 md3 lg3>
            <chat-list
              :users="users"
            />
          </v-flex>

          <v-flex xs12 sm9 md9 lg9>
            <chat-conversation-container
              :is-conversation-selected="isChatSelected"
              :incoming-message="incomingMessage"
              @sendNewMessage="sendMessage"
            />
          </v-flex>
        </v-layout>
      </div>
    </v-layout>
  </div>
</template>

<style lang="scss" scoped>
#main-wrapper {
  height: 100%;
  // background-image: url('https://i.pinimg.com/originals/80/e9/28/80e92848127b480fc9db643d58fbfbf4.jpg');
  // background-size: cover;
  // background: linear-gradient(90deg,
  // rgba(197,202,233,1) 0%, rgba(232,234,246,1) 40%, rgba(255,243,224,1) 60%,
  // rgba(255,224,178,1) 100%);
  background-color: rgba($color: #4DB6AC, $alpha: .3);

  .content-frame {
    height: 90vh;
    width: 155vh;
    border-radius: 16px;
    overflow: hidden;
  }
}

.body {
  color: #333;
}

.main-toolbar {
  background-color: #333 !important;
}

.chat-toolbar {
  color:black !important;
}
</style>
