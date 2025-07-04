<template>
  <main class="container py-4">
    <h1 class="text-center mb-4">Lista de Pokémons</h1>

    <div v-if="isLoading" class="d-flex justify-content-center my-5">
      <Loader />
    </div>

    <div v-else>
      <div class="row mb-4 align-items-center">
        <div class="col-md-6">
          <input
            type="text"
            class="form-control"
            placeholder="Buscar Pokémon por nombre..."
            v-model="searchTerm"
            @input="resetPaginationAndFilter"
          />
        </div>
        <div class="col-md-6 d-flex justify-content-end align-items-center">
          <label for="itemsPerPage" class="form-label me-2 mb-0">Pokémons por página:</label>
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
      </div>

      <div class="row">
        <div
          class="col-md-4 mb-4"
          v-for="pokemon in paginatedAndFilteredPokemons"
          :key="pokemon.name"
        >
          <div class="card shadow-sm">
            <img :src="pokemon.imageUrl" class="card-img-top" alt="Pokémon" />
            <div class="card-body">
              <h5 class="card-title">{{ capitalizeFirstLetter(pokemon.name) }}</h5>
              <p class="card-text">#{{ pokemon.id }}</p>
              <button class="btn btn-outline-primary btn-sm">Ver Detalles</button>
            </div>
          </div>
        </div>
        <div
          v-if="paginatedAndFilteredPokemons.length === 0 && searchTerm"
          class="col-12 text-center text-muted"
        >
          No se encontraron Pokémons con "<strong>{{ searchTerm }}</strong
          >".
        </div>
        <div
          v-if="paginatedAndFilteredPokemons.length === 0 && !searchTerm && !isLoading"
          class="col-12 text-center text-muted"
        >
          No hay Pokémons para mostrar.
        </div>
      </div>

      <nav aria-label="Navegación de Pokémons">
        <ul class="pagination justify-content-center mt-4">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="goToPage(currentPage - 1)">Anterior</a>
          </li>
          <li
            class="page-item"
            v-for="page in totalPages"
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
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { fetchPokemonList } from '@/services/pokeapi' // Asegúrate de que esta ruta sea correcta
import Loader from '@/components/ui/Loader.vue' // Asegúrate de que esta ruta sea correcta

const pokemons = ref([])
const isLoading = ref(true)
const currentPage = ref(1)
const itemsPerPage = ref(20) // Valor por defecto
const totalPokemonCount = ref(0) // Total de Pokémon en la API (para calcular totalPages)
const searchTerm = ref('')

// Función para obtener los Pokémon de la API
const fetchPokemons = async () => {
  isLoading.value = true
  try {
    const offset = (currentPage.value - 1) * itemsPerPage.value
    const limit = itemsPerPage.value
    const data = await fetchPokemonList(offset, limit)
    totalPokemonCount.value = data.count // Asume que la API devuelve 'count'
    // Mapea los resultados para obtener ID e URL de imagen (ajusta según tu API)
    pokemons.value = data.results.map((p) => ({
      ...p,
      id: parseInt(p.url.split('/').filter(Boolean).pop()), // Extrae ID de la URL
      imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${parseInt(p.url.split('/').filter(Boolean).pop())}.png`,
    }))
  } catch (error) {
    console.error('Error al cargar Pokémons:', error)
  } finally {
    isLoading.value = false
  }
}

// Computed property para la lista de Pokémon filtrados (para el buscador)
const filteredPokemons = computed(() => {
  if (!searchTerm.value) {
    return pokemons.value
  }
  const searchLower = searchTerm.value.toLowerCase()
  return pokemons.value.filter((pokemon) => pokemon.name.toLowerCase().includes(searchLower))
})

// Computed property para los Pokémon paginados Y filtrados
const paginatedAndFilteredPokemons = computed(() => {
  // Con la búsqueda implementada localmente en la página actual,
  // la paginación ya se maneja por la API fetch.
  // Solo aplicamos el filtro sobre la lista actual.
  return filteredPokemons.value
})

// Computed property para calcular el total de páginas
const totalPages = computed(() => {
  // Calculamos las páginas basadas en el TOTAL de Pokémon, no solo los cargados por página
  return Math.ceil(totalPokemonCount.value / itemsPerPage.value)
})

// Función para ir a una página específica
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    currentPage.value = page
    // Vuelve a cargar los Pokémon para la nueva página
    fetchPokemons()
  }
}

// Reinicia paginación al cambiar el término de búsqueda
const resetPaginationAndFilter = () => {
  currentPage.value = 1
  // No es necesario llamar a fetchPokemons aquí porque el filtro se aplica a `pokemons.value`
  // Si la búsqueda fuera a la API, aquí sí lo llamarías.
}

// Reinicia la paginación y recarga la lista al cambiar 'itemsPerPage'
const fetchPokemonsAndUpdatePagination = () => {
  currentPage.value = 1 // Siempre vuelve a la primera página
  fetchPokemons()
}

// Función de utilidad para capitalizar la primera letra
const capitalizeFirstLetter = (string) => {
  if (!string) return ''
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// Observar cambios en currentPage o itemsPerPage para recargar datos
// (ya manejado en goToPage y fetchPokemonsAndUpdatePagination)

// Cargar Pokémons al montar el componente
onMounted(() => {
  fetchPokemons()
})
</script>

<style scoped>
/* Puedes añadir tus estilos específicos aquí */
.card-img-top {
  width: 150px; /* Tamaño fijo para las imágenes de Pokémon */
  height: 150px;
  object-fit: contain;
  margin: 0 auto;
  padding: 10px;
}
.card {
  text-align: center;
}
</style>
