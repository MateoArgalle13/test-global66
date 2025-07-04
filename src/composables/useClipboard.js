// src/composables/useClipboard.js
import { ref } from 'vue'

export function useClipboard() {
  const copied = ref(false)
  const error = ref(null)

  const copyToClipboard = async (text) => {
    copied.value = false
    error.value = null
    try {
      await navigator.clipboard.writeText(text)
      copied.value = true
      // Reinicia el estado 'copied' después de un breve periodo
      setTimeout(() => {
        copied.value = false
      }, 2000)
    } catch (err) {
      error.value = err
      console.error('Failed to copy to clipboard:', err)
    }
  }

  return { copied, error, copyToClipboard }
}
