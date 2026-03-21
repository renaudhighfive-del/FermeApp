<template>
  <aside class="sidebar">
    <div class="sidebar-section">
      <div class="sidebar-section-label">Navigation</div>
      <SidebarItem icon="tasks"  label="Mes tâches" to="/agent/tasks"/>
      <SidebarItem icon="flag"   label="Campagnes"  to="/agent/dashboard"/>
      <SidebarItem icon="saisie" label="Saisie"     to="/agent/saisie"/>
      <SidebarItem icon="health" label="Santé"      to="/agent/health"/>
      <SidebarItem icon="alert"  label="Alertes"    to="/agent/alerts"/>
    </div>
    <div class="sidebar-bottom">
      <div class="nav-avatar" style="background:#D4EDDA;color:#2D6A4F;font-size:11px">
        {{ initials }}
      </div>
      <div>
        <div class="sidebar-bottom-name">{{ auth.user?.name || 'Agent' }}</div>
        <div class="sidebar-bottom-role">Agent Terrain</div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed }     from 'vue'
import { useAuthStore } from '@/stores/auth.js'
import SidebarItem      from './SidebarItem.vue'

const auth = useAuthStore()

const initials = computed(() => {
  const n = auth.user?.name || 'A'
  return n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
})
</script>