<template>
  <aside class="sidebar" :class="{ 'open': ui.isSidebarOpen }">
    <!-- Sidebar Header for Mobile -->
    <div class="sidebar-header">
      <div class="navbar-logo">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="var(--accent)" stroke-width="1.5">
          <path d="M12 2a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9S3 15.97 3 11a9 9 0 0 1 9-9z"/>
          <path d="M12 6c-2.5 1-4 3.5-4 5.5 0 2.5 1.8 4.5 4 4.5s4-2 4-4.5c0-2-1.5-4.5-4-5.5z"/>
        </svg>
        <span>AgroTrack</span>
      </div>
      <button class="p-2 text-[var(--soft)]" @click="ui.closeSidebar">
        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <div class="sidebar-section">
      <div class="sidebar-section-label">Navigation</div>
      <SidebarItem icon="tasks"  label="Mes tâches" to="/agent/tasks" @click="ui.closeSidebar"/>
      <SidebarItem icon="flag"   label="Campagnes"  to="/agent/dashboard" @click="ui.closeSidebar"/>
      <SidebarItem icon="saisie" label="Saisie"     to="/agent/saisie" @click="ui.closeSidebar"/>
      <SidebarItem icon="health" label="Santé"      to="/agent/health" @click="ui.closeSidebar"/>
      <SidebarItem icon="alert"  label="Alertes"    to="/agent/alerts" @click="ui.closeSidebar"/>
    </div>

    <!-- User Info at Bottom -->
    <div class="mt-auto p-4 border-t border-[var(--border)] bg-[var(--bg)]/50">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-[var(--accent)] text-[var(--primary)] flex items-center justify-center font-bold text-sm">
          {{ initials }}
        </div>
        <div class="overflow-hidden">
          <div class="text-sm font-bold text-[var(--text)] truncate">{{ auth.user?.name }}</div>
          <div class="text-[10px] font-bold text-[var(--soft)] uppercase tracking-wider">Agent Terrain</div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed }     from 'vue'
import { useAuthStore } from '@/stores/auth.js'
import { useUiStore }   from '@/stores/ui.js'
import SidebarItem      from './SidebarItem.vue'

const auth = useAuthStore()
const ui   = useUiStore()

const initials = computed(() => {
  const n = auth.user?.name || 'A'
  return n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
})
</script>

<style scoped>
/* Scoped styles removed in favor of global main.css */
</style>
