<template>
  <div class="pokemon-card">
    <router-link
      :to="{ name: 'PokemonDetail', params: { name: pokemon.name } }"
      class="pokemon-link"
    >
      <img :src="pokemon.sprites.front_default" :alt="pokemon.name" class="pokemon-image" />
      <h3 class="pokemon-name">{{ pokemon.name }}</h3>
    </router-link>
    <Button
      :variant="isFav ? 'favorite' : 'secondary'"
      @click="toggleFavorite"
      class="favorite-button"
    >
      {{ isFav ? '❤️ Favorito' : '🤍 Añadir' }}
    </Button>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { useFavoritesStore } from '@/stores/favorites'
import Button from '@/components/ui/Button.vue'

const props = defineProps({
  pokemon: {
    type: Object,
    required: true,
  },
})

const favoritesStore = useFavoritesStore()

const isFav = computed(() => favoritesStore.isFavorite(props.pokemon.id))

const toggleFavorite = () => {
  favoritesStore.toggleFavorite(props.pokemon)
}
</script>

<style scoped>
.pokemon-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.2s ease-in-out;
}

.pokemon-card:hover {
  transform: translateY(-5px);
}

.pokemon-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  flex-grow: 1; /* Para que ocupe el espacio antes del botón */
}

.pokemon-image {
  width: 96px; /* Tamaño estándar de sprites */
  height: 96px;
  margin-bottom: var(--spacing-sm);
}

.pokemon-name {
  text-transform: capitalize;
  font-size: 1.1em;
  margin-bottom: var(--spacing-md);
}

.favorite-button {
  margin-top: auto; /* Empuja el botón hacia abajo */
  width: 100%;
}
</style>
