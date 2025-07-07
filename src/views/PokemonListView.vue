<template>
  <main class="container py-4">
    <h1 class="text-center mb-4 d-none">Lista de Pokémons</h1>
    <p class="d-none">Lista que tiene la información de todos los pokemones</p>
    <div class="content-page">
      <div class="row justify-content-center mb-4">
        <div class="col-12 col-md-8 col-lg-12">
          <div class="input-group">
            <span class="input-group-text bg-white border-end-0"><i class="bi bi-search"></i></span>
            <input
              type="text"
              class="form-control border-start-0 ps-0"
              placeholder="Search"
              v-model="searchTerm"
              @input="handleSearchInput"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="d-flex justify-content-center my-5">
      <Loader />
    </div>

    <div v-else-if="errorMessage" class="alert alert-danger text-center" role="alert">
      {{ errorMessage }}
      <div class="d-flex justify-content-center mt-3">
        <button
          class="get-started-button btn btn-danger btn-lg shadow-sm"
          @click="goBackHomeAndClearSearch"
        >
          Volver a Inicio
        </button>
      </div>
    </div>

    <div v-else>
      <div class="list-group mb-4 shadow-sm">
        <template v-if="paginatedAndFilteredPokemons.length > 0">
          <PokemonCard
            v-for="pokemon in paginatedAndFilteredPokemons"
            :key="pokemon.name"
            :pokemon="pokemon"
            :isFavoriteView="false"
            @card-click="showPokemonDetails"
            @toggle-favorite="favoritesStore.toggleFavorite"
          />
        </template>
        <div v-else class="no-results list-group-item text-center text-muted">
          No se encontraron Pokémons con "<strong>{{ searchTerm }}</strong
          >".

          <div class="d-flex justify-content-center mt-3">
            <button
              class="get-started-button btn btn-danger btn-lg shadow-sm go-back-home"
              @click="goBackHomeAndClearSearch"
            >
              Go Back Home
            </button>
          </div>
        </div>
      </div>

      <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4">
        <div class="mb-3 mb-md-0 d-flex align-items-center">
          <label for="itemsPerPage" class="form-label me-2 mb-0 text-muted"
            >Pokémons por página:</label
          >
          <select
            class="form-select w-auto"
            id="itemsPerPage"
            v-model="itemsPerPage"
            @change="fetchPokemonsAndUpdatePagination"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        <nav aria-label="Navegación de Pokémons">
          <ul class="pagination mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="goToPage(currentPage - 1)">Anterior</a>
            </li>
            <li
              class="page-item"
              v-for="page in visiblePages"
              :key="page"
              :class="{ active: currentPage === page }"
            >
              <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="goToPage(currentPage + 1)">Siguiente</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </main>

  <PokemonDetailsModal
    :pokemon="selectedPokemon"
    modalId="pokemonDetailsModal"
    :showFavoriteButton="true"
    @close="handleModalClose"
    ref="pokemonModalRef"
  />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { fetchPokemonList, fetchPokemonDetails } from '@/services/pokeapi'
import Loader from '@/components/ui/Loader.vue'
import { useFavoritesStore } from '@/stores/favorites'
import PokemonDetailsModal from '@/components/pokemon/PokemonDetailsModal.vue'
import PokemonCard from '@/components/pokemon/PokemonCard.vue'

const favoritesStore = useFavoritesStore()

const allPokemons = ref([])
const isLoading = ref(true)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalApiPokemonCount = ref(0)
const searchTerm = ref('')
const selectedPokemon = ref(null)
const pokemonModalRef = ref(null)
const errorMessage = ref(null) // *** RE-AÑADIDO: Para el manejo de errores en la UI ***

