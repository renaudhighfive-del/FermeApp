import { createApp }   from 'vue'
import { createPinia } from 'pinia'
import router          from './router/index.js'
import App             from './App.vue'
import './assets/styles/variables.css'
import './assets/styles/main.css'  // ← supprime le doublon

const app   = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// ── Réhydrate le token axios avant le premier rendu ───────────────
import { useAuthStore } from './stores/auth.js'
const auth = useAuthStore()
auth.init()

app.mount('#app')