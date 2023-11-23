// store/pokemon.js

import axios from 'axios';

const TOKEN = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTcwMDc3NTI0NSwiYXV0aCI6IlJPTEVfQURNSU4gUk9MRV9VU0VSIiwiaWF0IjoxNzAwNjg4ODQ1fQ.SF-IYwom19yGdEVbraItxorYvNrviDt1QMm0GfpZ35mHzA2_a4_l-GlpqEMD4gd1EM4HZr4-L6v8Ym8XEHHO4A'
export const state = () => ({
  pokemons: [],
  dialog: false,
  editedIndex: -1,
  editedItem: {
    tipo: '',
    region: '',
    elemento: '',
    nombre: '',
  },
  defaultItem: {
    tipo: '',
    region: '',
    elemento: '',
    nombre: '',
  },
});

export const mutations = {
  setPokemons(state, pokemons) {
    state.pokemons = pokemons;
  },
  setRegion(state, newValue) {
    state.editedItem.region = newValue;
  },
  setNombre(state, newValue) {
    state.editedItem.nombre = newValue;
  },
  setElemento(state, newValue) {
    state.editedItem.elemento = newValue;
  },
  setTipo(state, newValue) {
    state.editedItem.tipo = newValue;
  },
  setEditedIndex(state, index) {
    state.editedIndex = index;
  },
  setEditedItem(state, item) {
    state.editedItem = { ...item };
  },
  setDefaultItem(state) {
    state.editedItem = { ...state.defaultItem };
    state.editedIndex = -1;
    state.dialog = false; // Agrega esta línea para cerrar el diálogo
  },
  setDialog(state, value) {
    // Update the 'dialog' state in the Vuex store with the new value
    state.dialog = value;
  },
  updatePokemon(state, updatedPokemon) {
    const index = state.pokemons.findIndex((el) => el.id === updatedPokemon.id);
    if (index !== -1) {
      // Reemplazar el Pokemon existente con el Pokemon actualizado
      state.pokemons.splice(index, 1, updatedPokemon);
    }
  },
  addPokemon(state, newPokemon) {
    // Agregar el nuevo Pokemon al estado
    state.pokemons.push(newPokemon);
  },
};

export const actions = {
  async fetchPokemons({ commit }) {
    try {
      const response = await axios.get('http://localhost:8081/api/pokemon', {
        headers: {
          Authorization: TOKEN,
        },
      });
      console.log('Fetched Pokemons:', response.data); // Log the data
      commit('setPokemons', response.data);
    } catch (error) {
      console.error('Error fetching pokemons:', error);
    }
  },
  async deletePokemon({ commit, state }, item) {
    try {
      const confirmDelete = confirm('Are you sure you want to delete this item?');

      if (!confirmDelete) {
        return;
      }
      const updatedPokemons = [...state.pokemons];
      await axios.delete(`http://localhost:8081/api/pokemon/${item.id}`, {
        headers: {
          Authorization: TOKEN,
        },
      });

      const index = updatedPokemons.findIndex((el) => el.id === item.id);
      updatedPokemons.splice(index, 1);

      commit('setPokemons', updatedPokemons);
      commit('setDefaultItem');
    } catch (error) {
      console.error('Error deleting pokemon:', error);
    }
  },
  async savePokemon({ commit, state }) {
    try {
      let updatedPokemon;

      if (state.editedIndex > -1) {
        // Actualizar un Pokémon existente
        await axios.put(`http://localhost:8081/api/pokemon/${state.editedItem.id}`, state.editedItem, {
          headers: {
            Authorization: TOKEN,
          },
        });
        updatedPokemon = state.editedItem;

        // Actualizar el Pokémon editado en la lista en el estado de Vuex
        commit('updatePokemon', updatedPokemon);
      } else {
        // Crear un nuevo Pokémon
        const response = await axios.post('http://localhost:8081/api/pokemon', state.editedItem, {
          headers: {
            Authorization: TOKEN,
          },
        });
        updatedPokemon = response.data;

        // Agregar el nuevo Pokémon a la lista en el estado de Vuex
        commit('addPokemon', updatedPokemon);
      }

      // Llamar a la mutación para restablecer el estado de edición
      commit('setDefaultItem');
    } catch (error) {
      console.error('Error saving pokemon:', error);
    }
  },
};
