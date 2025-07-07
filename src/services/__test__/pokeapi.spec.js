import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { fetchPokemonList, fetchPokemonDetails } from '../pokeapi'

vi.mock('axios')
const mockConsoleError = vi.fn()
vi.stubGlobal('console', { error: mockConsoleError })

describe('pokeapiService', () => {
  const BASE_URL = 'https://pokeapi.co/api/v2/pokemon'

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  describe('fetchPokemonList', () => {
    it('should fetch a list of pokemons successfully', async () => {
      const mockData = {
        count: 1302,
        next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
        previous: null,
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
        ],
      }
      axios.get.mockResolvedValue({ data: mockData })

      const offset = 10
      const limit = 5
      const result = await fetchPokemonList(offset, limit)

      expect(axios.get).toHaveBeenCalledTimes(1)
      expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}?offset=${offset}&limit=${limit}`)

      expect(result).toEqual(mockData)
      expect(mockConsoleError).not.toHaveBeenCalled()
    })

    it('should use default offset and limit if not provided', async () => {
      const mockData = { results: [] }
      axios.get.mockResolvedValue({ data: mockData })

      await fetchPokemonList()

      expect(axios.get).toHaveBeenCalledTimes(1)
      expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}?offset=0&limit=20`)
    })

    it('should throw an error if fetching pokemon list fails', async () => {
      const mockError = new Error('Network Error')
      axios.get.mockRejectedValue(mockError)

      const offset = 0
      const limit = 20
      await expect(fetchPokemonList(offset, limit)).rejects.toThrow(mockError)
      expect(axios.get).toHaveBeenCalledTimes(1)
      expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}?offset=${offset}&limit=${limit}`)

      expect(mockConsoleError).toHaveBeenCalledTimes(1)
      expect(mockConsoleError).toHaveBeenCalledWith('Error fetching pokemon list:', mockError)
    })
  })

  describe('fetchPokemonDetails', () => {
    it('should fetch pokemon details and return official-artwork URL', async () => {
      const pokemonName = 'pikachu'
      const mockDetails = {
        id: 25,
        name: pokemonName,
        sprites: {
          front_default:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
          other: {
            'official-artwork': {
              front_default:
                'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
            },
          },
        },
        height: 4,
        weight: 60,
      }
      axios.get.mockResolvedValue({ data: mockDetails })

      const result = await fetchPokemonDetails(pokemonName)
      expect(axios.get).toHaveBeenCalledTimes(1)
      expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/${pokemonName}`)
      expect(result).toEqual({
        ...mockDetails,
        imageUrl: mockDetails.sprites.other['official-artwork'].front_default,
      })

      expect(mockConsoleError).not.toHaveBeenCalled()
    })

    it('should fetch pokemon details and fallback to front_default URL if official-artwork is missing', async () => {
      const pokemonName = 'ditto'
      const mockDetails = {
        id: 132,
        name: pokemonName,
        sprites: {
          front_default:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png',
          other: {},
        },
        height: 3,
        weight: 40,
      }
      axios.get.mockResolvedValue({ data: mockDetails })

      const result = await fetchPokemonDetails(pokemonName)

      expect(axios.get).toHaveBeenCalledTimes(1)
      expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/${pokemonName}`)

      expect(result).toEqual({
        ...mockDetails,
        imageUrl: mockDetails.sprites.front_default,
      })

      expect(mockConsoleError).not.toHaveBeenCalled()
    })

    it('should throw an error if fetching pokemon details fails', async () => {
      const pokemonName = 'nonexistent'
      const mockError = new Error('Request failed with status code 404')
      axios.get.mockRejectedValue(mockError)

      await expect(fetchPokemonDetails(pokemonName)).rejects.toThrow(mockError)
      expect(axios.get).toHaveBeenCalledTimes(1)
      expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/${pokemonName}`)

      expect(mockConsoleError).toHaveBeenCalledTimes(1)
      expect(mockConsoleError).toHaveBeenCalledWith(
        `Error fetching details for ${pokemonName}:`,
        mockError,
      )
    })
  })
})
