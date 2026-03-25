<template>
<div>
  <div class="page-header">
    <div class="page-header-row">
      <div>
        <h1 class="page-title">Mes Alertes</h1>
        <p class="page-subtitle">Alertes pour {{ authStore.user?.name || 'Agent' }}</p>
      </div>
    </div>
  </div>
  <div class="filters-bar">
    <div class="filter-group">
      <button class="filter-btn active">Toutes</button>
    </div>
  </div>
  
  <div v-if="loading" class="text-center py-20">Chargement...</div>
  <div v-else-if="alerts.length === 0" class="text-center py-20 text-soft">
    Aucune alerte pour le moment.
  </div>
  <div v-else v-for="a in alerts" :key="a.id" class="alert-item mb-gap" :class="a.level">
    <div class="flex items-start gap-12">
      <svg width="18" height="18" fill="none" :stroke="a.iconColor" stroke-width="1.5" viewBox="0 0 24 24" v-html="a.icon" style="flex-shrink:0;margin-top:2px"/>
      <div style="flex:1">
        <div class="alert-item-campaign">{{ a.campaign }}</div>
        <div class="alert-item-title">{{ a.title }}</div>
        <div class="alert-item-desc">{{ a.desc }}</div>
        <div class="alert-item-footer">
          <span class="text-xs text-soft">{{ a.date }}</span>
          <RouterLink to="/agent/saisie" class="btn btn-primary btn-sm">Traiter</RouterLink>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { healthService } from '../../services/api'

const authStore = useAuthStore()
const alerts = ref([])
const loading = ref(true)

const fetchAlerts = async () => {
  loading.value = true
  try {
    const alertsRes = await healthService.getAlerts()
    const backendAlerts = alertsRes.data.alerts || []

    alerts.value = backendAlerts.map(a => {
      let level = 'alert-item-info'
      let iconColor = '#64748B'
      let icon = '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'

      if (a.priority === 'urgent') {
        level = 'alert-item-danger'
        iconColor = '#D62828'
        icon = '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/>'
      } else if (a.priority === 'warning') {
        level = 'alert-item-warning'
        iconColor = '#E07B39'
        icon = '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'
      }

      return {
        id: a._id,
        level: level,
        campaign: a.campaign?.name || 'Général',
        title: a.title,
        desc: a.description,
        date: new Date(a.date).toLocaleDateString('fr-FR'),
        iconColor: iconColor,
        icon: icon
      }
    })

    if (alerts.value.length === 0) {
      alerts.value.push({
        id: 'default-1',
        level: 'alert-item-info',
        campaign: 'Général',
        title: 'Tout est à jour',
        desc: 'Aucune alerte à traiter pour le moment.',
        date: 'Aujourd\'hui',
        iconColor: '#2D6A4F',
        icon: '<polyline points="20 6 9 17 4 12"/>'
      })
    }
  } catch (error) {
    console.error('Error fetching alerts:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchAlerts)
</script>

