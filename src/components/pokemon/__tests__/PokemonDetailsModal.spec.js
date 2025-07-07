// src/components/pokemon/__tests__/PokemonDetailsModal.spec.js

import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import PokemonDetailsModal from '../PokemonDetailsModal.vue'
import Loader from '@/components/ui/Loader.vue'

// --- Mocks para dependencias externas ---

// 1. Mock de la tienda de favoritos
const mockIsFavorite = vi.fn()
const mockToggleFavorite = vi.fn()

vi.mock('@/stores/favorites', () => ({
  useFavoritesStore: vi.fn(() => ({
    isFavorite: mockIsFavorite,
    toggleFavorite: mockToggleFavorite,
  })),
}))

import { useFavoritesStore } from '@/stores/favorites'

// 2. Mock de Bootstrap Modal (REVISADO NUEVAMENTE)
// Define the mock instance and its methods
const mockModalInstance = {
  show: vi.fn(),
  hide: vi.fn(),
  dispose: vi.fn(),
}

// **CRUCIAL CHANGE:** Mock the entire 'bootstrap' module
// This must be at the top level of the file, before any component imports
vi.mock('bootstrap', async (importOriginal) => {
  // We're importing the original to potentially get other non-Modal exports if needed,
  // but for Modal, we provide our custom mock.
  const actual = await importOriginal() // This imports the actual bootstrap module, but we won't use its Modal.

  class MockModal {
    constructor() {
      // You can spy on the element passed to the constructor if needed
      // console.log("MockModal constructor called with element:", element);
    }
    show() {
      mockModalInstance.show()
    }
    hide() {
      mockModalInstance.hide()
    }
    dispose() {
      mockModalInstance.dispose()
    }
    // Add any other methods your component calls on the modal instance
  }

  return {
    ...actual, // Export other original bootstrap exports if you need them
    Modal: vi.fn((element) => new MockModal(element)), // Provide our mocked Modal class
  }
})

// After mocking the module, now we can import it.
// This import will now receive the mocked version.
import * as bootstrap from 'bootstrap' // Import as namespace to access Modal

// 3. Mock de navigator.clipboard
const mockWriteText = vi.fn()
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: mockWriteText,
  },
  writable: true,
})

// Mockear alert, console.error
const mockAlert = vi.fn()
const mockConsoleError = vi.fn()
vi.stubGlobal('alert', mockAlert)
vi.stubGlobal('console', { error: mockConsoleError })

