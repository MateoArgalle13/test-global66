<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <nav class="navbar navbar-light">
            <div class="container-fluid">
              <RouterLink to="/" class="nav-brand">
                <img
                  src="/src/assets/logo-66-blue.svg"
                  alt="Logo página"
                  height="40"
                  class="d-inline-block align-text-top"
                />
              </RouterLink>
              Prueba Desarrollador Front-End Vuejs
            </div>
          </nav>
        </div>
      </div>
    </div>
  </header>
  <main>
    <RouterView />
  </main>
  <footer class="blue-bg">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div
            class="flex flex-col justify-between space-y-5 py-8 text-center lg:flex-row lg:space-y-0 lg:text-left"
          >
            <div
              class="flex flex-col items-center space-x-0 space-y-4 text-center lg:flex-row lg:space-x-6 lg:space-y-0 lg:text-left"
            >
              <img
                src="./assets/logo-66.svg"
                width="200"
                height="200"
                alt="logo"
                loading="lazy"
                class="w-12"
              />
              <p class="text-title-03 font-bold">Fácil, rápido y económico</p>
            </div>
            <div>
              <a
                type="button"
                theme="personas"
                size="medium"
                inverted="true"
                aspect="button"
                componentis="a"
                href="https://transferencias.global66.com/signUp?utm_element=footer_cta_b2c-button"
                target="_blank"
                class="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap border-2 text-center text-paragraph-01 font-semibold text-b2c-blue-dark bg-white hover:bg-b2c-blue-25 border-white hover:border-b2c-blue-25 py-4 px-8 md:py-5 md:px-8 rounded-full font-semibold"
                ><!---->
                Descarga la App
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
header {
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.05);
}
.blue-bg {
  background: rgb(31 73 182);
}
</style>
