<template>
  <aside class="sidebar" :class="{ 'open': ui.isSidebarOpen }">
    <!-- Sidebar Header for Mobile -->
    <div class="sidebar-header">
      <div class="navbar-logo">
        <span>AgroTrack</span>
      </div>
    </div>

    <div class="sidebar-section">
      <div class="sidebar-section-label">Opérations</div>
      <SidebarItem icon="dashboard" label="Dashboard"      to="/admin/dashboard" @click="ui.closeSidebar"/>
      <SidebarItem icon="campaigns" label="Campagnes"      to="/admin/campaigns" @click="ui.closeSidebar"/>
      <SidebarItem icon="stock"     label="Stock & Inventaire" to="/admin/stock" @click="ui.closeSidebar"/>
      <SidebarItem icon="tasks"     label="Tâches & Suivi"   to="/admin/tasks" @click="ui.closeSidebar"/>
      <SidebarItem icon="finance"   label="Finance"         to="/admin/finance" @click="ui.closeSidebar"/>
      <SidebarItem icon="health"    label="Santé & Suivi"   to="/admin/health" @click="ui.closeSidebar"/>
      <SidebarItem icon="animals"   label="Animaux"         to="/admin/animals" @click="ui.closeSidebar"/>
      <SidebarItem icon="sales"     label="Ventes"          to="/admin/sales" @click="ui.closeSidebar"/>
    </div>
    
    <div class="sidebar-section">
      <div class="sidebar-section-label">Administration</div>
      <SidebarItem icon="users"     label="Utilisateurs"    to="/admin/users" @click="ui.closeSidebar"/>
      <SidebarItem icon="reports"   label="Rapports"        to="/admin/reports" @click="ui.closeSidebar"/>
      <SidebarItem icon="farms"     label="Fermes"          to="/admin/farms" @click="ui.closeSidebar"/>
      <SidebarItem icon="settings"  label="Paramètres"      to="/admin/settings" @click="ui.closeSidebar"/>
    </div>

    <!-- User Info at Bottom -->
    <div class="mt-auto p-4 border-t border-[var(--border)] bg-[var(--bg)]/50">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-[var(--accent)] text-[var(--primary)] flex items-center justify-center font-bold text-sm">
          {{ initials }}
        </div>
        <div class="overflow-hidden">
          <div class="text-sm font-bold text-[var(--text)] truncate">{{ auth.user?.name }}</div>
          <div class="text-[10px] font-bold text-[var(--soft)] uppercase tracking-wider">Administrateur</div>
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
/* Scoped styles removed in favor of global main.css */
</style>