describe('PokemonDetailsModal', () => {
  let pinia
  const modalId = 'testModal'
  let modalElement

  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()

    mockIsFavorite.mockReturnValue(false)
    mockToggleFavorite.mockReturnValue(undefined)
    mockWriteText.mockResolvedValue(undefined)
    mockAlert.mockClear()
    mockConsoleError.mockClear()

    // Clear mocks for Bootstrap's mock class methods
    vi.mocked(bootstrap.Modal).mockClear() // Clear calls to the MockModal constructor
    mockModalInstance.show.mockClear()
    mockModalInstance.hide.mockClear()
    mockModalInstance.dispose.mockClear()

    pinia = createPinia()
    setActivePinia(pinia)
    useFavoritesStore()

    modalElement = document.createElement('div')
    modalElement.id = modalId
    modalElement.classList.add('modal', 'fade')
    // Add a minimal structure that Bootstrap's querySelector might expect, e.g., for dialogs
    modalElement.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          </div>
      </div>
    `
    document.body.appendChild(modalElement)
  })

  afterEach(() => {
    vi.runAllTimers()
    vi.useRealTimers()

    if (modalElement && document.body.contains(modalElement)) {
      document.body.removeChild(modalElement)
    }
  })

  const mockPokemon = {
    id: 1,
    name: 'bulbasaur',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    weight: 69,
    height: 7,
    types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
  }

  it('should display Loader when selectedPokemon is null or incomplete', () => {
    const wrapper = mount(PokemonDetailsModal, {
      props: { pokemon: null, modalId: modalId },
      global: {
        plugins: [pinia],
        stubs: {
          Loader: true,
        },
      },
    })
    expect(wrapper.findComponent(Loader).exists()).toBe(true)
    expect(wrapper.find('.pokemon-info').exists()).toBe(false)
  })

  it('should display pokemon details when selectedPokemon is provided', async () => {
    const wrapper = mount(PokemonDetailsModal, {
      props: { pokemon: mockPokemon, modalId: modalId },
      global: {
        plugins: [pinia],
        stubs: {
          Loader: true,
        },
      },
    })
    expect(wrapper.findComponent(Loader).exists()).toBe(false)
    expect(wrapper.find('.pokemon-info').exists()).toBe(true)
    expect(wrapper.find('.pokemon-detail-image').attributes('src')).toBe(mockPokemon.imageUrl)
    expect(wrapper.find('.pokemon-detail-image').attributes('alt')).toBe(mockPokemon.name)
    expect(wrapper.text()).toContain('Name: Bulbasaur')
    expect(wrapper.text()).toContain('Weight: 69')
    expect(wrapper.text()).toContain('Height: 7')
    expect(wrapper.text()).toContain('Types: Grass, Poison')
  })

  it('should emit "close" event when close button is clicked', async () => {
    const wrapper = mount(PokemonDetailsModal, {
      props: { pokemon: mockPokemon, modalId: modalId },
      global: { plugins: [pinia] },
    })
    await wrapper.find('.bi-x-circle-fill').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('should call toggleFavorite and update icon when favorite button is clicked', async () => {
    const wrapper = mount(PokemonDetailsModal, {
      props: { pokemon: mockPokemon, modalId: modalId, showFavoriteButton: true },
      global: { plugins: [pinia] },
    })

    expect(wrapper.find('.favorite-button i.bi-star').exists()).toBe(true)
    expect(wrapper.find('.favorite-button i.bi-star-fill').exists()).toBe(false)

    await wrapper.find('.favorite-button').trigger('click')

    expect(mockToggleFavorite).toHaveBeenCalledTimes(1)
    expect(mockToggleFavorite).toHaveBeenCalledWith(mockPokemon)

    mockIsFavorite.mockReturnValue(true)
    await wrapper.setProps({ pokemon: { ...mockPokemon } })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.favorite-button i.bi-star-fill').exists()).toBe(true)
    expect(wrapper.find('.favorite-button i.bi-star').exists()).toBe(false)
  })

  it('should not show favorite button if showFavoriteButton is false', () => {
    const wrapper = mount(PokemonDetailsModal, {
      props: { pokemon: mockPokemon, modalId: modalId, showFavoriteButton: false },
      global: { plugins: [pinia] },
    })
    expect(wrapper.find('.favorite-button').exists()).toBe(false)
  })

  // Test 6: Muestra el modal al llamar a showModal
  it('should call bootstrap modal show method when showModal is called', async () => {
    const wrapper = mount(PokemonDetailsModal, {
      props: { pokemon: mockPokemon, modalId: modalId },
      global: { plugins: [pinia] },
    })

    await wrapper.vm.showModal()

    expect(bootstrap.Modal).toHaveBeenCalledTimes(1)
    expect(bootstrap.Modal).toHaveBeenCalledWith(modalElement)
    expect(mockModalInstance.show).toHaveBeenCalledTimes(1)
  })

  // Test 7: Oculta el modal al llamar a hideModal
  it('should call bootstrap modal hide method when hideModal is called', async () => {
    const wrapper = mount(PokemonDetailsModal, {
      props: { pokemon: mockPokemon, modalId: modalId },
      global: { plugins: [pinia] },
    })

    await wrapper.vm.showModal()
    expect(mockModalInstance.show).toHaveBeenCalledTimes(1)

    await wrapper.vm.hideModal()

    expect(mockModalInstance.hide).toHaveBeenCalledTimes(1)
  })

  it('should copy pokemon details to clipboard and show success alert', async () => {
    const wrapper = mount(PokemonDetailsModal, {
      props: { pokemon: mockPokemon, modalId: modalId },
      global: { plugins: [pinia] },
    })

    await wrapper.find('.btn-danger').trigger('click')

    expect(mockWriteText).toHaveBeenCalledTimes(1)
    expect(mockWriteText).toHaveBeenCalledWith(expect.stringContaining('Name: Bulbasaur'))
    expect(mockWriteText).toHaveBeenCalledWith(expect.stringContaining('Weight: 69'))
    expect(mockWriteText).toHaveBeenCalledWith(expect.stringContaining('Height: 7'))
    expect(mockWriteText).toHaveBeenCalledWith(expect.stringContaining('Types: Grass, Poison'))

    expect(mockAlert).toHaveBeenCalledTimes(1)
    expect(mockAlert).toHaveBeenCalledWith('Detalles del Pokémon copiados al portapapeles!')
  })

  it('should handle clipboard write error and show error alert', async () => {
    mockWriteText.mockRejectedValueOnce(new Error('Copy failed'))

    const wrapper = mount(PokemonDetailsModal, {
      props: { pokemon: mockPokemon, modalId: modalId },
      global: { plugins: [pinia] },
    })

    await wrapper.find('.btn-danger').trigger('click')

    expect(mockWriteText).toHaveBeenCalledTimes(1)
    expect(mockConsoleError).toHaveBeenCalledTimes(1)
    expect(mockAlert).toHaveBeenCalledTimes(1)
    expect(mockAlert).toHaveBeenCalledWith(
      'No se pudieron copiar los detalles. Por favor, inténtalo manualmente.',
    )
  })
})
