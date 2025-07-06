<template>
  <main class="container py-4">
    <h1 class="text-center mb-4 d-none">Mis Pokémons Favoritos</h1>
    <p class="d-none">Pokemones escogidos como favoritos</p>

    <div class="input-group">
      <span class="input-group-text bg-white border-end-0"><i class="bi bi-search"></i></span>
      <input
        type="text"
        class="form-control border-start-0 ps-0"
        placeholder="Search favorite Pokémon..."
        v-model="searchQuery"
        @input="filterFavorites"
      />
    </div>
    <div
      v-if="favoritesStore.getFavorites.length === 0"
      class="alert alert-info text-center"
      role="alert"
    >
      Aún no tienes Pokémons favoritos. ¡Añade algunos desde la lista!
    </div>
    <div
      v-else-if="filteredFavorites.length === 0 && searchQuery"
      class="alert alert-warning text-center"
      role="alert"
    >
      No Pokémons favoritos encontrados que coincidan con tu búsqueda.
    </div>

    <div v-else class="list-group mb-4 shadow-sm">
      <PokemonCard
        v-for="pokemon in filteredFavorites"
        :key="pokemon.id"
        :pokemon="pokemon"
        :isFavoriteView="true"
        @card-click="showPokemonDetails"
        @toggle-favorite="favoritesStore.removeFavorite(pokemon.id)"
      />
    </div>
  </main>

  <PokemonDetailsModal
    ref="pokemonModalRef"
    modalId="pokemonDetailsModalFavorites"
    :pokemon="selectedPokemon"
    :showFavoriteButton="false"
    @close="handleModalClose"
  />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useFavoritesStore } from '@/stores/favorites'
import { fetchPokemonDetails } from '@/services/pokeapi'
import PokemonDetailsModal from '@/components/pokemon/PokemonDetailsModal.vue'
import PokemonCard from '@/components/pokemon/PokemonCard.vue'

const favoritesStore = useFavoritesStore()
const searchQuery = ref('')
const filteredFavorites = ref([])
const selectedPokemon = ref(null)
const pokemonModalRef = ref(null)

// Lógica de búsqueda y filtrado
const filterFavorites = () => {
  if (!searchQuery.value) {
    filteredFavorites.value = [...favoritesStore.getFavorites]
  } else {
    filteredFavorites.value = favoritesStore.getFavorites.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }
}

// Observa cambios en los favoritos para actualizar la lista filtrada
watch(
  () => favoritesStore.getFavorites,
  () => {
    filterFavorites()
  },
  { immediate: true },
)

// Lógica del Modal
const showPokemonDetails = async (pokemon) => {
  try {
    selectedPokemon.value = { ...pokemon }
    pokemonModalRef.value.showModal()

    const details = await fetchPokemonDetails(pokemon.name)
    selectedPokemon.value = {
      ...pokemon,
      ...details,
      imageUrl: details.imageUrl,
    }
  } catch (error) {
    console.error('Error al cargar detalles del Pokémon:', error)
    pokemonModalRef.value.hideModal()
    selectedPokemon.value = null
  }
}

const handleModalClose = () => {
  selectedPokemon.value = null
}

onMounted(() => {
  filterFavorites()
})
</script>

<style scoped>
.container {
  max-width: 960px;
  padding-bottom: 75px;
  flex-grow: 1;
}

.input-group {
  max-width: 570px;
  margin: 0 auto 1.5rem auto;
}
.input-group-text {
  border-radius: 0.375rem 0 0 0.375rem;
  border-color: #ced4da;
  color: #6c757d;
}

.list-group {
  max-width: 570px;
  margin: 0 auto;
}

.list-group-item:first-child {
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
}
.list-group-item:last-child {
  border-bottom-left-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
  margin-bottom: 0;
}

h1 {
  font-size: 2.5rem;
  color: #343a40;
}
</style>
