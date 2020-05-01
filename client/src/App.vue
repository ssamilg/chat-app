<template>
  <v-row>
    <v-col>
      <home/>
    </v-col>
  </v-row>
</template>

<script>
import Home from './views/Home.vue';

export default {
  name: 'App',

  components: {
    Home,
  },

  data: () => ({
    //
  }),
};
</script>
