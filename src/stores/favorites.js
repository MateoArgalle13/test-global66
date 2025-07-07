import { defineStore } from 'pinia'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    // Inicializa favorites desde localStorage si existe, si no, un array vacío
    favorites: [],
  }),
  getters: {
    isFavorite: (state) => (pokemonId) => {
      return state.favorites.some((pokemon) => pokemon.id === pokemonId)
    },
    getFavorites: (state) => state.favorites,
  },
  actions: {
    addFavorite(pokemon) {
      if (!this.isFavorite(pokemon.id)) {
        this.favorites.push(pokemon)
        console.log(`Added ${pokemon.name} to favorites.`)
      }
    },
    removeFavorite(pokemonId) {
      this.favorites = this.favorites.filter((pokemon) => pokemon.id !== pokemonId)
      console.log(`Removed ${pokemonId} from favorites.`)
    },
    toggleFavorite(pokemon) {
      if (this.isFavorite(pokemon.id)) {
        this.removeFavorite(pokemon.id)
      } else {
        this.addFavorite(pokemon)
      }
    },
  },
  persist: {
    enabled: true,
  },
})
