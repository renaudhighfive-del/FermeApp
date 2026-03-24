<template>
  <aside class="sidebar">
    <div class="sidebar-section">
      <div class="sidebar-section-label">Principal</div>
      <SidebarItem icon="grid"     label="Tableau de bord" to="/admin/dashboard"/>
      <SidebarItem icon="flag"     label="Campagnes"       to="/admin/campaigns"/>
      <SidebarItem icon="animal"   label="Animaux"         to="/admin/animals"/>
      <SidebarItem icon="health"   label="Santé & Alertes" to="/admin/health"/>
      <SidebarItem icon="box"      label="Alimentation"    to="/admin/stock"/>
      <SidebarItem icon="chart"    label="Finance"         to="/admin/finance"/>
      <SidebarItem icon="sales"    label="Ventes"          to="/admin/sales"/>
    </div>
    <div class="sidebar-section">
      <div class="sidebar-section-label">Administration</div>
      <SidebarItem icon="users"    label="Utilisateurs"    to="/admin/users"/>
      <SidebarItem icon="reports"  label="Rapports"        to="/admin/reports"/>
      <SidebarItem icon="settings" label="Paramètres"      to="/admin/settings"/>
    </div>
    <div class="sidebar-bottom">
      <div class="nav-avatar" style="background:#EDE9F7;color:#5B35B0;font-size:11px">AD</div>
      <div>
        <div class="sidebar-bottom-name">{{ auth.user?.name || 'Admin' }}</div>
        <div class="sidebar-bottom-role">Administrateur</div>
      </div>
    </div>
  </aside>
</template>
<script setup>
import { useAuthStore } from '@/stores/auth.js'
import SidebarItem from './SidebarItem.vue'
const auth = useAuthStore()
</script>
