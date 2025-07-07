import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia' // Pinia es necesaria para el entorno de Vue Test Utils
import PokemonCard from '../PokemonCard.vue'

// --- MOCK DE LA TIENDA DE FAVORITOS A NIVEL DE MÓDULO ---
// Aseguramos que CUALQUIER importación de '@/stores/favorites' en este test suite
// (incluyendo la que hace el componente) obtenga ESTE mock.
// Creamos objetos mock para los métodos y getters del store.
const mockIsFavorite = vi.fn()
const mockToggleFavorite = vi.fn()
const mockFavoritesState = {} // Mock del estado 'favorites' si es que se accede directamente.

vi.mock('@/stores/favorites', () => ({
  // La función useFavoritesStore es la que se importa y se llama en el componente.
  // La mockeamos para que devuelva un objeto plano y controlado.
  useFavoritesStore: vi.fn(() => ({
    isFavorite: mockIsFavorite, // Aquí asignamos directamente nuestro mock de función
    toggleFavorite: mockToggleFavorite, // Aquí asignamos directamente nuestro mock de función
    favorites: mockFavoritesState, // Y nuestro mock de estado
    // Si tu store tiene otras propiedades o getters, añádelos aquí y modifícalos con mocks
  })),
}))

// Importa useFavoritesStore DESPUÉS de haberla mockeado.
// Esto garantiza que 'useFavoritesStore' en este archivo (y en el componente)
// apunte a la versión mockeada que acabamos de definir arriba.
import { useFavoritesStore } from '@/stores/favorites'

describe('PokemonCard', () => {
  let pinia
  // Esta variable 'favoritesStore' ahora se referirá a la instancia del mock devuelta por useFavoritesStore

  // `beforeEach` se ejecuta antes de cada test individual (`it`)
  beforeEach(() => {
    // 1. Limpia todos los mocks ANTES de cada test.
    // Es crucial limpiar los mocks específicos (`mockIsFavorite`, `mockToggleFavorite`)
    // para que su estado (llamadas, retornos) se resetee para cada prueba.
    mockIsFavorite.mockClear()
    mockToggleFavorite.mockClear()

    // Resetea el comportamiento por defecto de los mocks para cada test.
    mockIsFavorite.mockReturnValue(false) // Por defecto, ningún Pokémon es favorito
    mockToggleFavorite.mockReturnValue(undefined) // O el valor que esperes que devuelva

    // 2. Crea y activa una nueva instancia de Pinia para cada test.
    // Aunque usamos mocks, Pinia necesita ser inicializado para que Vue Test Utils
    // pueda montar componentes que usen Pinia.
    pinia = createPinia()
    setActivePinia(pinia)

    // 3. Obtiene la instancia mockeada de la tienda.
    // Esta llamada ahora devolverá el objeto plano y mockeado que definimos en `vi.mock`.
    useFavoritesStore()
  })

  // Test 1: Comprueba que el nombre del Pokémon se renderiza correctamente
  it('should render pokemon name correctly', () => {
    const pokemon = {
      id: 1,
      name: 'bulbasaur',
    }

    const wrapper = mount(PokemonCard, {
      props: { pokemon, isFavoriteView: false },
      global: {
        plugins: [pinia], // Asegura que Pinia (aunque mockeada) esté disponible
      },
    })

    expect(wrapper.find('.pokemon-name').text()).toBe('Bulbasaur')
  })

  // Test 2: Comprueba que el icono de favorito se muestra correctamente según el estado
  it('should display favorite icon correctly based on isFavorite status', async () => {
    const pokemon = { id: 1, name: 'bulbasaur' }

    // --- Caso 1: El Pokémon NO es favorito ---
    // `mockIsFavorite` ya está configurado para devolver `false` por defecto en el `beforeEach`.
    const wrapper1 = mount(PokemonCard, {
      props: { pokemon, isFavoriteView: false },
      global: { plugins: [pinia] },
    })
    // Verifica que `isFavorite` fue llamada con el ID correcto
    expect(mockIsFavorite).toHaveBeenCalledWith(pokemon.id)
    expect(wrapper1.find('.favorite-icon i.bi-star').exists()).toBe(true)
    expect(wrapper1.find('.favorite-icon i.bi-star-fill').exists()).toBe(false)

    // --- Caso 2: El Pokémon SÍ es favorito ---
    // Configura el mock para que `isFavorite` devuelva `true` SÓLO para este caso.
    mockIsFavorite.mockReturnValue(true)

    // **IMPORTANTE**: Volvemos a montar el componente.
    // Esto es crucial porque el `computed` `favoriteIconClass` se calculará
    // de nuevo al inicializarse el componente, y en ese momento leerá el nuevo
    // comportamiento mockeado de `isFavorite`.
    const wrapper2 = mount(PokemonCard, {
      props: { pokemon, isFavoriteView: false },
      global: { plugins: [pinia] },
    })
    await wrapper2.vm.$nextTick() // Espera que Vue actualice el DOM

    expect(mockIsFavorite).toHaveBeenCalledWith(pokemon.id) // Vuelve a verificar la llamada
    expect(wrapper2.find('.favorite-icon i.bi-star-fill').exists()).toBe(true)
    expect(wrapper2.find('.favorite-icon i.bi-star').exists()).toBe(false)
  })

  // Test 3: Comprueba que el evento `card-click` se emite al hacer clic en el nombre del Pokémon
  it('should emit "card-click" event when the pokemon name is clicked', async () => {
    const pokemon = { id: 1, name: 'bulbasaur' }
    const wrapper = mount(PokemonCard, {
      props: { pokemon, isFavoriteView: false },
      global: { plugins: [pinia] },
    })

    await wrapper.find('.pokemon-name').trigger('click')

    expect(wrapper.emitted('card-click')).toBeTruthy()
    expect(wrapper.emitted('card-click')[0][0]).toEqual(pokemon)
  })

  // Test 4: Comprueba que el evento `toggle-favorite` se emite al hacer clic en el icono de favorito
  it('should emit "toggle-favorite" event when favorite icon is clicked', async () => {
    const pokemon = { id: 1, name: 'bulbasaur' }
    const wrapper = mount(PokemonCard, {
      props: { pokemon, isFavoriteView: false },
      global: { plugins: [pinia] },
    })

    await wrapper.find('.favorite-icon').trigger('click')

    expect(wrapper.emitted('toggle-favorite')).toBeTruthy()
    expect(wrapper.emitted('toggle-favorite')[0][0]).toEqual(pokemon)
  })

  // Test 5: Comprueba que en modo isFavoriteView, el icono es una X roja (para eliminar de favoritos)
  it('should show red X icon in isFavoriteView mode', async () => {
    const pokemon = { id: 1, name: 'bulbasaur' }
    const wrapper = mount(PokemonCard, {
      props: { pokemon, isFavoriteView: true }, // `isFavoriteView` en true
      global: { plugins: [pinia] },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.favorite-icon i.bi-x-circle-fill').exists()).toBe(true)
    expect(wrapper.find('.favorite-icon i.bi-x-circle-fill').classes()).toContain('text-danger')
    expect(wrapper.find('.favorite-icon i.bi-star').exists()).toBe(false)
    expect(wrapper.find('.favorite-icon i.bi-star-fill').exists()).toBe(false)
  })
})
