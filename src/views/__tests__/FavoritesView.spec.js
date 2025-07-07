import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import FavoritesView from '@/views/FavoritesView.vue'

import { useFavoritesStore } from '@/stores/favorites'
import * as pokeapi from '@/services/pokeapi'

vi.mock('@/services/pokeapi', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    fetchPokemonDetails: vi.fn((pokemonName) => {
      return Promise.resolve({
        name: pokemonName,
        id: 100,
        height: 10,
        weight: 100,
        types: [{ type: { name: 'fire' } }],
        sprites: {
          front_default: `mock-${pokemonName}-front.png`,
          other: {
            'official-artwork': {
              front_default: `mock-${pokemonName}-official.png`,
            },
          },
        },
        imageUrl: `mock-${pokemonName}-official.png`,
      })
    }),
  }
})

describe('FavoritesView.vue', () => {
  let wrapper
  let favoritesStore
  const showModalSpy = vi.fn()
  const hideModalSpy = vi.fn()

  const mockFavorites = [
    { id: 1, name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/', id: 1 },
    { id: 4, name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/', id: 4 },
    { id: 7, name: 'squirtle', url: 'https://pokeapi.co/api/v2/pokemon/7/', id: 7 },
    { id: 25, name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/', id: 25 },
  ]

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(FavoritesView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
            fakeApp: true,
            initialState: {
              favorites: {
                favorites: [],
              },
            },
          }),
        ],
        stubs: {
          PokemonCard: {
            props: ['pokemon', 'isFavoriteView'],
            template: `
              <div class="mock-pokemon-card"
                   :data-id="pokemon.id"
                   :data-name="pokemon.name"
                   @click="$emit('card-click', pokemon)"
                   @toggle-favorite="$emit('toggle-favorite', pokemon)">
                {{ pokemon.name }} (Favorite View: {{ isFavoriteView }})
              </div>
            `,
          },
          PokemonDetailsModal: {
            props: ['pokemon', 'modalId', 'showFavoriteButton'],
            emits: ['close'],
            methods: {
              showModal: showModalSpy,
              hideModal: hideModalSpy,
            },
            template: `<div class="mock-modal">Modal for {{ pokemon?.name }}</div>`,
          },
        },
      },
    })

    favoritesStore = useFavoritesStore()
  })

  it('renders correctly and shows no favorites message if store is empty', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.alert-info').exists()).toBe(true)
    expect(wrapper.find('.alert-info').text()).toContain('Aún no tienes Pokémons favoritos.')
    expect(wrapper.findAll('.mock-pokemon-card').length).toBe(0)
  })

  it('displays favorite pokemons from the store', async () => {
    favoritesStore.favorites = [...mockFavorites]
    await wrapper.vm.$nextTick()
    await vi.waitFor(() => wrapper.findAll('.mock-pokemon-card').length === mockFavorites.length, {
      timeout: 1000,
    })

    expect(wrapper.findAll('.mock-pokemon-card').length).toBe(mockFavorites.length)
    expect(wrapper.find('[data-name="bulbasaur"]').exists()).toBe(true)
    expect(wrapper.find('[data-name="charmander"]').exists()).toBe(true)
    expect(wrapper.find('[data-name="pikachu"]').exists()).toBe(true)
    expect(wrapper.find('.alert-info').exists()).toBe(false)
  })

  it('filters favorites based on search query', async () => {
    favoritesStore.favorites = [...mockFavorites]
    await wrapper.vm.$nextTick()
    await vi.waitFor(() => wrapper.findAll('.mock-pokemon-card').length === mockFavorites.length, {
      timeout: 1000,
    })

    const searchInput = wrapper.find('input[type="text"]')
    await searchInput.setValue('char')
    await searchInput.trigger('input')

    await wrapper.vm.$nextTick()
    await vi.waitFor(() => wrapper.findAll('.mock-pokemon-card').length === 1, { timeout: 1000 })

    expect(wrapper.findAll('.mock-pokemon-card').length).toBe(1)
    expect(wrapper.find('[data-name="charmander"]').exists()).toBe(true)
    expect(wrapper.find('.alert-warning').exists()).toBe(false)
  })

  it('shows no match message if search yields no results', async () => {
    favoritesStore.favorites = [...mockFavorites]
    await wrapper.vm.$nextTick()
    await vi.waitFor(() => wrapper.findAll('.mock-pokemon-card').length === mockFavorites.length, {
      timeout: 1000,
    })

    const searchInput = wrapper.find('input[type="text"]')
    await searchInput.setValue('nonexistent')
    await searchInput.trigger('input')

    await wrapper.vm.$nextTick()
    await vi.waitFor(() => wrapper.findAll('.mock-pokemon-card').length === 0, { timeout: 1000 })

    expect(wrapper.findAll('.mock-pokemon-card').length).toBe(0)
    expect(wrapper.find('.alert-warning').exists()).toBe(true)
    expect(wrapper.find('.alert-warning').text()).toContain(
      'No Pokémons favoritos encontrados que coincidan con tu búsqueda.',
    )
  })

  it('opens PokemonDetailsModal on card click', async () => {
    favoritesStore.favorites = [
      { id: 1, name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/', id: 1 },
    ]
    await wrapper.vm.$nextTick()
    await vi.waitFor(() => wrapper.find('[data-name="bulbasaur"]').exists(), { timeout: 1000 })

    const pokemonCard = wrapper.find('[data-name="bulbasaur"]')
    await pokemonCard.trigger('click')
    console.log('DEBUG: Tipo de showModalSpy en "opens PokemonDetailsModal":', typeof showModalSpy)
    console.log(
      'DEBUG: ¿Es showModalSpy una función mock de Vitest?',
      vi.isMockFunction(showModalSpy),
    )

    await vi.waitFor(
      () => {
        expect(pokeapi.fetchPokemonDetails).toHaveBeenCalledTimes(1)
        expect(pokeapi.fetchPokemonDetails).toHaveBeenCalledWith('bulbasaur')
        expect(wrapper.vm.selectedPokemon).toBeTruthy()
        expect(wrapper.vm.selectedPokemon.name).toBe('bulbasaur')
        expect(showModalSpy).toHaveBeenCalledTimes(1)
      },
      { timeout: 2000 },
    )
  })

  it('handles error when fetching pokemon details for modal', async () => {
    pokeapi.fetchPokemonDetails.mockRejectedValueOnce(new Error('Failed to fetch details'))
    favoritesStore.favorites = [
      { id: 1, name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/', id: 1 },
    ]
    await wrapper.vm.$nextTick()
    await vi.waitFor(() => wrapper.find('[data-name="bulbasaur"]').exists(), { timeout: 1000 })

    const pokemonCard = wrapper.find('[data-name="bulbasaur"]')
    await pokemonCard.trigger('click')
    console.log('DEBUG: Tipo de hideModalSpy en "handles error":', typeof hideModalSpy)
    console.log(
      'DEBUG: ¿Es hideModalSpy una función mock de Vitest?',
      vi.isMockFunction(hideModalSpy),
    )

    await vi.waitFor(
      () => {
        expect(pokeapi.fetchPokemonDetails).toHaveBeenCalledTimes(1)
        expect(hideModalSpy).toHaveBeenCalledTimes(1)
        expect(wrapper.vm.selectedPokemon).toBe(null)
      },
      { timeout: 2000 },
    )
  })
})
