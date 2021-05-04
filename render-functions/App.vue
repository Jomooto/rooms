<template>
 <div id="app">
   <button v-on:click.prevent="toggleHandler">
     Toogle modal
   </button>
<!--   <modal-create-element v-bind:show="show">-->
<!--     <p>Hello world</p>-->
<!--   </modal-create-element>-->
   <modal-jsx v-bind:show="show">
     <p>Hello world JSX</p>
   </modal-jsx>
 </div>
</template>

<script>
// import ModalCreateElement from './ModalCreateElement.vue';
import ModalJsx from './ModalJsx.vue';

export default {
  name: 'App',
  data() {
    return {
      show: false,
    };
  },
  methods: {
    toggleHandler() {
      this.show = !this.show;
    },
  },
  components: {
    // ModalCreateElement,
    ModalJsx,
  },
};
</script>

<style scoped>
body {
  background: #cecece;
}

.modal {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  width: 250px;
  background: #fff;
  padding: 15px;
}

.modal > .message {
  margin: 0;
  margin-bottom: 10px;
}
</style>
