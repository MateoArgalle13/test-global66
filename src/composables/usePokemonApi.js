import { ref } from 'vue'
import * as pokeapiService from '@/services/pokeapi'

export function usePokemonApi() {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const getPokemonList = async (offset = 0, limit = 20) => {
    loading.value = true
    error.value = null
    try {
      const result = await pokeapiService.fetchPokemonList(offset, limit)
      data.value = result
      return result
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  const getPokemonDetails = async (name) => {
    loading.value = true
    error.value = null
    try {
      const result = await pokeapiService.fetchPokemonDetails(name)
      data.value = result
      return result
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    loading,
    error,
    getPokemonList,
    getPokemonDetails,
  }
}
