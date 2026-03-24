<template>
<div>
  <div class="page-header">
    <div class="page-header-row">
      <div>
        <h1 class="page-title">Santé & Vétérinaire</h1>
        <p class="page-subtitle" v-if="campaign">{{ campaign.name }} · Suivi sanitaire</p>
        <p class="page-subtitle" v-else>Aucune campagne active</p>
      </div>
      <div class="page-actions"><button class="btn btn-primary" @click="showEventModal = true"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Enregistrer événement</button></div>
    </div>
  </div>

  <div v-if="!campaign" class="card" style="text-align: center; padding: 40px;">
    <p class="text-soft" style="font-size: 16px;">Aucune campagne active</p>
    <RouterLink to="/gerant/campaigns" class="btn btn-primary" style="margin-top: 20px;">Voir les campagnes</RouterLink>
  </div>

  <div v-else>
    <div class="kpi-grid mb-gap">
      <div class="kpi-card"><div class="kpi-top"><div><div class="kpi-label">Effectif actuel</div><div class="kpi-value" style="color:var(--success)">{{ campaign.currentAnimalCount }}</div></div><div class="kpi-icon" style="background:#D4EDDA"><svg width="24" height="24" fill="none" stroke="#2D6A4F" stroke-width="1.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div></div></div>
      <div class="kpi-card"><div class="kpi-top"><div><div class="kpi-label">Pertes totales</div><div class="kpi-value" style="color:var(--danger)">{{ campaign.deaths }}</div></div><div class="kpi-icon" style="background:#FDECEA"><svg width="24" height="24" fill="none" stroke="#D62828" stroke-width="1.5" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg></div></div></div>
      <div class="kpi-card"><div class="kpi-top"><div><div class="kpi-label">Taux mortalité</div><div class="kpi-value" style="color:var(--warn)">{{ campaign.mortality }}%</div></div><div class="kpi-icon" style="background:#FFF7ED"><svg width="24" height="24" fill="none" stroke="#E07B39" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg></div></div></div>
      <div class="kpi-card"><div class="kpi-top"><div><div class="kpi-label">Taux survie</div><div class="kpi-value">{{ (100 - campaign.mortality).toFixed(1) }}%</div></div><div class="kpi-icon" style="background:#E3EFF5"><svg width="24" height="24" fill="none" stroke="#1A6B8A" stroke-width="1.5" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div></div></div>
    </div>
    <div class="grid-2 mb-gap">
      <div class="card">
        <div class="card-title">Événements santé récents</div>
        <div v-if="healthEvents.length === 0" class="text-center p-20">
          <p class="text-soft">Aucun événement enregistré</p>
        </div>
        <div v-else class="table-wrap">
          <table class="table">
            <thead><tr><th>Date</th><th>Animal</th><th>Type</th><th>Description</th><th>Statut</th></tr></thead>
            <tbody>
              <tr v-for="e in healthEvents.slice(0, 5)" :key="e._id || e.id">
                <td class="text-soft text-sm">{{ formatDate(e.date) }}</td>
                <td class="fw-600">{{ e.animalId || '-' }}</td>
                <td><span class="badge" :class="getEventTypeClass(e.type)">{{ e.type }}</span></td>
                <td>{{ e.description }}</td>
                <td><span class="badge" :class="getStatusClass(e.status)">{{ e.status || 'Enregistré' }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card">
        <div class="card-title">Résumé</div>
        <div style="font-size:13px;line-height:1.8;color:var(--soft)">
          <p><strong>Campagne en cours:</strong> {{ campaign.name }}</p>
          <p><strong>Status:</strong> {{ campaign.status }}</p>
          <p><strong>Taux de mortalité:</strong> {{ campaign.mortality }}%</p>
        </div>
      </div>
    </div>
  </div>

  <ModalHealthEvent :open="showEventModal" :campaign="campaign" @close="handleEventModalClose"/>
</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGerantStore } from '@/stores/gerant'
import { healthService } from '@/services/api'
import ModalHealthEvent from '@/components/common/ModalHealthEvent.vue'

const gerantStore = useGerantStore()
const campaign = computed(() => gerantStore.activeCampaigns[0] || null)
const healthEvents = ref([])
const showEventModal = ref(false)

onMounted(async () => {
  await loadHealthEvents()
})

async function loadHealthEvents() {
  try {
    if (campaign.value) {
      const res = await healthService.getAll({ campaign: campaign.value._id || campaign.value.id, limit: 100 })
      healthEvents.value = res.data || []
    }
  } catch (err) {
    console.error('Erreur lors du chargement des événements santé:', err)
    healthEvents.value = []
  }
}

function formatDate(date) {
  if (!date) return '-'
  const d = new Date(date)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}

function getEventTypeClass(type) {
  const classes = {
    'Anomalie': 'badge-anomalie',
    'Vaccination': 'badge-encours',
    'Mortalité': 'badge-danger',
    'Observation': 'badge-observation'
  }
  return classes[type] || 'badge-inactif'
}

function getStatusClass(status) {
  const classes = {
    'Suivi': 'badge-urgent',
    'Terminé': 'badge-termine',
    'Clôturé': 'badge-terminee',
    'En cours': 'badge-encours2'
  }
  return classes[status] || 'badge-inactif'
}

async function handleEventModalClose() {
  showEventModal.value = false
  await loadHealthEvents()
}
</script>
