<template>
  <div class="pokemon-detail-view">
    <Loader v-if="loading" />
    <div v-else-if="error" class="error-message">
      <p>Error al cargar detalles de Pokémon: {{ error.message }}</p>
      <Button @click="fetchDetails" variant="primary">Reintentar</Button>
    </div>
    <div v-else-if="pokemon" class="pokemon-detail-content">
      <Button @click="$router.back()" variant="secondary" class="back-button">← Volver</Button>
      <h1 class="pokemon-name-detail">{{ pokemon.name }}</h1>
      <img :src="pokemon.sprites?.front_default" :alt="pokemon.name" class="pokemon-detail-image" />

      <div class="pokemon-info-section">
        <h2>Tipos</h2>
        <div class="info-tags">
          <span v-for="typeInfo in pokemon.types" :key="typeInfo.slot" class="tag type-tag">
            {{ typeInfo.type.name }}
          </span>
        </div>
      </div>

      <div class="pokemon-info-section">
        <h2>Habilidades</h2>
        <div class="info-tags">
          <span
            v-for="abilityInfo in pokemon.abilities"
            :key="abilityInfo.ability.name"
            class="tag ability-tag"
          >
            {{ abilityInfo.ability.name }}
          </span>
        </div>
      </div>

      <div class="pokemon-info-section">
        <h2>Estadísticas Base</h2>
        <ul>
          <li v-for="statInfo in pokemon.stats" :key="statInfo.stat.name">
            <strong>{{ statInfo.stat.name }}:</strong> {{ statInfo.base_stat }}
          </li>
        </ul>
      </div>

      <div class="detail-actions">
        <Button
          :variant="isFav ? 'favorite' : 'secondary'"
          @click="toggleFavorite"
          class="action-button"
        >
          {{ isFav ? '❤️ Favorito' : '🤍 Añadir a Favoritos' }}
        </Button>
        <Button variant="share" @click="sharePokemon" class="action-button">
          Compartir Pokémon
        </Button>
        <span v-if="copied" class="copied-message">¡Copiado!</span>
        <span v-if="clipboardError" class="error-message">Error al copiar.</span>
      </div>
    </div>
    <div v-else class="no-pokemon-selected">
      <p>No se encontró información para este Pokémon.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePokemonApi } from '@/composables/usePokemonApi'
import { useFavoritesStore } from '@/stores/favorites'
import { useClipboard } from '@/composables/useClipboard'
import Loader from '@/components/ui/Loader.vue'
import Button from '@/components/ui/Button.vue'

const route = useRoute()
const { data: pokemon, loading, error, getPokemonDetails } = usePokemonApi()
const favoritesStore = useFavoritesStore()
const { copied, error: clipboardError, copyToClipboard } = useClipboard()

const pokemonName = ref(route.params.name)

const fetchDetails = async () => {
  await getPokemonDetails(pokemonName.value)
}

onMounted(() => {
  fetchDetails()
})

// Reactividad a cambios en la ruta (si se navega entre detalles de Pokémon)
watch(
  () => route.params.name,
  (newName) => {
    if (newName) {
      pokemonName.value = newName
      fetchDetails()
    }
  },
)

const isFav = computed(() => {
  return pokemon.value ? favoritesStore.isFavorite(pokemon.value.id) : false
})

const toggleFavorite = () => {
  if (pokemon.value) {
    favoritesStore.toggleFavorite(pokemon.value)
  }
}

const sharePokemon = () => {
  if (pokemon.value) {
    const attributes = [
      `Nombre: ${pokemon.value.name}`,
      `Tipos: ${pokemon.value.types.map((t) => t.type.name).join(', ')}`,
      `Habilidades: ${pokemon.value.abilities.map((a) => a.ability.name).join(', ')}`,
    ].join(', ')
    copyToClipboard(attributes)
  }
}
</script>

<style scoped>
.pokemon-detail-view {
  padding: var(--spacing-md);
}

.back-button {
  margin-bottom: var(--spacing-md);
}

.pokemon-detail-content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: var(--shadow-md);
  padding: var(--spacing-xl);
  text-align: center;
}

.pokemon-name-detail {
  text-transform: capitalize;
  font-size: 2em;
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
}

.pokemon-detail-image {
  width: 150px;
  height: 150px;
  margin-bottom: var(--spacing-xl);
  border: 2px solid var(--color-secondary);
  border-radius: 50%;
  background-color: #f5f5f5;
}

.pokemon-info-section {
  margin-bottom: var(--spacing-xl);
}

.pokemon-info-section h2 {
  font-size: 1.5em;
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
}

.info-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-sm);
}

.tag {
  background-color: #eee;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 4px;
  font-size: 0.9em;
  text-transform: capitalize;
}

.type-tag {
  background-color: #a0c0e0; /* Ejemplo de color para tipo */
}

.ability-tag {
  background-color: #e0d0a0; /* Ejemplo de color para habilidad */
}

ul {
  list-style: none;
  padding: 0;
}

ul li {
  margin-bottom: var(--spacing-xs);
  font-size: 1.1em;
}

.detail-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
}

.action-button {
  flex-grow: 1;
  max-width: 250px;
}

.copied-message {
  color: green;
  font-weight: bold;
  margin-left: var(--spacing-md);
  align-self: center;
}

.error-message {
  color: red;
  margin-left: var(--spacing-md);
  align-self: center;
}

.no-pokemon-selected {
  text-align: center;
  margin-top: var(--spacing-xl);
  font-size: 1.2em;
  color: #555;
}
</style>
