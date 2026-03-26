<template>
  <nav class="cyber-navbar">
    <div class="navbar-glass">
      <div class="navbar-container">
        <!-- Left Section -->
        <div class="navbar-left">
          <button 
            class="menu-toggle magnetic-field" 
            @click="ui.toggleSidebar"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          <div class="brand-container magnetic-field">
            <div class="brand-logo">
              <div class="logo-core"></div>
              <div class="logo-ring"></div>
            </div>
            <div class="brand-text">
              <span class="brand-title holographic-text">AgroTrack</span>
              <span class="brand-subtitle">Digital Twin OS</span>
            </div>
          </div>
        </div>

        <!-- Right Section -->
        <div class="navbar-right">
          <button 
            class="nav-button magnetic-field" 
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

          <button class="nav-button notification-btn magnetic-field" @click="$emit('openNotifs')">
            <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V4a2 2 0 1 0-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 1 1-6 0m6 0H9"/>
            </svg>
            <span v-if="urgentAlertsCount > 0" class="notification-badge pulse-animation">
              {{ urgentAlertsCount }}
            </span>
          </button>

          <div class="user-profile magnetic-field" @click="$emit('openUserMenu')">
            <div class="user-avatar">
              <span class="avatar-text">{{ initials }}</span>
              <div class="avatar-glow"></div>
            </div>
            <div class="user-info">
              <div class="user-name">{{ userName }}</div>
              <div class="user-role">{{ roleLabel }}</div>
            </div>
          </div>

          <button class="nav-button logout-btn magnetic-field" @click="handleLogout" title="Déconnexion">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>
        </div>
      </div>
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
    cancelText: 'Annuler',
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
/* Cyber Navbar */
.cyber-navbar {
    position: sticky;
    top: 0;
    z-index: var(--z-sticky);
    height: var(--navbar-h);
}

.navbar-glass {
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border-bottom: var(--border-thin) solid var(--glass-border);
    height: 100%;
    box-shadow: var(--glass-shadow);
}

.navbar-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 0 var(--gap-xl);
    max-width: 1920px;
    margin: 0 auto;
}

/* Navbar Left */
.navbar-left {
    display: flex;
    align-items: center;
    gap: var(--gap-lg);
}

.menu-toggle {
    display: none;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: transparent;
    border: var(--border-thin) solid var(--glass-border);
    color: var(--text-secondary);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition-base);
}

.menu-toggle:hover {
    background: var(--glass-bg);
    color: var(--primary);
    border-color: var(--primary);
    box-shadow: var(--glow-primary);
}

@media (max-width: 1024px) {
    .menu-toggle {
        display: flex;
    }
}

/* Brand Container */
.brand-container {
    display: flex;
    align-items: center;
    gap: var(--gap-md);
    cursor: pointer;
}

.brand-logo {
    position: relative;
    width: 40px;
    height: 40px;
}

.logo-core {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    background: var(--gradient-primary);
    border-radius: 50%;
    box-shadow: var(--glow-primary);
    animation: pulse 2s ease-in-out infinite;
}

.logo-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 36px;
    height: 36px;
    border: 2px solid var(--accent);
    border-radius: 50%;
    opacity: 0.6;
    animation: rotate 10s linear infinite;
}

.brand-text {
    display: flex;
    flex-direction: column;
}

.brand-title {
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.2;
}

.holographic-text {
    background: var(--gradient-hologram);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: holographic 3s ease infinite;
}

.brand-subtitle {
    font-family: var(--font-heading);
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--accent);
    margin-top: -2px;
}

/* Navbar Right */
.navbar-right {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
}

.nav-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: transparent;
    border: var(--border-thin) solid transparent;
    color: var(--text-secondary);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition-base);
    position: relative;
}

.nav-button:hover {
    background: var(--glass-bg);
    color: var(--primary);
    border-color: var(--glass-border);
}

.notification-btn {
    position: relative;
}

.notification-badge {
    position: absolute;
    top: 4px;
    right: 4px;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    background: var(--danger);
    color: var(--text-inverse);
    font-family: var(--font-heading);
    font-size: 10px;
    font-weight: 700;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--glass-bg);
}

.pulse-animation {
    animation: pulse-badge 2s ease-in-out infinite;
}

/* User Profile */
.user-profile {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
    padding: var(--gap-xs) var(--gap-sm);
    background: transparent;
    border: var(--border-thin) solid var(--glass-border);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: var(--transition-base);
    margin-left: var(--gap-sm);
}

.user-profile:hover {
    background: var(--glass-bg);
    border-color: var(--accent);
    box-shadow: var(--glow-accent);
}

.user-avatar {
    position: relative;
    width: 36px;
    height: 36px;
    border-radius: var(--radius-full);
    background: var(--gradient-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.avatar-text {
    font-family: var(--font-heading);
    font-size: 14px;
    font-weight: 700;
    color: var(--text-inverse);
}

.avatar-glow {
    position: absolute;
    inset: 0;
    background: var(--gradient-primary);
    opacity: 0;
    filter: blur(8px);
    transition: var(--transition-base);
}

.user-profile:hover .avatar-glow {
    opacity: 0.5;
}

.user-info {
    display: none;
    flex-direction: column;
    text-align: left;
}

@media (min-width: 1024px) {
    .user-info {
        display: flex;
    }
}

.user-name {
    font-family: var(--font-heading);
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.2;
}

.user-role {
    font-size: 10px;
    font-weight: 500;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

/* Logout Button */
.logout-btn:hover {
    color: var(--danger);
    border-color: var(--danger);
    box-shadow: var(--glow-danger);
}

/* Magnetic Field Effect */
.magnetic-field {
    transition: var(--transition-slow);
}

.magnetic-field:hover {
    transform: scale(1.05);
}

/* Animations */
@keyframes holographic {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

@keyframes pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
}

@keyframes rotate {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes pulse-badge {
    0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
    50% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
}

/* Responsive */
@media (max-width: 768px) {
    .navbar-container {
        padding: 0 var(--gap-md);
    }
    
    .brand-subtitle {
        display: none;
    }
    
    .nav-button {
        width: 36px;
        height: 36px;
    }
}

@media (max-width: 480px) {
    .brand-title {
        font-size: 16px;
    }
    
    .user-profile {
        padding: var(--gap-xs);
        border: none;
    }
    
    .user-profile:hover {
        background: transparent;
        box-shadow: none;
    }
}
</style>