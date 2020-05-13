<script>
// @ is an alias to /src
import socketIO from 'socket.io-client';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Home',
  components: {
  },

  data() {
    return {
      socket: socketIO('http://localhost:8000/'),
      message: '',
      activeRoom: 'all',
      messages: [],
      onlineUsers: [],
      targetUser: {},
      // allUsers: [],
      users: [],
      welcomeDialog: false,
      rooms: [{ id: 0, name: 'Test Room' }, { id: 1, name: 'all' }],
    };
  },
  computed: {
    ...mapGetters(['user', 'activeChat']),
  },
  created() {
    if (this.user.username === '') this.$router.push('/Login');
  },
  mounted() {
    this.welcomeDialog = true;
    this.scrollToEnd();

    if (this.user.username !== '') {
      this.joinServer();
    }
  },
  methods: {
    ...mapActions(['fetchUsers', 'setActiveChat']),
    joinServer() {
      this.socket.on('loggedIn', (data) => {
        console.log(data);
        this.onlineUsers = data.users;
        // this.messages = data.messages;
        this.socket.emit('newUser', this.user);
      });

      this.listen();
    },
    // joinRoom(room) {
    //   this.activeRoom = room.name;
    //   this.socket.emit('joinRoom', (room.name));
    //   this.socket.on('roomMessages', (data) => {
    //     console.log(data);
    //     this.messages = data;
    //   });
    //   this.scrollToEnd();
    // },
    joinPM(user) {
      this.messages = [];
      this.activeRoom = user.username;
      this.targetUser = user;
      const params = {
        messageFrom: this.user.username,
        messageTo: this.targetUser.username,
      };
      this.socket.emit('joinPM', (params));
      this.socket.on('pmMessages', (data) => {
        this.messages = data;
      });
    },
    listen() {
      this.socket.on('userOnline', (user) => {
        this.onlineUsers.push(user);
      });
      this.socket.on('userLeft', (user) => {
        this.users.splice(this.users.indexOf(user), 1);
      });
      this.socket.on('message', (data) => {
        this.messages.push(data);
        this.scrollToEnd();
      });
    },
    sendMessage() {
      const params = {
        messageFrom: this.user.username,
        messageTo: this.targetUser.username,
        targetSocket: this.targetUser.socket,
        senderSocket: this.user.socket,
        content: this.message,
      };
      this.socket.emit('message', (params));
      this.message = '';
      this.scrollToEnd();
    },
    scrollToEnd() {
      setTimeout(() => {
        const container = this.$el.querySelector('#chat-flow');
        container.scrollTop = container.scrollHeight;
      }, 100);
    },
  },
};
</script>

<template>
  <div class="body">
    <!-- App bar -->
    <v-layout>
      <v-flex>
        <v-toolbar
          class="main-toolbar"
          dark
          extended
          flat
        >
          <v-app-bar-nav-icon/>
          <h1 style="color:white">ChatApp</h1>
        </v-toolbar>
      </v-flex>
    </v-layout>
    <v-layout>

    <!-- Chat Template -->
      <v-flex md2>
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
            <strong>Username: {{ user.username }}</strong>
          </v-flex>
          <v-spacer/>
        </v-layout>

        <v-layout>
          <v-flex>
            <v-list>
              <v-list-item>
                <strong>Global</strong>
              </v-list-item>

              <!-- <v-list-item style="margin-top:16px;border-bottom:1px solid lightgrey">
                <strong>Rooms</strong>
              </v-list-item>

              <v-list-item
                v-for="room in rooms"
                :key="room.id"
                @click="joinRoom(room)"
              >
                <strong>{{ room.name }}</strong>
              </v-list-item> -->

              <v-list-item style="margin-top:16px;border-bottom:1px solid lightgrey">
                <strong>Private Chats</strong>
              </v-list-item>

              <v-list-item
                v-for="user in onlineUsers"
                :key="user._id"
                @click.stop="joinPM(user)"
              >
                <strong>{{ user.username }}</strong>
              </v-list-item>

            </v-list>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex md8>
        <v-card
          style="margin-top: -64px;"
        >
          <!-- Chat Toolbar -->
          <v-toolbar flat class="chat-toolbar">
            <v-layout style="margin-top:8px;">
                <v-flex md4>
                  <v-layout style="font-size:24px;">
                    <strong>{{ activeRoom }}</strong>
                  </v-layout>

                  <v-layout>
                    <p>Online: {{ onlineUsers.length }}</p>
                  </v-layout>
              </v-flex>

              <v-spacer/>
            </v-layout>
          </v-toolbar>

          <v-divider/>

          <!-- Chat Content -->
          <v-card-text id="chat-flow" style="height:80vh;overflow:auto;">
            <v-layout
              v-for="message in messages"
              :key="message._id"
            >
              <v-spacer v-if="message.messageFrom === user.username"/>

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

              <v-spacer v-if="message.messageFrom !== user.username"/>
            </v-layout>
          </v-card-text>

          <!-- Chat Actions -->
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
  </div>
</template>

<style lang="scss" scoped>
.body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  color: #333;
}

.main-toolbar {
  background-color: #333 !important;
}

.chat-toolbar {
  color:black !important;
}
</style>
