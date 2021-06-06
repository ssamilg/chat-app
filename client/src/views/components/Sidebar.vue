<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Sidebar',
  data() {
    return {
      isSidebarOn: true,
      mini: true,
      selectedItemId: 2,
    };
  },
  computed: {
    ...mapGetters(['user', 'availableChatLists']),
  },
  methods: {
    ...mapActions(['setActiveChatList']),
    selectList(item) {
      this.selectedItemId = item.id;
      this.mini = true;

      this.setActiveChatList(item.id);
    },
  },
};
</script>

<template>
  <div id="chat-sidebar">
    <v-navigation-drawer
      v-model="isSidebarOn"
      :mini-variant="mini"
      color="teal"
      class="navigation-drawer"
      hide-overlay
      permanent
      stateless
      dark
    >
      <v-list
        class="pa-0"
        dense
        nav
      >
        <v-list-item @click="mini = !mini">
          <v-list-item-avatar>
            <v-btn icon>
              <v-icon>menu</v-icon>
            </v-btn>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>ChatApp</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <template v-if="!mini">
          <!-- TODO User account infos should be displayed -->
          <v-list-item class="my-3">
            <v-list-item-content>
              <v-icon size="72">
                person
              </v-icon>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content class="justify-center user-title">
              {{ user.username }}
            </v-list-item-content>
          </v-list-item>
        </template>

        <v-list-item
          v-for="item in availableChatLists"
          :key="item.id"
          :class="selectedItemId === item.id? 'selected-drawer-item': ''"
          class="drawer-item"
          @click="selectList(item)"
        >
          <v-list-item-avatar>
            <v-icon size="18">{{ item.icon }}</v-icon>
          </v-list-item-avatar>

          <v-list-item-content class="item-title">
            {{ item.title }}
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<style lang="scss" scoped>
#chat-sidebar{
  height: 100%;

  .v-list .v-list-item {
    height: 48px;
    margin-bottom: 0;
  }

  .navigation-drawer {
    max-width: 25vh;
  }

  .selected-drawer-item {
    background-color: darkslategrey !important;
  }

  .user-title {
    background-color: white !important;
    color: teal !important;
    min-height: 48px;

    .v-list--nav .v-list-item {
      padding: 0 !important;
    }
  }

  .drawer-item {
    .item-title {
      font-weight: 600;
    }
  }

  .v-list--nav .v-list-item, .v-list--nav .v-list-item:before {
    border-radius: 0;
  }
}
</style>
