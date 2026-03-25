import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/axios.js'

export const useAuthStore = defineStore('auth', () => {

  // ── State ────────────────────────────────────────────────────
  const token = ref(localStorage.getItem('token') || null)
  const user  = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  // ── Getters ──────────────────────────────────────────────────
  const estConnecte = computed(() => !!token.value)
  const role        = computed(() => user.value?.role || null)
  const estAdmin    = computed(() => role.value === 'admin')
  const estGerant   = computed(() => role.value === 'gerant')
  const estAgent    = computed(() => role.value === 'agent')

  // ── Actions ──────────────────────────────────────────────────
  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })

    token.value = data.token
    user.value  = data.user

    localStorage.setItem('token',  data.token)
    localStorage.setItem('user',   JSON.stringify(data.user))

    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

    return data.user.role
  }

  async function fetchMe() {
    const { data } = await api.get('/auth/me')
    user.value = data
    localStorage.setItem('user', JSON.stringify(data))
  }

  function logout() {
    token.value = null
    user.value  = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete api.defaults.headers.common['Authorization']
  }

  // Réhydrate le header axios au démarrage de l'app
  function init() {
    if (token.value) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
    }
  }

  return {
    token, user,
    estConnecte, role, estAdmin, estGerant, estAgent,
    login, logout, fetchMe, init,
  }
})