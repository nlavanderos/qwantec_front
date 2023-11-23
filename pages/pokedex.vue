<template>
  <div>
    <PokedexTable
        :headers="headers"
        :itemsPerPage="itemsPerPage"
        :currentPage.sync="currentPage"
        @update-page="updatePage"
    />
  </div>
</template>

<script>
import PokedexTable from '~/components/Pokemon/PokedexTable.vue';

export default {
  components: {
    PokedexTable,
  },
  data() {
    return {
      headers: [
        { text: 'ID', align: 'start', sortable: false, value: 'id' },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Tipo', value: 'tipo' },
        { text: 'Elemento', value: 'elemento' },
        { text: 'Region', value: 'region' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      itemsPerPage: 10,
      currentPage: 1,
    };
  },
  async mounted() {
    console.log('Pokedex mounted');
    await this.$store.dispatch('fetchPokemons');
  },
  methods: {
    // Resto de métodos

    updatePage(newPage) {
      this.currentPage = newPage;
    },
  },
};
</script>
