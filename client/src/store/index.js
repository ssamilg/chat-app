import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      username: '',
    },
    activeChat: {},
    activeChatList: 2,
    activeConversation: {},
  },
  getters: {
    user(state) {
      return state.user;
    },
    activeChat(state) {
      return state.activeChat;
    },
    activeChatList(state) {
      return state.activeChatList;
    },
    activeConversation(state) {
      return state.activeConversation;
    },
    availableChatLists() {
      return [
        // {
        //   id: 0,
        //   icon: 'language',
        //   title: 'Global',
        // },
        {
          id: 1,
          icon: 'mdi-account-group',
          title: 'Rooms',
        },
        {
          id: 2,
          icon: 'mdi-account',
          title: 'Private Chats',
        },
      ];
    },
  },
  mutations: {
    setUser(state, value) {
      state.user = value;
    },
    setActiveChat(state, value) {
      state.activeChat = value;
    },
    setActiveChatList(state, value) {
      state.activeChatList = value;
    },
    setActiveConversation(state, value) {
      state.activeConversation = value;
    },
  },
  actions: {
    setUser({ commit }, value) {
      commit('setUser', value);
    },
    setActiveChat({ commit }, value) {
      commit('setActiveChat', value);
    },
    setActiveChatList({ commit }, value) {
      commit('setActiveChatList', value);
    },
    setActiveConversation({ commit }, value) {
      commit('setActiveConversation', value);
    },
    login(_, params) {
      return axios.post('/users/login', params)
        .then(({ data }) => {
          localStorage.setItem('chat-auth-token', data.token);
          localStorage.setItem('chat-user-id', data.userId);
        });
    },
    signup(_, params) {
      return axios.post('/users/signUp', params);
    },
    fetchUserSocket(_, username) {
      return axios.get(`/users/${username}`);
    },
  },
  modules: {
  },
});
