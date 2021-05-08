import firebase from 'firebase';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBfsdsdu5YyyPV5kEYPrKKbK_dzML5vgT4',
  authDomain: 'platzirooms-255f0.firebaseapp.com',
  databaseURL: 'https://platzirooms-255f0-default-rtdb.firebaseio.com',
  projectId: 'platzirooms-255f0',
  storageBucket: 'platzirooms-255f0.appspot.com',
  messagingSenderId: '110796631486',
  appId: '1:110796631486:web:52c4fc02f2c9854ed7ddef',
  measurementId: 'G-8LL6GWQ9K8',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();


new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate() {
    this.$store.dispatch('FETCH_USER', { id: store.state.authId });
  },
}).$mount('#app');
