import axios from 'axios'
import { useAuthStore } from '@/stores/auth.js'
import router from '@/router/index.js'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ,
  timeout: 10000
})

api.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.token) config.headers.Authorization = `Bearer ${auth.token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore().logout()
      router.push('/login')
    }
    if (err.response?.status === 403) router.push('/unauthorized')
    return Promise.reject(err)
  }
)

export default api
