import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Loader from '../Loader.vue'

describe('Loader', () => {
  it('renders the pokeball loader structure', () => {
    const wrapper = mount(Loader)

    expect(wrapper.find('.poke_container').exists()).toBe(true)

    const pokeball = wrapper.find('.pokeball.ball')
    expect(pokeball.exists()).toBe(true)

    expect(pokeball.find('.pokeball_part_bottom').exists()).toBe(true)
    expect(pokeball.find('.pokeball_shadow.ball').exists()).toBe(true)
    expect(pokeball.find('.belt').exists()).toBe(true)
    expect(pokeball.find('.belt_loop').exists()).toBe(true)
    expect(pokeball.find('.belt_bg').exists()).toBe(true)
    expect(pokeball.find('.belt_loop_inside').exists()).toBe(true)
    expect(pokeball.find('.belt_loop_button').exists()).toBe(true)
    expect(pokeball.find('.pokeball_light').exists()).toBe(true)
    expect(wrapper.find('.pokeball_ground_shadow.ball').exists()).toBe(true)
  })
})
