<script>
import socketIO from 'socket.io-client';
import { mapGetters, mapActions } from 'vuex';
import ChatList from './components/ChatList.vue';
import Sidebar from './components/Sidebar.vue';
import ChatConversation from './components/ChatConversation.vue';

export default {
  name: 'Home',
  components: {
    Sidebar,
    ChatList,
    ChatConversation,
  },
  data() {
    return {
      socket: socketIO(process.env.VUE_APP_API_ENDPOINT),
      userId: null,
      rooms: [],
      message: '',
      messages: [],
      users: [],
      onlineUsers: [],
      offlineUsers: [],
      welcomeDialog: false,
      createRoomDialog: false,
      isSidebarOn: true,
      newRoom: {},
    };
  },
  computed: {
    ...mapGetters(['user', 'activeChat', 'activeChatList']),
  },
  created() {
    this.userId = localStorage.getItem('chat-user-id');
    if (!this.userId) this.$router.push('/Login');
  },
  mounted() {
    this.welcomeDialog = true;
    this.scrollToEnd();

    if (this.userId) {
      this.joinServer();
    }
  },
  methods: {
    ...mapActions(['setUser', 'setActiveChat']),
    joinServer() {
      this.socket.on('loggedIn', (data) => {
        this.users = data.users;
        this.rooms = data.rooms;

        const user = this.users.find((u) => u._id === this.userId);

        this.setUser(user);
        this.socket.emit('newUser', this.user);
      });
      this.listen();
    },
    listen() {
      this.socket.on('usersChanged', (users) => {
        this.users = users;
      });

      this.socket.on('getMessage', (data) => {
        this.messages.push(data);
        this.scrollToEnd();
      });
    },
    sendMessage() {
      const data = {
        messageFrom: this.user.username,
        messageTo: this.activeChat,
        targetSocket: this.activeChat,
        senderSocket: this.user.socket,
        content: this.message,
      };
      this.socket.emit('sendMessage', (data));
      if (this.offlineUsers.some((user) => user === this.activeChat)
      || this.onlineUsers.some((user) => user === this.activeChat)) {
        this.messages.push(data);
      }
      this.message = '';
      this.scrollToEnd();
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
      this.setActiveChat(room.title);
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
      //   this.scrollToEnd();
      // });
      this.socket.on('roomMessages', (data) => {
        this.messages = data;
      });
      this.scrollToEnd();
    },
    joinPM(targetUser) {
      this.messages = [];
      this.setActiveChat(targetUser);
      const params = {
        messageFrom: this.user.username,
        messageTo: this.activeChat,
        userSocket: this.user.socket,
      };
      this.socket.emit('joinPM', (params));

      this.socket.on('pmMessages', (data) => {
        this.messages = data;
      });
      setTimeout(() => {
        this.scrollToEnd();
      }, 100);
    },
    joinGlobal() {
      this.messages = [];
      this.setActiveChat('global');
      this.socket.emit('joinGlobal');
      this.socket.on('getGlobalMessages', ((data) => {
        this.messages = data;
        this.scrollToEnd();
      }));
    },
    scrollToEnd() {
      // setTimeout(() => {
      //   const container = this.$el.querySelector('#chat-flow');
      //   container.scrollTop = container.scrollHeight;
      // }, 100);
    },
  },
};

</script>

