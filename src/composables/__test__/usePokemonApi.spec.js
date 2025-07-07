import { describe, it, expect, vi, beforeEach } from 'vitest'
import { usePokemonApi } from '../usePokemonApi'
import { nextTick } from 'vue'

vi.mock('@/services/pokeapi', () => {
  const mockFetchPokemonList = vi.fn()
  const mockFetchPokemonDetails = vi.fn()

  return {
    fetchPokemonList: mockFetchPokemonList,
    fetchPokemonDetails: mockFetchPokemonDetails,
  }
})

import * as pokeapiService from '@/services/pokeapi'

describe('usePokemonApi', () => {
  beforeEach(() => {
    pokeapiService.fetchPokemonList.mockClear()
    pokeapiService.fetchPokemonDetails.mockClear()
  })

  it('should initialize with data = null, loading = false, and error = null', () => {
    const { data, loading, error } = usePokemonApi()

    expect(data.value).toBe(null)
    expect(loading.value).toBe(false)
    expect(error.value).toBe(null)
  })

  it('getPokemonList should fetch data successfully', async () => {
    const mockPokemonList = {
      results: [{ name: 'bulbasaur' }, { name: 'charmander' }],
      count: 2,
    }
    pokeapiService.fetchPokemonList.mockResolvedValue(mockPokemonList)

    const { data, loading, error, getPokemonList } = usePokemonApi()

    const offset = 0
    const limit = 20

    const result = await getPokemonList(offset, limit)

    expect(loading.value).toBe(false)
    await nextTick()

    expect(pokeapiService.fetchPokemonList).toHaveBeenCalledTimes(1)
    expect(pokeapiService.fetchPokemonList).toHaveBeenCalledWith(offset, limit)

    expect(data.value).toEqual(mockPokemonList)
    expect(error.value).toBe(null)
    expect(result).toEqual(mockPokemonList)
  })

  it('getPokemonList should handle errors', async () => {
    const mockError = new Error('Failed to fetch Pokemon list')
    pokeapiService.fetchPokemonList.mockRejectedValue(mockError)

    const { data, loading, error, getPokemonList } = usePokemonApi()

    const offset = 0
    const limit = 20

    await expect(getPokemonList(offset, limit)).rejects.toThrow(mockError)

    expect(loading.value).toBe(false)
    await nextTick()

    expect(pokeapiService.fetchPokemonList).toHaveBeenCalledTimes(1)
    expect(pokeapiService.fetchPokemonList).toHaveBeenCalledWith(offset, limit)

    expect(data.value).toBe(null)
    expect(error.value).toBe(mockError)
  })

  it('getPokemonDetails should fetch data successfully', async () => {
    const mockPokemonDetails = {
      id: 1,
      name: 'bulbasaur',
      height: 7,
      weight: 69,
    }
    pokeapiService.fetchPokemonDetails.mockResolvedValue(mockPokemonDetails)

    const { data, loading, error, getPokemonDetails } = usePokemonApi()

    const pokemonName = 'bulbasaur'

    const result = await getPokemonDetails(pokemonName)

    expect(loading.value).toBe(false)
    await nextTick()

    expect(pokeapiService.fetchPokemonDetails).toHaveBeenCalledTimes(1)
    expect(pokeapiService.fetchPokemonDetails).toHaveBeenCalledWith(pokemonName)

    expect(data.value).toEqual(mockPokemonDetails)
    expect(error.value).toBe(null)
    expect(result).toEqual(mockPokemonDetails)
  })

  it('getPokemonDetails should handle errors', async () => {
    const mockError = new Error('Failed to fetch Pokemon details')
    pokeapiService.fetchPokemonDetails.mockRejectedValue(mockError)

    const { data, loading, error, getPokemonDetails } = usePokemonApi()

    const pokemonName = 'bulbasaur'

    await expect(getPokemonDetails(pokemonName)).rejects.toThrow(mockError)

    expect(loading.value).toBe(false)
    await nextTick()

    expect(pokeapiService.fetchPokemonDetails).toHaveBeenCalledTimes(1)
    expect(pokeapiService.fetchPokemonDetails).toHaveBeenCalledWith(pokemonName)

    expect(data.value).toBe(null)
    expect(error.value).toBe(mockError)
  })

  it('should set loading to true during API calls', async () => {
    let resolveList
    const deferredListPromise = new Promise((resolve) => {
      resolveList = resolve
    })
    pokeapiService.fetchPokemonList.mockReturnValue(deferredListPromise)

    const { loading, getPokemonList } = usePokemonApi()

    const listCall = getPokemonList(0, 20)

    expect(loading.value).toBe(true)

    resolveList({})
    await listCall

    expect(loading.value).toBe(false)
  })

  it('should set loading to true during details API calls', async () => {
    let resolveDetails
    const deferredDetailsPromise = new Promise((resolve) => {
      resolveDetails = resolve
    })
    pokeapiService.fetchPokemonDetails.mockReturnValue(deferredDetailsPromise) // Use the mocked function

    const { loading, getPokemonDetails } = usePokemonApi()

    const detailsCall = getPokemonDetails('pikachu')

    expect(loading.value).toBe(true)

    resolveDetails({})
    await detailsCall

    expect(loading.value).toBe(false)
  })
})
