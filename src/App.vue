<script setup>
import { RouterView } from 'vue-router'
import BottomNavigation from './components/ui/BottomNavigation.vue'
</script>

<template>
  <main class="pb-5">
    <RouterView />
  </main>
  <footer>
    <BottomNavigation v-if="$route.name === 'Pokemons' || $route.name === 'Favorites'" />
  </footer>
</template>

<style scoped>
.pb-5 {
  background-color: #f8f8f8;
}
</style>
