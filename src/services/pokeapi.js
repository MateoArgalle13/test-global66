import axios from 'axios'

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon'

export const fetchPokemonList = async (offset = 0, limit = 20) => {
  try {
    const response = await axios.get(`${BASE_URL}?offset=${offset}&limit=${limit}`)
    return response.data
  } catch (error) {
    console.error('Error fetching pokemon list:', error)
    throw error
  }
}

export const fetchPokemonDetails = async (name) => {
  try {
    const response = await axios.get(`${BASE_URL}/${name}`)
    const data = response.data
    const officialArtworkUrl = data.sprites.other['official-artwork']?.front_default

    return {
      ...data,
      imageUrl: officialArtworkUrl || data.sprites.front_default,
    }
  } catch (error) {
    console.error(`Error fetching details for ${name}:`, error)
    throw error
  }
}
