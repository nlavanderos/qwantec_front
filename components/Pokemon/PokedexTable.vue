<template>
  <v-data-table
      :headers="headers"
      :items="pokemons"
      sort-by="nombre"
      class="elevation-1"
      :items-per-page="itemsPerPage"
      :page="currentPage"
      @update-page="updatePage"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Pokedex</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              {{ formTitle }}
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field :value="editedPokemon.nombre" label="Nombre pokemon" @input="updateNombre"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field :value="editedPokemon.elemento" label="Elemento" @input="updateElemento"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field :value="editedPokemon.region" label="Region" @input="updateRegion"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field :value="editedPokemon.tipo"  label="Tipo" @input="updateTipo"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="saveItem">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editedItem(item)">mdi-pencil</v-icon>
      <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="mounted">Reset</v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
    headers: Array,
    itemsPerPage: Number,
    currentPage: Number,
  },
  computed: {
    formTitle() {
      return this.$store.state.editedIndex === -1 ? 'New Item' : 'Edit Item';
    },
    pokemons() {
      console.log('Computed Pokemons:', this.$store.state.pokemons);
      return this.$store.state.pokemons;
    },
    editedPokemon: {
      get() {
        return this.$store.state.editedItem;
      },
      set(value) {
        this.$store.commit('setEditedItem', { ...value });
      },
    },
  },
  watch: {
    dialog(val) {
      if (!val) {
        this.$store.commit('setDefaultItem');
      }
    },
  },
  methods: {
    updatePage(newPage) {
      this.$emit('update-page', newPage);
    },
    updateRegion(newValue) {
      this.$store.commit('setRegion', newValue);
    },
    updateTipo(newValue) {
      this.$store.commit('setTipo', newValue);
    },
    updateNombre(newValue) {
      this.$store.commit('setNombre', newValue);
    },
    updateElemento(newValue) {
      this.$store.commit('setElemento', newValue);
    },
    close() {
      this.dialog = false;
      this.$store.commit('setDefaultItem');
    },
    editedItem(item) {
      const index = this.$store.state.pokemons.findIndex((el) => el.id === item.id);
      this.$store.commit('setEditedIndex', index);
      this.$store.commit('setEditedItem', { ...item });
      this.dialog = true;
    },
    async deleteItem(item) {
      try {
        await this.$store.dispatch('deletePokemon', item);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    },
    async saveItem() {
      try {
        await this.$store.dispatch('savePokemon');
        this.close();
      } catch (error) {
        console.error('Error saving pokemon:', error);
        console.error('Error details:', error.response.data);
      }
    },
  },

};
</script>

