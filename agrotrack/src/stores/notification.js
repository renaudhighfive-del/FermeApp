import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const toasts = ref([])

  const add = (message, type = 'info', duration = 2000) => {
    const id = Date.now()
    toasts.value.push({ id, message, type })
    
    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }
  }

  const remove = (id) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return { toasts, add, remove }
})
