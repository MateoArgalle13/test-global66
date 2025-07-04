import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
// Importar Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
// Importar Bootstrap JS (si necesitas componentes interactivos como modales, dropdowns, etc.)
import 'bootstrap/dist/js/bootstrap.bundle.min.js' // O 'bootstrap/js/dist/dropdown' etc.

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

app.mount('#app')
