import { createApp }   from 'vue'
import { createPinia } from 'pinia'
import router          from './router/index.js'
import App             from './App.vue'
import './assets/styles/variables.css'
import './assets/styles/main.css'

const app   = createApp(App)
const pinia = createPinia()

app.use(pinia)

// ── Initialiser auth AVANT le router pour réhydrater le token ──
import { useAuthStore } from './stores/auth.js'
const auth = useAuthStore()
auth.init()

// ── Puis ajouter le router ─────────────────────────────────────
app.use(router)

app.mount('#app')