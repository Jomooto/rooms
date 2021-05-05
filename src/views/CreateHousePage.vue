<template>
  <page-layout>
    <section class="py-4 bg-teal-dark">
      <div class="container">
        <form class="form">
          <div class="form__field relative">
            <i class="input-icon material-icons absolute text-grey-darker">search</i>
            <input
              class="input__search"
              id="where"
              type="text"
              placeholder="Mexico City, Mexico">
          </div>
        </form>
      </div>
    </section>
    <section class="section_create py-6">
     <div class="container">
       <h1 class="text-3xl">Publish a new room</h1>
       <form action="submit">
         <div class="mb-4">
           <label for="" class="input__label">Title</label>
           <input v-model="publication.title"
                  type="text" class="input__field" placeholder="Bruce Wayne">
         </div>
         <div class="mb-4">
           <label for="" class="input__label">Description</label>
           <textarea v-model="publication.description" type="text" class="input__field"
                     rows="10" placeholder="Bruce Wayne"> </textarea>
         </div>
         <div class="mb-4">
           <label for="" class="input__label">Feature Image</label>
           <input v-model="publication.featureImage" type="text" class="input__field"
                  placeholder="https://images.unsplash.com/photo-1573770397940-1bb341182ac0?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80">
         </div>
         <div class="mb-4 text-right">
           <button v-on:click.prevent="save" class="w-full bg-yellow-dark text-yellow-dark
           font-semibold py-3 px-6 rounded">Crear</button>
         </div>
       </form>
     </div>
    </section>
  </page-layout>
</template>

<script>
import PageLayout from '../layouts/PageLayout.vue';

export default {
  name: 'CreateHousePage',
  components: {
    PageLayout,
  },
  data() {
    return {
      publication: {
        title: '',
        description: '',
        featureImage: '',
      },
    };
  },
  methods: {
    save() {
      const { title, description, featureImage } = this.publication;
      const room = {
        title,
        description,
        feature_image: featureImage,
        publishedAt: Date.now(),
      };
      this.$store.dispatch('CREATE_ROOM', room);
    },
  },
};
</script>

<style scoped>

</style>
