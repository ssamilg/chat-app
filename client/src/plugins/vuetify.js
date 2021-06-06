import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify, {
  iconfont: 'md',
});

export default new Vuetify({
  theme: {
    primary: '#1976D2',
    accent: '#82B1FF',
    secondary: '#424242',
    success: '#4CAF50',
    info: '#2196F3',
    warning: '#FFC107',
    error: '#FF5252',
    teal: '#009688',
  },
});
