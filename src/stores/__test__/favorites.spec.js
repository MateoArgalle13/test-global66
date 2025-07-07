import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFavoritesStore } from '../favorites'

describe('Favorites Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with an empty favorites list', () => {
    const store = useFavoritesStore()
    expect(store.favorites).toEqual([])
  })

  it('adds a pokemon to favorites', () => {
    const store = useFavoritesStore()
    const pokemon1 = { id: 1, name: 'Bulbasaur' }

    store.addFavorite(pokemon1)
    expect(store.favorites).toEqual([pokemon1])
  })

  it('does not add duplicate pokemons to favorites', () => {
    const store = useFavoritesStore()
    const pokemon1 = { id: 1, name: 'Bulbasaur' }

    store.addFavorite(pokemon1)
    store.addFavorite(pokemon1)
    expect(store.favorites).toEqual([pokemon1])
  })

  it('removes a pokemon from favorites', () => {
    const store = useFavoritesStore()
    const pokemon1 = { id: 1, name: 'Bulbasaur' }
    const pokemon2 = { id: 2, name: 'Charmander' }

    store.addFavorite(pokemon1)
    store.addFavorite(pokemon2)
    expect(store.favorites).toEqual([pokemon1, pokemon2])

    store.removeFavorite(pokemon1.id)
    expect(store.favorites).toEqual([pokemon2])
  })

  it('does nothing when removing a non-existent pokemon', () => {
    const store = useFavoritesStore()
    const pokemon1 = { id: 1, name: 'Bulbasaur' }
    store.addFavorite(pokemon1)

    store.removeFavorite(999)
    expect(store.favorites).toEqual([pokemon1])
  })

  it('correctly identifies if a pokemon is a favorite', () => {
    const store = useFavoritesStore()
    const pokemon1 = { id: 1, name: 'Bulbasaur' }
    store.addFavorite(pokemon1)

    expect(store.isFavorite(1)).toBe(true)
    expect(store.isFavorite(2)).toBe(false)
  })
})
