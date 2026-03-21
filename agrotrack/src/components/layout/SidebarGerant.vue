<template>
  <aside class="sidebar">
    <div class="sidebar-section">
      <div class="sidebar-section-label">Principal</div>
      <SidebarItem icon="grid"    label="Tableau de bord" to="/gerant/dashboard"/>
      <SidebarItem icon="flag"    label="Campagnes"       to="/gerant/campaigns"/>
      <SidebarItem icon="animal"  label="Animaux"         to="/gerant/animals"/>
      <SidebarItem icon="health"  label="Santé"           to="/gerant/health"/>
      <SidebarItem icon="food"    label="Alimentation"    to="/gerant/food"/>
      <SidebarItem icon="chart"   label="Finance"         to="/gerant/finance"/>
      <SidebarItem icon="sales"   label="Ventes"          to="/gerant/sales"/>
      <SidebarItem icon="box"     label="Stock"           to="/gerant/stock"/>
    </div>
    <div class="sidebar-section">
      <div class="sidebar-section-label">Rapports</div>
      <SidebarItem icon="reports" label="Rapports" to="/gerant/reports"/>
    </div>
    <div class="sidebar-bottom">
      <div class="nav-avatar" style="background:#E3EFF5;color:#1A4F8A;font-size:11px">
        {{ initials }}
      </div>
      <div>
        <div class="sidebar-bottom-name">{{ auth.user?.name || 'Gérant' }}</div>
        <div class="sidebar-bottom-role">Gérant de Ferme</div>
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
  const n = auth.user?.name || 'G'
  return n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
})
</script>