import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { reactive } from 'vue'
import BottomNavigation from '../BottomNavigation.vue'

const mockRoute = reactive({
  path: '/',
})

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}))

describe('BottomNavigation', () => {
  beforeEach(() => {
    mockRoute.path = '/'
  })

  const mountComponent = () =>
    mount(BottomNavigation, {
      global: {
        stubs: {
          RouterLink: {
            name: 'RouterLink',
            props: ['to'],
            template: '<a :href="to"><slot /></a>',
          },
        },

        mocks: {
          $route: mockRoute,
          $router: {
            push: vi.fn(),
          },
        },
      },
    })

  it('renders both navigation links', () => {
    const wrapper = mountComponent()

    const navButtons = wrapper.findAll('.nav-button')
    expect(navButtons.length).toBe(2)

    const allLink = navButtons[0]
    expect(allLink.attributes('href')).toBe('/pokemons')
    expect(allLink.text()).toContain('All')
    expect(allLink.find('i.bi-list-ul').exists()).toBe(true)

    const favoritesLink = navButtons[1]
    expect(favoritesLink.attributes('href')).toBe('/favorites')
    expect(favoritesLink.text()).toContain('Favorites')
    expect(favoritesLink.find('i.bi-star-fill').exists()).toBe(true)
  })

  it('applies active class to "All" link when path is /pokemons', async () => {
    mockRoute.path = '/pokemons'

    const wrapper = mountComponent()

    await wrapper.vm.$nextTick()

    const allLink = wrapper.findAll('.nav-button')[0]
    const favoritesLink = wrapper.findAll('.nav-button')[1]

    expect(allLink.classes()).toContain('active-nav-button')
    expect(favoritesLink.classes()).not.toContain('active-nav-button')
  })

  it('applies active class to "Favorites" link when path is /favorites', async () => {
    mockRoute.path = '/favorites'

    const wrapper = mountComponent()

    await wrapper.vm.$nextTick()

    const allLink = wrapper.findAll('.nav-button')[0]
    const favoritesLink = wrapper.findAll('.nav-button')[1]

    expect(allLink.classes()).not.toContain('active-nav-button')
    expect(favoritesLink.classes()).toContain('active-nav-button')
  })

  it('does not apply active class to any link when path is unknown', async () => {
    mockRoute.path = '/unknown'

    const wrapper = mountComponent()

    await wrapper.vm.$nextTick()

    const allLink = wrapper.findAll('.nav-button')[0]
    const favoritesLink = wrapper.findAll('.nav-button')[1]

    expect(allLink.classes()).not.toContain('active-nav-button')
    expect(favoritesLink.classes()).not.toContain('active-nav-button')
  })
})
