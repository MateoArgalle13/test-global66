import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PokemonListView from '../views/PokemonListView.vue'
import FavoritesView from '../views/FavoritesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/pokemons',
      name: 'Pokemons',
      component: PokemonListView,
      props: true,
    },
    {
      path: '/favorites',
      name: 'Favorites',
      component: FavoritesView,
    },

    // {
    //   path: '/:pathMatch(.*)*',
    //   name: 'NotFound',
    //   component: () => import('../views/NotFoundView.vue'), // Crea esta vista si la necesitas
    // },
  ],
})

export default router
