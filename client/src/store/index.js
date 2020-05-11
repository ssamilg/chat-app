import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    username: '',
  },
  getters: {
    username(state) {
      return state.username;
    },
  },
  mutations: {
    setUsername(state, value) {
      state.username = value;
    },
  },
  actions: {
    setUsername({ commit }, value) {
      commit('setUsername', value);
    },
    login(_, params) {
      return axios.post('/users/login', params);
    },
    signup(_, params) {
      return axios.post('/users/signUp', params);
    },
    fetchUsers() {
      return axios.get('/users');
    },
  },
  modules: {
  },
});
