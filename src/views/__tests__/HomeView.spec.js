import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeView from '@/views/HomeView.vue'

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('HomeView.vue', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('renders correctly with all elements', () => {
    const wrapper = mount(HomeView)

    // Verificar que el componente existe
    expect(wrapper.exists()).toBe(true)

    // Verificar la imagen de Pikachu
    const pikachuImage = wrapper.find('.pikachu-image')
    expect(pikachuImage.exists()).toBe(true)
    expect(pikachuImage.attributes('alt')).toBe('Pikachu')

    const welcomeTitle = wrapper.find('.welcome-title')
    expect(welcomeTitle.exists()).toBe(true)
    expect(welcomeTitle.text()).toBe('Welcome to Pokédex')

    const welcomeDescription = wrapper.find('.welcome-description')
    expect(welcomeDescription.exists()).toBe(true)
    expect(welcomeDescription.text()).toContain('The digital encyclopedia created by Professor Oak')

    const getStartedButton = wrapper.find('.get-started-button')
    expect(getStartedButton.exists()).toBe(true)
    expect(getStartedButton.text()).toBe('Get started')
  })

  it('navigates to /pokemons when "Get started" button is clicked', async () => {
    const wrapper = mount(HomeView)

    const getStartedButton = wrapper.find('.get-started-button')
    expect(getStartedButton.exists()).toBe(true)

    await getStartedButton.trigger('click')

    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledWith('/pokemons')
  })
})
