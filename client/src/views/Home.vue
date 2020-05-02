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
      welcomeDialog: true,
    };
  },
  computed: {
  },
  mounted() {
    if (this.username === '') this.welcomeDialog = true;
    this.getMessage();
  },
  methods: {
    getMessage() {
      this.socket.on('message', (data) => {
        this.messages.push(data.message);
      });
    },
  },
};
</script>

<template>
  <div class="body">
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

          <v-card-text style="height:85vh;">
            <v-layout
              v-for="message in messages"
              :key="message.id"
            >
              <v-flex md4>
                <v-card>
                  <v-card-title>
                    {{ message.username }}
                  </v-card-title>
                  <v-divider/>

                  <v-card-text>
                    {{ message.message }}
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-spacer/>
            </v-layout>
          </v-card-text>
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
            @click="welcomeDialog = false"
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
