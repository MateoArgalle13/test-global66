<template>
  <nav class="bottom-navigation-bar">
    <div class="container-fluid h-100 px-3">
      <div class="d-flex justify-content-around align-items-center h-100">
        <router-link
          to="/pokemons"
          class="btn nav-button d-flex align-items-center justify-content-center"
          :class="{ 'active-nav-button': $route.path === '/pokemons' }"
        >
          <i class="bi bi-list-ul nav-icon me-2"></i> <span class="nav-text">All</span>
        </router-link>

        <router-link
          to="/favorites"
          class="btn nav-button d-flex align-items-center justify-content-center"
          :class="{ 'active-nav-button': $route.path === '/favorites' }"
        >
          <i class="bi bi-star-fill nav-icon me-2"></i> <span class="nav-text">Favorites</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.bottom-navigation-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 65px;
  background-color: white;
  border-top: 1px solid #e0e0e0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.container-fluid {
  max-width: 960px;
}

.nav-button {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0;
  max-width: 275px;
  height: 44px;
  border-radius: 9999px;
  font-weight: bold;
  font-size: 0.9rem;
  color: #6c757d;
  background-color: #e9ecef;
  border: none;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  outline: none;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-button:hover:not(.active-nav-button) {
  background-color: #d8dbe0;
  color: #5a6268;
}

.nav-button.active-nav-button {
  background-color: #dc3545;
  color: white;
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
}

.nav-icon {
  font-size: 1.2rem;
}

.nav-text {
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Media queries para ajustar el tamaño en pantallas más pequeñas (responsive) */
@media (max-width: 768px) {
  .nav-button {
    max-width: none;
    font-size: 0.85rem;
    height: 44px;
    padding: 0 0.75rem;
  }
  .nav-icon {
    font-size: 1.1rem;
  }
  .nav-text {
    font-size: 0.8rem;
  }
}

@media (max-width: 576px) {
  .nav-button {
    height: 44px;
    font-size: 0.75rem;
    padding: 0 0.5rem;
    max-width: 150px;
  }
  .nav-icon {
    font-size: 1rem;
  }
  .nav-text {
    font-size: 0.7rem;
  }
}
</style>
