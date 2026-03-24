<template>
  <nav class="navbar">
    <div class="navbar-logo">
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#F2B705" stroke-width="1.5">
        <path d="M12 2a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9S3 15.97 3 11a9 9 0 0 1 9-9z"/>
        <path d="M12 6c-2.5 1-4 3.5-4 5.5 0 2.5 1.8 4.5 4 4.5s4-2 4-4.5c0-2-1.5-4.5-4-5.5z"/>
        <path d="M12 2v4M8.5 3.5l2 3M15.5 3.5l-2 3"/>
      </svg>
      AgroTrack
    </div>

    <div class="navbar-right">

      <!-- Notifications -->
      <button class="notif-btn" @click="$emit('openNotifs')">
        <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V4a2 2 0 1 0-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 1 1-6 0m6 0H9"/>
        </svg>
        <span class="notif-badge">3</span>
      </button>

      <!-- User info -->
      <div class="nav-user" @click="$emit('openUserMenu')">
        <div class="nav-avatar">{{ initials }}</div>
        <div class="nav-user-info">
          <div class="nav-user-name">{{ userName }}</div>
          <div class="nav-user-role">{{ roleLabel }}</div>
        </div>
      </div>

      <!-- Logout -->
      <button class="logout-btn" @click="handleLogout" title="Déconnexion">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
      </button>

    </div>
  </nav>
</template>

<script setup>
import { computed }      from 'vue'
import { useRouter }     from 'vue-router'
import { useAuthStore }  from '@/stores/auth.js'

const auth   = useAuthStore()
const router = useRouter()

defineEmits(['openNotifs', 'openUserMenu'])

const roleLabels = { admin: 'Administrateur', gerant: 'Gérant de Ferme', agent: 'Agent Terrain' }
const roleLabel  = computed(() => roleLabels[auth.role] || 'Utilisateur')
const userName   = computed(() => auth.user?.name || 'Utilisateur')
const initials   = computed(() => {
  const n = auth.user?.name || 'U'
  return n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
})

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.logout-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  padding: 0.4rem;
  border-radius: 6px;
  transition: color 0.15s, background 0.15s;
}
.logout-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}
</style>