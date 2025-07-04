import axios from 'axios'

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon'

export const fetchPokemonList = async (offset = 0, limit = 20) => {
  try {
    const response = await axios.get(`${BASE_URL}?offset=${offset}&limit=${limit}`)

    const data = response.data

    return data
  } catch (error) {
    console.error('Error fetching pokemon list:', error)
    if (error.response) {
      console.error('HTTP Error Status:', error.response.status)
    }
    throw error
  }
}

export const fetchPokemonDetails = async (name) => {
  try {
    const response = await axios.get(`${BASE_URL}/${name}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching details for ${name}:`, error)
    throw error
  }
}
