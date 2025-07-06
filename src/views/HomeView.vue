<template>
  <main class="home-view d-flex flex-column align-items-center justify-content-center text-center">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6">
          <img
            src="../assets/Captura de pantalla 2025-07-06 121920.png"
            alt="Pikachu"
            class="img-fluid pikachu-image mb-4"
          />

          <h1 class="welcome-title fw-bold mb-3">Welcome to Pokédex</h1>

          <p class="welcome-description lead mb-5 mx-auto">
            The digital encyclopedia created by Professor Oak is an invaluable tool to Trainers in
            the Pokémon world.
          </p>

          <button
            @click="goToPokemonList"
            class="get-started-button btn btn-danger btn-lg shadow-sm"
          >
            Get started
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToPokemonList = () => {
  router.push('/pokemons')
}
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  color: #333;
}

.pikachu-image {
  max-width: 350px;
}

.welcome-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: #343a40;
}

.welcome-description {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  max-width: 700px;
  color: #555;
  line-height: 1.6;
}

.get-started-button {
  padding: 7px 23px;
  font-size: 1.2rem;
  border-radius: 30px;
}

@media (max-width: 767.98px) {
  .pikachu-image {
    max-width: 250px;
  }
}
</style>
