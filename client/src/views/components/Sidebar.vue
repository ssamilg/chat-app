<script>
import { mapActions } from 'vuex';

export default {
  name: 'Sidebar',
  data() {
    return {
      isSidebarOn: true,
      mini: true,
      selectedItemId: -1,
      listItems: [
        {
          id: 0,
          icon: 'language',
          title: 'Global',
        },
        {
          id: 1,
          icon: 'mdi-account-group',
          title: 'Rooms',
        },
        {
          id: 2,
          icon: 'person',
          title: 'Private Chats',
        },
      ],
    };
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

        <v-list-item
          v-for="item in listItems"
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

  .navigation-drawer {
    max-width: 25vh;
  }

  .selected-drawer-item {
    background-color: darkslategrey !important;
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
