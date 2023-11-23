<template>
  <div>
    <h1>List of Pokémons</h1>
    <ul>
      <li v-for="pokemon in pokemons" :key="pokemon.id">
        {{ pokemon.nombre }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  async asyncData({ store }) {
    await store.dispatch('fetchPokemons');
    return {};
  },
  computed: {
    pokemons() {
      return this.$store.state.pokemons;
    },
  },
};
</script>
