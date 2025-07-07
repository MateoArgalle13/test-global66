import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import PokemonListView from '@/views/PokemonListView.vue'
import * as pokeapi from '@/services/pokeapi'
import { useFavoritesStore } from '@/stores/favorites'

const allMockPokemons = Array.from({ length: 30 }).map((_, i) => ({
  name: `pokemon-${i + 1}`,
  url: `https://pokeapi.co/api/v2/pokemon/${i + 1}/`,
}))

vi.mock('@/services/pokeapi', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    fetchPokemonList: vi.fn((offset = 0, limit = 10) => {
      return Promise.resolve({
        count: allMockPokemons.length,
        results: allMockPokemons.slice(offset, offset + limit),
      })
    }),
    fetchPokemonDetails: vi.fn((pokemon) =>
      Promise.resolve({
        name: pokemon.name,
        sprites: {},
        id: 1,
        weight: 100,
        height: 10,
        types: [{ type: { name: 'grass' } }],
      }),
    ),
  }
})

const testingPiniaOptions = {
  createSpy: vi.fn,
  stubActions: false,
  fakeApp: true,
}

describe('PokemonListView.vue', () => {
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createWrapper = () => {
    return mount(PokemonListView, {
      global: {
        plugins: [createTestingPinia(testingPiniaOptions)],
        stubs: {
          PokemonCard: {
            props: ['pokemon', 'isFavorite'],
            template: `
              <div class="mock-pokemon-card"
                   :data-name="pokemon.name"
                   @click="$emit('card-click', pokemon)"
                   @dblclick="$emit('toggle-favorite', pokemon)">
                {{ pokemon.name }} - Favorite: {{ isFavorite }}
              </div>
            `,
          },
          PokemonDetailsModal: {
            props: ['pokemon', 'modalId'],
            emits: ['close'],
            template: `<div class="mock-modal">Details for {{ pokemon?.name }}</div>`,
          },
        },
      },
    })
  }

  it('renders without errors', () => {
    wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('filters pokemons based on search term', async () => {
    wrapper = createWrapper()
    await vi.waitFor(() => wrapper.vm.allPokemons.length > 0)
    wrapper.vm.allPokemons = [
      { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    ]
    wrapper.vm.searchTerm = 'pika'
    await wrapper.vm.$nextTick()

    const filtered = wrapper.vm.filteredPokemons
    expect(filtered.length).toBe(1)
    expect(filtered[0].name).toBe('pikachu')
  })

  it('handles error during fetchPokemons', async () => {
    pokeapi.fetchPokemonList.mockRejectedValueOnce(new Error('Network Error'))
    wrapper = createWrapper()
    await vi.waitFor(() => expect(wrapper.vm.errorMessage).toBeTruthy())
    expect(wrapper.text()).toContain('Hubo un error al cargar los Pokémons.')
  })

  it('calls fetchPokemonList on mount and renders cards after loading', async () => {
    wrapper = createWrapper()
    await vi.waitFor(() => wrapper.vm.allPokemons.length === 10)
    await vi.waitFor(() => wrapper.findAll('.mock-pokemon-card').length === 10)
    expect(wrapper.vm.allPokemons.length).toBe(10)
    expect(wrapper.findAll('.mock-pokemon-card').length).toBe(10)
  })

  it('shows "No se encontraron Pokémons" if search yields nothing', async () => {
    wrapper = createWrapper()
    wrapper.vm.allPokemons = [{ name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' }]
    wrapper.vm.searchTerm = 'notapokemon'
    wrapper.vm.isLoading = false
    wrapper.vm.errorMessage = null
    await wrapper.vm.$nextTick()

    const noResultsMessage = wrapper.find('.list-group-item.text-center.text-muted')
    expect(noResultsMessage.exists()).toBe(true)
    expect(noResultsMessage.text()).toContain('No se encontraron Pokémons')
    expect(wrapper.find('button.go-back-home').exists()).toBe(true)
  })

  it('clears search and reloads when clicking "Go Back Home"', async () => {
    wrapper = createWrapper()
    wrapper.vm.searchTerm = 'test'
    await wrapper.vm.$nextTick()
    await wrapper.vm.goBackHomeAndClearSearch()
    await vi.waitFor(() => expect(wrapper.vm.allPokemons.length).toBe(10))
    expect(wrapper.vm.searchTerm).toBe('')
  })

  it('toggles favorite from PokemonCard event', async () => {
    const toggleSpy = vi.fn()
    wrapper = mount(PokemonListView, {
      global: {
        plugins: [
          createTestingPinia({
            ...testingPiniaOptions,
            stubActions: false,
            initialState: { favorites: {} },
            createSpy: () => toggleSpy,
          }),
        ],
        stubs: {
          PokemonCard: {
            props: ['pokemon', 'isFavorite'],
            template: `<div class="mock-pokemon-card" @dblclick="$emit('toggle-favorite', pokemon)">Mock</div>`,
          },
        },
      },
    })
    const store = useFavoritesStore()
    store.toggleFavorite({ name: 'pokemon-x' })
    expect(toggleSpy).toHaveBeenCalled()
  })

  it('updates pokemons per page and paginates correctly', async () => {
    wrapper = createWrapper()
    await vi.waitFor(() => wrapper.vm.allPokemons.length > 0)

    await vi.waitFor(() => wrapper.find('select#itemsPerPage').exists())
    const select = wrapper.find('select#itemsPerPage')
    select.element.value = '20'
    await select.trigger('change')

    await vi.waitFor(() => wrapper.vm.itemsPerPage === 20)
    expect(wrapper.vm.totalPages).toBeGreaterThan(1)
  })

  it('disables previous button on first page and next on last', async () => {
    wrapper = createWrapper()
    await vi.waitFor(() => wrapper.vm.totalPages > 1)

    wrapper.vm.currentPage = 1
    await wrapper.vm.$nextTick()
    const prevBtn = wrapper.find('.pagination .page-item:first-child')
    expect(prevBtn.exists()).toBe(true)
    expect(prevBtn.classes()).toContain('disabled')

    wrapper.vm.currentPage = wrapper.vm.totalPages
    await wrapper.vm.$nextTick()
    const nextBtn = wrapper.find('.pagination .page-item:last-child')
    expect(nextBtn.exists()).toBe(true)
    expect(nextBtn.classes()).toContain('disabled')
  })
})
