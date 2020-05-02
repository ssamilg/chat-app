<script>
// @ is an alias to /src
import socketIO from 'socket.io-client';

export default {
  name: 'Home',
  components: {
  },

  data() {
    return {
      username: '',
      socket: socketIO('http://localhost:8000/'),
      messages: [],
      users: [],
      drawer: false,
      welcomeDialog: false,
      message: '',
    };
  },
  computed: {
  },
  // watch: {
  //   welcomeDialog() {
  //     if (!this.welcomeDialog) {
  //       this.joinServer();
  //     }
  //   },
  // },
  mounted() {
    // if (this.username === '') {
    //   this.welcomeDialog = true;
    // }
    this.username = prompt('Type your username');

    if (!this.username) {
      this.username = 'Anonymous';
    }

    this.joinServer();

    this.getMessage();
  },
  methods: {
    joinServer() {
      this.socket.on('loggedIn', (data) => {
        this.users = data.users;
        this.messages = data.messages;
        this.socket.emit('newUser', this.username);
      });

      this.listen();
    },
    listen() {
      this.socket.on('userOnline', (user) => {
        this.users.push(user);
      });
      this.socket.on('userLeft', (user) => {
        this.users.splice(this.users.indexOf(user), 1);
      });
      this.socket.on('message', (data) => {
        this.messages.push(data.message);
      });
    },
    closeWelcomeDialog() {
      this.welcomeDialog = false;
      if (this.username === '') this.username = 'Anonymous';
    },
    sendMessage() {
      if (!this.message) {
        alert('Type message');
        return;
      }

      this.socket.emit('message', (this.message));
      this.message = '';
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
            <strong>Username: {{ username }}</strong>
          </v-flex>
          <v-spacer/>
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
                    <strong>Room Test</strong>
                  </v-layout>

                  <v-layout>
                    <p>Online: {{ users.length }}</p>
                  </v-layout>
              </v-flex>

              <v-spacer/>

              <v-flex md2>
                <v-btn icon>
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>

                <v-btn icon>
                  <v-icon>mdi-apps</v-icon>
                </v-btn>

                <v-btn icon>
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-toolbar>

          <v-divider/>

          <!-- Chat Content -->
          <v-card-text style="height:80vh;overflow:auto;">
            <v-layout
              v-for="message in messages"
              :key="message.id"
            >
              <v-spacer v-if="message.username === username"/>

              <v-flex md4 pt-5>
                <v-card>
                  <v-card-title>
                    <v-icon>face</v-icon>
                    {{ message.username }}
                  </v-card-title>
                  <v-divider/>

                  <v-card-text>
                    {{ message.message }}
                  </v-card-text>
                </v-card>
              </v-flex>

              <v-spacer v-if="message.username !== username"/>
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
      persistent
    >
      <v-card>
        <v-card-title>
          Who Are You ?
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="username"
            label="Your Name"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="success"
            depressed block
            @click="closeWelcomeDialog"
          >
            Enter
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
