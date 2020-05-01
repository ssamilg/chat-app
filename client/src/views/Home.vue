<script>
// @ is an alias to /src
import socketIO from 'socket.io-client';

export default {
  name: 'Home',
  components: {
  },
  data() {
    return {
      socket: socketIO('http://localhost:8000/'),
      messages: [],
      users: [],
    };
  },
  computed: {
  },
  mounted() {
    this.getMessage();
  },
  methods: {
    getMessage() {
      this.socket.on('chat message', (data) => {
        this.messages.push(data.message);
      });
    },
  },
};
</script>

<template>
  <v-row>
    <v-spacer/>
    <v-col md4>
      <img alt="Vue logo" src="../assets/logo.png">
      <v-btn>
        i am a button
      </v-btn>
      <v-row
        v-for="message in messages"
        :key="message.id"
      >
        <h1>You have a message: {{ message }} </h1>
      </v-row>
    </v-col>
    <v-spacer/>
  </v-row>
</template>
