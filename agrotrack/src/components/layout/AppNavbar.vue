<template>
  <nav class="sticky top-0 z-40 flex items-center justify-between h-16 px-4 transition-colors duration-300 border-b bg-white/80 backdrop-blur-md border-emerald-100 dark:bg-zinc-900/90 dark:border-zinc-800 lg:px-8">
    
    <div class="flex items-center gap-3 lg:gap-5">
      <button 
        class="flex items-center justify-center w-10 h-10 transition-all rounded-xl lg:hidden text-zinc-500 hover:bg-emerald-50 hover:text-emerald-600 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-emerald-400" 
        @click="ui.toggleSidebar"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      <div class="flex items-center gap-2.5 group cursor-pointer">
        <div class="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 group-hover:scale-110 transition-transform">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" class="text-emerald-600 dark:text-emerald-400">
            <path d="M12 2a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9S3 15.97 3 11a9 9 0 0 1 9-9z"/>
            <path d="M12 6c-2.5 1-4 3.5-4 5.5 0 2.5 1.8 4.5 4 4.5s4-2 4-4.5c0-2-1.5-4.5-4-5.5z"/>
            <path d="M12 2v4M8.5 3.5l2 3M15.5 3.5l-2 3"/>
          </svg>
        </div>
        <span class="hidden font-extrabold tracking-tight text-zinc-800 dark:text-zinc-100 sm:inline text-lg">
          Agro<span class="text-emerald-600 dark:text-emerald-400">Track</span>
        </span>
      </div>
    </div>

    <div class="flex items-center gap-2 lg:gap-4">
      <button 
        class="flex items-center justify-center w-10 h-10 transition-all rounded-xl text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800" 
        @click="ui.toggleTheme" 
        :title="ui.theme === 'light' ? 'Mode sombre' : 'Mode clair'"
      >
        <svg v-if="ui.theme === 'light'" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
        <svg v-else width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M17.66 6.34l1.42-1.42"/>
        </svg>
      </button>

      <button class="relative flex items-center justify-center w-10 h-10 transition-all rounded-xl text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800" @click="$emit('openNotifs')">
        <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V4a2 2 0 1 0-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 1 1-6 0m6 0H9"/>
        </svg>
        <span v-if="urgentAlertsCount > 0" class="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-zinc-900 animate-pulse">
          {{ urgentAlertsCount }}
        </span>
      </button>

      <div class="hidden h-8 w-[1px] bg-zinc-200 dark:bg-zinc-800 lg:block"></div>

      <div class="flex items-center gap-3 p-1.5 transition-all rounded-2xl cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 group" @click="$emit('openUserMenu')">
        <div class="flex items-center justify-center w-9 h-9 font-bold transition-transform rounded-xl bg-emerald-600 text-emerald-50 group-hover:scale-95 text-sm shadow-sm">
          {{ initials }}
        </div>
        <div class="hidden text-left lg:block">
          <div class="text-sm font-bold leading-tight text-zinc-800 dark:text-zinc-100">{{ userName }}</div>
          <div class="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{{ roleLabel }}</div>
        </div>
      </div>

      <button class="flex items-center justify-center w-10 h-10 transition-all rounded-xl text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400" @click="handleLogout" title="Déconnexion">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
      </button>

    </div>
  </nav>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter }     from 'vue-router'
import { useAuthStore }  from '@/stores/auth.js'
import { useAdminStore } from '@/stores/admin.js'
import { useUiStore }    from '@/stores/ui.js'

const auth   = useAuthStore()
const admin  = useAdminStore()
const ui     = useUiStore()
const router = useRouter()

defineEmits(['openNotifs', 'openUserMenu'])

const roleLabels = { admin: 'Administrateur', gerant: 'Gérant de Ferme', agent: 'Agent Terrain' }
const roleLabel  = computed(() => roleLabels[auth.role] || 'Utilisateur')
const userName   = computed(() => auth.user?.name || 'Utilisateur')
const initials   = computed(() => {
  const n = auth.user?.name || 'U'
  return n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
})

// Alertes urgentes calculées dynamiquement depuis le store
const urgentAlertsCount = computed(() => {
  return admin.alerts.filter(a => a.priority === 'urgent' && !a.resolved).length
})

let refreshInterval = null

async function handleLogout() {
  const confirm = await ui.confirm({
    title: 'Déconnexion',
    message: 'Êtes-vous sûr de vouloir vous déconnecter de votre session ?',
    confirmText: 'Se déconnecter',
    type: 'warning'
  })

  if (confirm) {
    auth.logout()
    router.push('/login')
    ui.success('Vous avez été déconnecté avec succès')
  }
}

onMounted(() => {
  // Charger les alertes au montage
  admin.fetchAlerts()
  
  // Mettre à jour périodiquement (toutes les 30 secondes)
  refreshInterval = setInterval(() => {
    admin.fetchAlerts()
  }, 30000)
})

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval)
})
</script>


<style scoped>
.navbar {
  height: 64px;
  background: white;
  border-bottom: 1px solid #E8D9C5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 40;
  transition: background-color 0.3s, border-color 0.3s;
}

:deep(.dark) .navbar {
  background: #1A1A1A;
  border-color: #333;
  color: white;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  font-size: 18px;
  color: #3D2B1F;
}

:deep(.dark) .navbar-logo {
  color: #F2B705;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.theme-toggle-btn, .mobile-menu-btn, .notif-btn, .logout-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7A6652;
  transition: all 0.2s;
  background: transparent;
  border: none;
  cursor: pointer;
}

.theme-toggle-btn:hover, .mobile-menu-btn:hover, .notif-btn:hover {
  background: #F8F3ED;
  color: #3D2B1F;
}

:deep(.dark) .theme-toggle-btn:hover, 
:deep(.dark) .mobile-menu-btn:hover, 
:deep(.dark) .notif-btn:hover {
  background: #2A2A2A;
  color: #F2B705;
}

.notif-btn { 
  position: relative;
}

.notif-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  background: #F2B705;
  color: #1A1A1A;
  font-size: 10px;
  font-weight: 700;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 2px solid white;
}

:deep(.dark) .notif-badge {
  border-color: #1A1A1A;
}

.notif-badge.urgent {
  background: #D62828;
  color: white;
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.nav-user:hover {
  background: #F8F3ED;
}

:deep(.dark) .nav-user:hover {
  background: #2A2A2A;
}

.nav-avatar {
  width: 36px;
  height: 36px;
  background: #3D2B1F;
  color: #F2B705;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}

.nav-user-info {
  display: none;
}

@media (min-width: 640px) {
  .nav-user-info {
    display: block;
  }
}

.nav-user-name {
  font-weight: 700;
  font-size: 14px;
  color: #3D2B1F;
}

:deep(.dark) .nav-user-name {
  color: white;
}

.nav-user-role {
  font-size: 11px;
  color: #7A6652;
}

.logout-btn:hover {
  background: #FEE2E2;
  color: #D62828;
}

:deep(.dark) .logout-btn:hover {
  background: #450a0a;
  color: #f87171;
}

@media (max-width: 640px) {
  .navbar {
    padding: 0 12px;
  }
  .navbar-right {
    gap: 4px;
  }
}
</style>