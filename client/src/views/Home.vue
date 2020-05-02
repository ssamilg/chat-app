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
    };
  },
  computed: {
  },
  mounted() {
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
  <div>
    <v-layout>
      <v-flex>
        <v-toolbar
          color="primary"
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
      <v-spacer/>
      <v-flex md8>
        <v-card
          style="margin-top: -64px;"
        >
          <v-toolbar flat>
            <v-layout>
              <v-flex md4>
                <v-list dense two-line>
                  <v-list-tile>
                    <v-list-tile-title>
                      <v-toolbar-title class="grey--text">Room Test</v-toolbar-title>
                    </v-list-tile-title>

                    <v-list-tile-subtitle>
                      Online: {{ users.length }}
                    </v-list-tile-subtitle>
                  </v-list-tile>
                </v-list>
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

    <!-- <v-row>
      <v-col>
        <v-row style="border:2px solid red" justify-center>
          <v-spacer/>
          <v-col md4>
            <img alt="Vue logo" src="../assets/logo.png">
          </v-col>
          <v-spacer/>
        </v-row>
        <v-row
          class="body"
          v-for="message in messages"
          :key="message.id"
        >
          <h1>You have a message: {{ message.message }} </h1>
        </v-row>
      </v-col>
    </v-row> -->
  </div>
</template>

<style lang="scss" scoped>
.body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  color: #333;
}

</style>
