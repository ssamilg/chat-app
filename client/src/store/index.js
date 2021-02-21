import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      username: '',
    },
    activeChat: '',
    activeChatList: -1,
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
    login(_, params) {
      return axios.post('/users/login', params);
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
