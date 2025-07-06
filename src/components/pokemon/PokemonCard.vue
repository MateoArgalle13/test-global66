<template>
  <div
    class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
  >
    <span class="pokemon-name" @click="emit('card-click', pokemon)">
      {{ capitalizeFirstLetter(pokemon.name) }}
    </span>
    <span class="favorite-icon" @click="emit('toggle-favorite', pokemon)">
      <i class="bi" :class="favoriteIconClass"></i>
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFavoritesStore } from '@/stores/favorites'

const props = defineProps({
  pokemon: {
    type: Object,
    required: true,
  },
  isFavoriteView: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['card-click', 'toggle-favorite'])

const favoritesStore = useFavoritesStore()

const capitalizeFirstLetter = (string) => {
  if (!string) return ''
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const favoriteIconClass = computed(() => {
  if (props.isFavoriteView) {
    return 'bi-x-circle-fill text-danger'
  } else {
    return favoritesStore.isFavorite(props.pokemon.id)
      ? 'bi-star-fill text-warning'
      : 'bi-star text-muted'
  }
})
</script>

<style scoped>
.list-group-item {
  border: 1px solid #e9ecef;
  border-radius: 0.375rem;
  margin-bottom: 8px;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}
.list-group-item:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.pokemon-name {
  flex-grow: 1;
  font-size: 1.1rem;
  font-weight: 500;
  color: #343a40;
}
.pokemon-name:hover {
  color: #0d6efd;
}

.favorite-icon {
  font-size: 1.4rem;
  cursor: pointer;
  padding: 5px;
  background: #f9f9f9;
  height: 44px;
  width: 44px;
  text-align: center;
  border-radius: 50%;
}
</style>
