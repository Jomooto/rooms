import Vue from 'vue';
import Vuex, { mapGetters } from 'vuex';
import firebase from 'firebase';
import countObjectProperties from './utils';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    users: {},
    services: {},
    rooms: {},
    authId: null,
    modals: {
      login: false,
      register: false,
    },
  },
  computed: {
    ...mapGetters([
      'modals',
    ]),
  },
  mutations: {
    SET_MODAL_STATE: (state, { name, value }) => {
      // eslint-disable-next-line
      state.modals[name] = value;
    },
    SET_ROOM: (state, { newRoom, roomId }) => {
      Vue.set(state.rooms, roomId, newRoom);
    },

    APPEND_ROOM_TO_USER: (state, { roomId, userId }) => {
      //  VueSet primer elemento: objeto a modificar
      // Segundo: id o identificador, tercero: valor que se va a almacenar
      Vue.set(state.users[userId].rooms, roomId, roomId);
    },
    SET_ITEM: (state, { item, id, resource }) => {
      const newItem = item;
      newItem['.key'] = id;
      Vue.set(state[resource], id, newItem);
    },
    SET_AUTHID: (state, id) => {
      // eslint-disable-next-line
      state.authId = id;
    },
  },
  actions: {
    TOGGLE_MODAL_STATE: ({ commit }, { name, value }) => {
      commit('SET_MODAL_STATE', { name, value });
    },
    CREATE_ROOM: ({ state, commit }, room) => {
      const newRoom = room;
      const roomId = firebase.database().ref('rooms').push().key;
      newRoom.userId = state.authId;
      newRoom.publishedAT = Math.floor(Date.now() / 1000);
      newRoom.meta = { likes: 0 };

      const updates = {};
      updates[`rooms/${roomId}`] = newRoom;
      updates[`users/${newRoom.userId}/rooms/${roomId}`] = roomId;

      firebase.database().ref().update(updates)
        .then(() => {
          commit('SET_ROOM', { newRoom, roomId });
          commit('APPEND_ROOM_TO_USER', { roomId, userId: newRoom.userId });
          return Promise.resolve(state.rooms[roomId]);
        });
    },
    FETCH_ROOMS: ({ state, commit }, limit) => new Promise((resolve) => {
      let instance = firebase.database().ref('rooms');
      if (limit) {
        instance = instance.limitToFirst(limit);
      }
      instance.once('value', (snapshot) => {
        const rooms = snapshot.val();
        Object.keys(rooms).forEach((roomId) => {
          const room = rooms[roomId];
          commit('SET_ITEM', { resource: 'rooms', id: roomId, item: room });
        });
        resolve(Object.values(state.rooms));
      });
    }),
    FETCH_USER: ({ state, commit }, { id }) => new Promise((resolve) => {
      firebase.database().ref('users').child(id).once('value', (snapshot) => {
        commit('SET_ITEM', { resource: 'users', id: snapshot.key, item: snapshot.val() });
      });
      resolve(state.users[id]);
    }),
    FETCH_SERVICES: ({ state, commit }) => new Promise((resolve) => {
      const instance = firebase.database().ref('services');
      instance.once('value', (snapshot) => {
        const services = snapshot.val();
        Object.keys(services).forEach((serviceId) => {
          const service = services[serviceId];
          commit('SET_ITEM', { resource: 'services', id: serviceId, item: service });
        });
        resolve(Object.values(state.services));
      });
    }),
    CREATE_USER: ({ state, commit }, { email, name, password }) => new Promise((resolve) => {
      firebase.auth().createUserWithEmailAndPassword(email, password).then((account) => {
        const id = account.user.uid;
        const registerAt = Math.floor(Date.now() / 1000);
        const newUser = { email, name, registerAt };
        firebase.database().ref('users').child(id).set(newUser)
          .then(() => {
            commit('SET_ITEM', { resource: 'users', id, item: newUser });
            resolve(state.users[id]);
          });
      });
    }),
    FETCH_AUT_USER: ({ dispatch, commit }) => {
      const userId = firebase.auth().currentUser.uid;
      return dispatch('FETCH_USER', { id: userId })
        .then(() => {
          commit('SET_AUTHID', userId);
        });
    },
    SIGN_IN: (context, { email, password }) => {
      firebase.auth().signInWithEmailAndPassword(email, password);
    },
    LOG_OUT: ({ commit }) => {
      firebase.auth().signOut()
        .then(() => {
          commit('SET_AUTHID', null);
        });
    },
  },
  getters: {
    modals: state => state.modals,
    authUser: state => ((state.authId) ? state.users[state.authId] : null),
    rooms: state => state.rooms,
    services: state => state.services,
    userRoomsCount: state => id => countObjectProperties(state.users[id].rooms),
  },
});
