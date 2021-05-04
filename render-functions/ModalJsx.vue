<script>
export default {
  name: 'ModalJsx',
  render() {
    return (this.show) ? <div class="modal">
      <div class="content" >{ this.$slots.default }</div>
      {/* COMENTARIOS EN JSX */}
      <button onClick={this.clickCancelHandler}>Cancel</button>
      <button onClick={this.clickOkHandler}>Ok</button>
    </div> : null;
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    // message: {
    //   type: String,
    //   required: true,
    // },
  },
  methods: {
    clickCancelHandler() {
      console.log('Click on cancel');
    },
    clickOkHandler() {
      console.log('Click on Ok');
    },
  },
};
</script>

<style scoped>

</style>
