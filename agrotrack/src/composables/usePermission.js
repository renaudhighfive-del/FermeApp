import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.js'

export function usePermission() {
  const auth = useAuthStore()
  const can      = (roles) => auth.hasRole(roles)
  const role     = computed(() => auth.role)
  const isAdmin  = computed(() => auth.isAdmin)
  const isGerant = computed(() => auth.isGerant)
  const isAgent  = computed(() => auth.isAgent)
  return { can, role, isAdmin, isGerant, isAgent }
}
