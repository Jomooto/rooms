import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase';
import countObjectProperties from './utils';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    users: {},
    services: {},
    rooms: {},
    authId: '38St7Q8Zi2N1SPa5ahzssq9kbyp1',
    modals: {
      login: false,
      register: false,
    },
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
  },
  getters: {
    modals: state => state.modals,
    authUser: state => state.users[state.authId],
    rooms: state => state.rooms,
    services: state => state.services,
    userRoomsCount: state => id => countObjectProperties(state.users[id].rooms),
  },
});