<template>
  <div id="main-wrapper">
    <v-layout fill-height>
      <v-flex shrink>
        <sidebar/>
      </v-flex>

      <v-flex v-if="activeChatList !== 0" xs12 sm3 md3 lg3>
        <chat-list
          :users="users"
        />
      </v-flex>

      <v-flex xs12 sm8 md8 lg8>
        <chat-conversation
          :messages="messages"
        />
      </v-flex>
    </v-layout>
    <!-- <v-layout>
      <v-flex>
        <v-toolbar
          class="main-toolbar"
          dark
          extended
          flat
        >
          <v-app-bar-nav-icon
            @click="isSidebarOn = !isSidebarOn"
          />
          <h1 style="color:white">ChatApp</h1>
        </v-toolbar>
      </v-flex>
    </v-layout>

    <v-layout>
      <v-flex md2 v-if="isSidebarOn">
        <v-layout>
          <v-spacer/>
          <v-flex md6>
            <v-icon size="180">account_circle</v-icon>
          </v-flex>
          <v-spacer/>
        </v-layout>

        <v-layout>
          <v-spacer/>
          <v-flex md6>
            <strong>Username: {{ user.username }}</strong><br>
          </v-flex>
          <v-spacer/>
        </v-layout>

        <v-layout>
          <v-flex>
            <v-list>
              <v-list-item style="margin-top:16px;border-bottom:1px solid lightgrey">
                <strong>Rooms</strong>
                <v-spacer/>
                <v-btn icon @click="createRoomDialog = true">
                  <v-icon>add</v-icon>
                </v-btn>
              </v-list-item>

              <v-list-item @click.stop="joinGlobal">
                <v-icon>language</v-icon>
                <strong>Global</strong>
              </v-list-item>

              <v-list-item
                v-for="room in rooms"
                :key="room.id"
                @click.stop="joinRoom(room)"
              >
                <v-icon>group</v-icon>
                <strong>{{ room.title }}</strong>
              </v-list-item>

              <v-list-item style="margin-top:16px;border-bottom:1px solid lightgrey">
                <strong>Private Chats</strong>
              </v-list-item>

              <v-list-item
                v-for="user in onlineUsers"
                :key="user._id"
                @click.stop="joinPM(user)"
                :style="activeChat === user? 'background-color:lightgrey' : ''"
              >
                <v-icon color="success">person</v-icon>
                <strong>{{ user }}</strong>
              </v-list-item>

              <v-divider/>

              <v-list-item
                v-for="user in offlineUsers"
                :key="user._id"
                @click.stop="joinPM(user)"
                :style="activeChat === user? 'background-color:lightgrey' : ''"
              >
                <v-icon color="gray">person</v-icon>
                <strong style="color:gray">{{ user }}</strong>
              </v-list-item>
            </v-list>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex md8>
        <v-card
          style="margin-top: -64px;"
        >
          <v-toolbar flat class="chat-toolbar">
            <v-layout style="margin-top:8px;">
                <v-flex md4>
                  <v-layout style="font-size:24px;">
                    <strong>{{ activeChat }}</strong>
                  </v-layout>

                  <v-layout>
                    <p>Online: {{ onlineUsers.length }}</p>
                  </v-layout>
              </v-flex>

              <v-spacer/>
            </v-layout>
          </v-toolbar>

          <v-divider/>

          <v-card-text id="chat-flow" style="height:80vh;overflow:auto;">
            <v-layout
              v-for="message in messages"
              :key="message._id"
            >
              <v-spacer v-if="message.messageFrom === user.username"/>

              <template v-if="activeChat !== ''">
                <v-flex md4 pt-5>
                  <v-card>
                    <v-card-title>
                      <v-icon>face</v-icon>
                      {{ message.messageFrom }}
                    </v-card-title>
                    <v-divider/>

                    <v-card-text>
                      {{ message.content }}
                    </v-card-text>
                  </v-card>
                </v-flex>
              </template>

              <v-spacer v-if="message.messageFrom !== user.username"/>
            </v-layout>
          </v-card-text>

          <v-card-actions>
            <v-layout>
              <v-flex md10 align-self-start>
                <v-textarea
                  v-model="message"
                  auto-grow
                  rows="1"
                  outlined
                  single-line
                  label="Type your message..."
                  @keydown.enter.shift.prevent="sendMessage"
                />
              </v-flex>

              <v-flex md2 pl-2 align-self-start>
                <v-btn
                  x-large
                  class="success"
                  depressed block
                  :disabled="!message"
                  @click="sendMessage"
                >
                  Send
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-flex>

      <v-spacer/>
    </v-layout>

    <v-dialog
      v-model="welcomeDialog"
      max-width="500"
    >
      <v-card>
        <v-card-title/>
        <v-card-text>
          <h1>Welcome to ChatApp !</h1>
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="info"
            depressed block
            @click.stop="welcomeDialog = false"
          >
            Start Chatting
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="createRoomDialog"
      max-width="900"
    >
      <v-card>
        <v-card-title>Create A Room</v-card-title>
        <v-card-text>
          <v-layout>
            <v-text-field
              v-model="newRoom.title"
              label="Room Title"
            />
          </v-layout>
          <v-layout>
            <v-textarea
              v-model="newRoom.description"
              label="Room Description"
            />
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-flex md2>
            <v-btn
              color="gray"
              depressed block
              @click.stop="createRoomDialog = false"
            >
              Cancel
            </v-btn>
          </v-flex>

          <v-spacer/>

          <v-flex md2>
            <v-btn
              class="success"
              depressed block
              @click.stop="createRoom"
            >
              Create Room
            </v-btn>
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
  </div>
</template>

<style lang="scss" scoped>
#main-wrapper {
  height: 100%;
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
