<template>
  <aside class="cyber-sidebar" :class="{ 'open': ui.isSidebarOpen }">
    <!-- Sidebar Header for Mobile -->
    <div class="sidebar-header-mobile">
      <div class="sidebar-brand">
        <div class="brand-logo-mini">
          <div class="logo-core-mini"></div>
        </div>
        <span class="brand-text">AgroTrack</span>
      </div>
    </div>

    <!-- Navigation Sections -->
    <div class="sidebar-content">
      <div class="nav-section">
        <div class="section-label">Opérations</div>
        <div class="nav-items">
          <SidebarItem icon="dashboard" label="Dashboard"      to="/admin/dashboard" @click="ui.closeSidebar"/>
          <SidebarItem icon="campaigns" label="Campagnes"      to="/admin/campaigns" @click="ui.closeSidebar"/>
          <SidebarItem icon="stock"     label="Stock & Inventaire" to="/admin/stock" @click="ui.closeSidebar"/>
          <SidebarItem icon="tasks"     label="Tâches & Suivi"   to="/admin/tasks" @click="ui.closeSidebar"/>
          <SidebarItem icon="finance"   label="Finance"         to="/admin/finance" @click="ui.closeSidebar"/>
          <SidebarItem icon="health"    label="Santé & Suivi"   to="/admin/health" @click="ui.closeSidebar"/>
          <SidebarItem icon="animals"   label="Animaux"         to="/admin/animals" @click="ui.closeSidebar"/>
          <SidebarItem icon="sales"     label="Ventes"          to="/admin/sales" @click="ui.closeSidebar"/>
        </div>
      </div>
      
      <div class="nav-section">
        <div class="section-label">Administration</div>
        <div class="nav-items">
          <SidebarItem icon="users"     label="Utilisateurs"    to="/admin/users" @click="ui.closeSidebar"/>
          <SidebarItem icon="reports"   label="Rapports"        to="/admin/reports" @click="ui.closeSidebar"/>
          <SidebarItem icon="farms"     label="Fermes"          to="/admin/farms" @click="ui.closeSidebar"/>
          <SidebarItem icon="settings"  label="Paramètres"      to="/admin/settings" @click="ui.closeSidebar"/>
        </div>
      </div>
    </div>

    <!-- User Info at Bottom -->
    <div class="sidebar-footer">
      <div class="user-card glass-card">
        <div class="user-avatar-sidebar">
          <span class="avatar-initials">{{ initials }}</span>
          <div class="avatar-status online"></div>
        </div>
        <div class="user-details">
          <div class="user-name-sidebar">{{ auth.user?.name }}</div>
          <div class="user-role-sidebar">Administrateur</div>
        </div>
      </div>
    </div>
  </aside>
</template>


<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.js'
import { useUiStore } from '@/stores/ui.js'
import SidebarItem from './SidebarItem.vue'

const auth = useAuthStore()
const ui = useUiStore()

const initials = computed(() => {
  const n = auth.user?.name || 'Admin'
  return n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
})
</script>

<style scoped>
/* Cyber Sidebar */
.cyber-sidebar {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border-right: var(--border-thin) solid var(--glass-border);
    overflow-y: auto;
    overflow-x: hidden;
}

/* Mobile Header */
.sidebar-header-mobile {
    display: none;
    padding: var(--gap-lg);
    border-bottom: var(--border-thin) solid var(--glass-border);
}

@media (max-width: 1024px) {
    .sidebar-header-mobile {
        display: block;
    }
}

.sidebar-brand {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
}

.brand-logo-mini {
    position: relative;
    width: 32px;
    height: 32px;
}

.logo-core-mini {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    background: var(--gradient-primary);
    border-radius: 50%;
    box-shadow: var(--glow-primary);
}

.brand-text {
    font-family: var(--font-display);
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
}

/* Sidebar Content */
.sidebar-content {
    flex: 1;
    padding: var(--gap-lg);
    overflow-y: auto;
}

/* Navigation Sections */
.nav-section {
    margin-bottom: var(--gap-xl);
}

.section-label {
    font-family: var(--font-heading);
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--text-tertiary);
    margin-bottom: var(--gap-md);
    padding-left: var(--gap-sm);
}

.nav-items {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
}

/* Sidebar Footer */
.sidebar-footer {
    padding: var(--gap-lg);
    border-top: var(--border-thin) solid var(--glass-border);
    background: rgba(var(--bg-rgb, 250, 248, 245), 0.5);
}

.dark .sidebar-footer {
    background: rgba(15, 23, 30, 0.5);
}

.user-card {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
    padding: var(--gap-sm);
    border-radius: var(--radius-lg);
}

.user-avatar-sidebar {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: var(--radius-full);
    background: var(--gradient-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.avatar-initials {
    font-family: var(--font-heading);
    font-size: 14px;
    font-weight: 700;
    color: var(--text-inverse);
}

.avatar-status {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 2px solid var(--glass-bg);
}

.avatar-status.online {
    background: var(--success);
    box-shadow: 0 0 8px var(--success);
}

.user-details {
    overflow: hidden;
    min-width: 0;
}

.user-name-sidebar {
    font-family: var(--font-heading);
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.user-role-sidebar {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--accent);
}

/* Glass Card Utility */
.glass-card {
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    border: var(--border-thin) solid var(--glass-border);
    border-radius: var(--radius-lg);
}
</style>