// --- Lógica de Carga de Datos y Paginación ---
const fetchPokemons = async () => {
  isLoading.value = true
  errorMessage.value = null // Limpia cualquier mensaje de error anterior
  try {
    const offset = (currentPage.value - 1) * itemsPerPage.value
    const limit = itemsPerPage.value
    const data = await fetchPokemonList(offset, limit)
    console.log('API response data:', data) // Para depuración
    totalApiPokemonCount.value = data.count

    // Asegúrate de que `data.results` siempre sea un array
    if (Array.isArray(data.results)) {
      allPokemons.value = data.results.map((p) => ({
        ...p,
        id: parseInt(p.url.split('/').filter(Boolean).pop()),
        // Usar official-artwork para el listado, si existe. Si no, fallback a front_default.
        // Esto es una mejora, pero la URL que te pasé antes era más simple y podría ser suficiente
        // para tus mocks si no tienes los sprites individuales para cada ID.
        // Asegúrate de que tus MOCKS para fetchPokemonList devuelvan esta estructura.
        imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${parseInt(p.url.split('/').filter(Boolean).pop())}.png`,
      }))
    } else {
      allPokemons.value = [] // Asegura que sea un array vacío si los resultados no son válidos
      console.warn('API returned unexpected results format:', data.results)
    }
  } catch (error) {
    console.error('Error al cargar Pokémons:', error)
    errorMessage.value = 'Hubo un error al cargar los Pokémons.' // Establece el mensaje de error
    allPokemons.value = [] // Limpia los pokemons si hay un error
  } finally {
    isLoading.value = false
  }
}

const totalPages = computed(() => {
  // Cuando no hay pokemones (ej. al inicio o error), totalApiPokemonCount podría ser 0.
  // Asegúrate de que totalPages sea al menos 1 para que la paginación se renderice.
  return Math.max(1, Math.ceil(totalApiPokemonCount.value / itemsPerPage.value))
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let startPage = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let endPage = Math.min(totalPages.value, startPage + maxVisible - 1)

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1)
  }

  // Asegurar que la paginación se renderiza solo si hay más de 1 página.
  if (totalPages.value <= 1 && totalApiPokemonCount.value <= itemsPerPage.value) {
    return [1] // Si solo hay una página o menos elementos que itemsPerPage, mostrar solo la página 1
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  return pages
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    currentPage.value = page
    fetchPokemons()
  }
}

const fetchPokemonsAndUpdatePagination = () => {
  currentPage.value = 1
  fetchPokemons()
}

// --- Lógica de Búsqueda ---
// Este computed solo filtra la `allPokemons.value` (los que ya están en la página actual).
// No hace una nueva llamada a la API para buscar globalmente.
const filteredPokemons = computed(() => {
  if (!searchTerm.value) {
    return allPokemons.value
  }
  const searchLower = searchTerm.value.toLowerCase()
  return allPokemons.value.filter((pokemon) => pokemon.name.toLowerCase().includes(searchLower))
})

// *** CORRECCIÓN CRÍTICA AQUÍ: ESTO YA NO HACE SLICE, SOLO SE BASA EN filteredPokemons ***
// `allPokemons` ya viene paginado de la API, `filteredPokemons` aplica el filtro de búsqueda local.
const paginatedAndFilteredPokemons = computed(() => {
  return filteredPokemons.value
})

const goBackHomeAndClearSearch = async () => {
  console.log('[goBackHomeAndClearSearch] Clearing search and resetting to home.')
  searchTerm.value = '' // Limpiar el buscador
  currentPage.value = 1
  errorMessage.value = null // Limpiar mensaje de error
  await fetchPokemons() // Esto recargará la primera página de la API
}

const handleSearchInput = () => {
  // Al buscar, reseteamos la página a 1 para que el filtro se aplique desde el principio de la lista actual
  // No necesitamos llamar a fetchPokemons aquí porque el filtro es local.
  currentPage.value = 1
}

// --- Lógica del Modal ---
const showPokemonDetails = async (pokemon) => {
  try {
    // Primero, muestra el modal con los datos básicos
    selectedPokemon.value = { ...pokemon }
    if (pokemonModalRef.value && pokemonModalRef.value.showModal) {
      pokemonModalRef.value.showModal()
    } else {
      console.warn('pokemonModalRef or showModal method not available.')
    }

    // Luego, carga los detalles adicionales y actualiza el pokemon seleccionado
    const details = await fetchPokemonDetails(pokemon.name)
    // Asegúrate de que `details.sprites.other['official-artwork'].front_default` existe
    const imageUrl =
      details.sprites?.other?.['official-artwork']?.front_default ||
      details.sprites?.front_default ||
      pokemon.imageUrl

    selectedPokemon.value = {
      ...pokemon,
      ...details,
      imageUrl: imageUrl, // Usa la URL de la API directamente
    }
  } catch (error) {
    console.error('Error al cargar detalles del Pokémon:', error)
    errorMessage.value = 'Error al cargar detalles del Pokémon.' // Muestra error en la UI
    if (pokemonModalRef.value && pokemonModalRef.value.hideModal) {
      pokemonModalRef.value.hideModal()
    }
    selectedPokemon.value = null
  }
}

const handleModalClose = () => {
  selectedPokemon.value = null
  errorMessage.value = null // Limpia el error cuando el modal se cierra
}

onMounted(() => {
  fetchPokemons()
})
</script>

<style scoped>
.container {
  max-width: 960px;
}

h1 {
  font-size: 2.5rem;
  color: #343a40;
}

.content-page {
  max-width: 570px;
  margin: auto;
}

.input-group-text {
  border-radius: 0.375rem 0 0 0.375rem;
  border-color: #ced4da;
  color: #6c757d;
}
.form-control {
  border-radius: 0 0.375rem 0.375rem 0;
}

.list-group {
  max-width: 570px;
  margin: auto;
}

.pagination .page-link {
  color: #dc3545;
}
.pagination .page-item.active .page-link {
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;
}
.form-select {
  max-width: 120px;
}
.get-started-button {
  padding: 7px 23px;
  font-size: 1.2rem;
  border-radius: 30px;
}
</style>
