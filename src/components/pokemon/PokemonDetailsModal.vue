<template>
  <div
    class="modal fade"
    :id="modalId"
    tabindex="-1"
    aria-labelledby="pokemonDetailsModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div
          v-if="!selectedPokemon || !selectedPokemon.id"
          class="d-flex justify-content-center my-5"
        >
          <Loader />
        </div>
        <div v-else>
          <div class="pokemon-image-container">
            <button
              type="button"
              class="bi-x-circle-fill"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="emit('close')"
            ></button>
            <img
              :src="selectedPokemon.imageUrl"
              :alt="selectedPokemon.name"
              class="pokemon-detail-image"
            />
          </div>
          <div class="modal-body">
            <div class="pokemon-info">
              <div class="info-item">
                <strong>Name:</strong> {{ capitalizeFirstLetter(selectedPokemon.name) }}
              </div>
              <div class="info-item"><strong>Weight:</strong> {{ selectedPokemon.weight }}</div>
              <div class="info-item"><strong>Height:</strong> {{ selectedPokemon.height }}</div>
              <div class="info-item">
                <strong>Types:</strong> {{ formatTypes(selectedPokemon.types) }}
              </div>
            </div>
            <div class="modal-actions d-flex justify-content-between align-items-center mt-3">
              <button class="btn btn-danger rounded-pill" @click="sharePokemonDetails">
                Share to my friends
              </button>
              <button
                v-if="showFavoriteButton"
                class="btn btn-warning rounded-circle favorite-button"
                @click="toggleFavorite"
              >
                <i
                  class="bi"
                  :class="
                    favoritesStore.isFavorite(selectedPokemon.id) ? 'bi-star-fill' : 'bi-star'
                  "
                ></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useFavoritesStore } from '@/stores/favorites'
import Loader from '@/components/ui/Loader.vue'
import { Modal } from 'bootstrap'

const props = defineProps({
  pokemon: {
    type: Object,
    default: null,
  },
  modalId: {
    type: String,
    required: true,
  },
  showFavoriteButton: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['close'])

const favoritesStore = useFavoritesStore()

const selectedPokemon = ref(props.pokemon)
const pokemonModalInstance = ref(null)

watch(
  () => props.pokemon,
  (newPokemon) => {
    selectedPokemon.value = newPokemon
  },
)

const capitalizeFirstLetter = (string) => {
  if (!string) return ''
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const formatTypes = (types) => {
  if (!types || types.length === 0) return 'N/A'
  return types.map((typeInfo) => capitalizeFirstLetter(typeInfo.type.name)).join(', ')
}

const sharePokemonDetails = async () => {
  if (!selectedPokemon.value) return

  const details = [
    `Name: ${capitalizeFirstLetter(selectedPokemon.value.name)}`,
    `Weight: ${selectedPokemon.value.weight}`,
    `Height: ${selectedPokemon.value.height}`,
    `Types: ${formatTypes(selectedPokemon.value.types)}`,
  ].join(', ')

  try {
    await navigator.clipboard.writeText(details)
    alert('Detalles del Pokémon copiados al portapapeles!')
  } catch (err) {
    console.error('Error al copiar al portapapeles:', err)
    alert('No se pudieron copiar los detalles. Por favor, inténtalo manualmente.')
  }
}

const toggleFavorite = () => {
  if (selectedPokemon.value) {
    favoritesStore.toggleFavorite(selectedPokemon.value)
  }
}

const showModal = () => {
  if (!pokemonModalInstance.value) {
    const modalElement = document.getElementById(props.modalId)
    if (modalElement) {
      pokemonModalInstance.value = new Modal(modalElement)
      modalElement.addEventListener('hidden.bs.modal', handleBootstrapModalClose)
    }
  }
  pokemonModalInstance.value?.show()
}

const hideModal = () => {
  pokemonModalInstance.value?.hide()
}

const handleBootstrapModalClose = () => {
  emit('close')
}

defineExpose({
  showModal,
  hideModal,
})
</script>

<style scoped>
.modal-content {
  border-radius: 1rem;
  overflow: hidden;
  border: none;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.modal-header {
  border-bottom: none;
  padding: 1rem 1.5rem;
}

.modal-title {
  font-weight: bold;
  color: #343a40;
}

.btn-close {
  opacity: 0.7;
}

.pokemon-image-container {
  width: 100%;
  background-color: #e0f2f7;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  background-image: url('/src/assets/Mask\ Group.jpg');
  background-size: cover;
  position: relative;
}

.pokemon-detail-image {
  max-width: 100%;
  height: auto;
  object-fit: contain;
  max-height: 200px;
}

.modal-body {
  padding: 1.5rem;
  color: #495057;
}

.pokemon-info {
  margin-bottom: 1rem;
}

.info-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f8f9fa;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item strong {
  color: #212529;
  margin-right: 0.5rem;
}

.modal-actions {
  padding-top: 1rem;
  border-top: 1px solid #f8f9fa;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-danger:hover {
  background-color: #c82333;
  border-color: #bd2130;
}

.favorite-button {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  font-size: 1.2rem;
  color: #ffc107;
  background-color: #f8f9fa;
  border: 0;
}

.favorite-button:hover {
  background-color: #ffeeba;
  border-color: #ffc107;
}

.favorite-button .bi-star-fill {
  color: #ffc107;
}
.bi-x-circle-fill {
  color: #ffff;
  background: 0;
  border: 0;
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 21px;
}
</style>
