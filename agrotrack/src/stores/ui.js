import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  // --- Notifications (Toast) ---
  const notifications = ref([])
  
  const addNotification = (message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random()
    notifications.value.push({ id, message, type })
    
    setTimeout(() => {
      removeNotification(id)
    }, duration)
  }

  const removeNotification = (id) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  const success = (message) => addNotification(message, 'success')
  const error = (message) => addNotification(message, 'error')
  const info = (message) => addNotification(message, 'info')
  const warning = (message) => addNotification(message, 'warning')

  // --- Modal de Confirmation ---
  const confirmState = ref({
    show: false,
    title: '',
    message: '',
    confirmText: 'Confirmer',
    cancelText: 'Annuler',
    onConfirm: null,
    onCancel: null,
    type: 'warning' // 'warning', 'danger', 'info'
  })

  const confirm = ({ title, message, confirmText, cancelText, type = 'warning' }) => {
    return new Promise((resolve) => {
      confirmState.value = {
        show: true,
        title: title || 'Confirmation',
        message: message || 'Êtes-vous sûr de vouloir continuer ?',
        confirmText: confirmText || 'Confirmer',
        cancelText: cancelText || 'Annuler',
        type,
        onConfirm: () => {
          confirmState.value.show = false
          resolve(true)
        },
        onCancel: () => {
          confirmState.value.show = false
          resolve(false)
        }
      }
    })
  }

  // --- Theme (Light/Dark) ---
  const theme = ref(localStorage.getItem('theme') || 'light')

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
    applyTheme()
  }

  const applyTheme = () => {
    if (theme.value === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // --- Sidebar Mobile ---
  const isSidebarOpen = ref(false)
  const toggleSidebar = () => isSidebarOpen.value = !isSidebarOpen.value
  const closeSidebar = () => isSidebarOpen.value = false

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    info,
    warning,
    confirmState,
    confirm,
    theme,
    toggleTheme,
    applyTheme,
    isSidebarOpen,
    toggleSidebar,
    closeSidebar
  }
})
