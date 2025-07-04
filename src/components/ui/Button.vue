<template>
  <button :class="['btn', variant]" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  variant: {
    type: String,
    default: 'primary', // 'primary', 'secondary', 'favorite', 'share'
    validator: (value) => ['primary', 'secondary', 'favorite', 'share'].includes(value),
  },
})

defineEmits(['click'])
</script>

<style scoped>
.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.btn:hover {
  opacity: 0.9;
}

/* Variantes de color */
.btn.primary {
  background-color: var(--color-primary);
  color: var(--color-text-light);
}

.btn.secondary {
  background-color: #ccc;
  color: var(--color-text-dark);
}

.btn.favorite {
  background-color: var(--color-favorite);
  color: var(--color-text-dark);
}

.btn.share {
  background-color: #4caf50; /* Verde */
  color: var(--color-text-light);
}
</style>
