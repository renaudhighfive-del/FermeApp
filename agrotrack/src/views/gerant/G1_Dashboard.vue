<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGerantStore } from '@/stores/gerant'
import { useAuthStore } from '@/stores/auth'
import { eventService, healthService } from '@/services/api'
import { formatCurrency, formatDate, extractDay, extractMonth, getDaysRemaining, getAnimalPercentage, getBudgetPercentage, getEventBadgeClass, formatEventDate } from '@/utils/formatters'

const gerantStore = useGerantStore()
const authStore = useAuthStore()

const recentEvents = ref([])
const upcomingVaccinations = ref([])
const tasksCount = ref(0)
const selectedCampaignId = ref('')

onMounted(async () => {
  await loadData()
})

async function loadData() {
  try {
    await gerantStore.fetchGerantFarms()
    await gerantStore.fetchGerantCampaigns()
    
    if (gerantStore.activeCampaigns.length > 0 && !selectedCampaignId.value) {
      selectedCampaignId.value = gerantStore.activeCampaigns[0]._id || gerantStore.activeCampaigns[0].id
    }
    
    // Charger les événements récents
    const eventsRes = await eventService.getAll({ limit: 5, sort: '-createdAt' })
    recentEvents.value = eventsRes.data.events || []
    
    // Charger les vaccinations à venir
    const vaccRes = await healthService.getUpcomingVaccinations({ limit: 5 })
    upcomingVaccinations.value = vaccRes.data || []
    
    // Calculer le nombre de tâches (simplifié)
    tasksCount.value = upcomingVaccinations.value.length + (recentEvents.value.filter(e => e.status === 'En attente')?.length || 0)
    
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  }
}

const activeCampaign = computed(() => {
  if (selectedCampaignId.value) {
    return gerantStore.activeCampaigns.find(c => (c._id || c.id) === selectedCampaignId.value) || gerantStore.activeCampaigns[0] || null
  }
  return gerantStore.activeCampaigns[0] || null
})

const totalKPIs = computed(() => {
  const campaigns = gerantStore.activeCampaigns
  return {
    currentAnimalCount: campaigns.reduce((sum, c) => sum + (c.currentAnimalCount || 0), 0),
    deaths: campaigns.reduce((sum, c) => sum + (c.deaths || 0), 0),
    feedConsumed: campaigns.reduce((sum, c) => sum + (c.feedConsumed || 0), 0),
    expectedRevenue: campaigns.reduce((sum, c) => sum + (c.expectedRevenue || 0), 0),
    mortality: campaigns.length > 0 
      ? Math.round((campaigns.reduce((sum, c) => sum + (c.deaths || 0), 0) / campaigns.reduce((sum, c) => sum + (c.initialAnimalCount || 1), 0)) * 100) 
      : 0
  }
})

const currentUserName = computed(() => {
  return authStore.user?.name || 'Utilisateur'
})

const currentDate = computed(() => {
  const today = new Date()
  return today.toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).charAt(0).toUpperCase() + today.toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).slice(1)
})



</script>


<template>
<div>
  <!-- Banner -->
  <div class="banner">
    <svg width="28" height="28" fill="none" stroke="#F2B705" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>
    <div class="banner-content">
      <h3>Bonjour {{ currentUserName }} — Bienvenue sur votre espace de gestion</h3>
      <p>{{ currentDate }} · <span v-if="gerantStore.activeCampaigns.length > 0">{{ gerantStore.activeCampaigns.length }} campagne(s) en cours de suivi</span><span v-else>Aucune campagne active</span></p>
    </div>
  </div>

  <!-- KPI Grid -->
  <div class="kpi-grid mb-gap" v-if="gerantStore.activeCampaigns.length > 0">
    <div class="kpi-card">
      <div class="kpi-top">
        <div>
          <div class="kpi-label">Animaux vivants</div>
          <div class="kpi-value" style="color:var(--success)">{{ totalKPIs.currentAnimalCount }}</div>
          <div class="kpi-sub up">Total {{ gerantStore.activeCampaigns.length }} campagnes</div>
        </div>
        <div class="kpi-icon" style="background:#D4EDDA">
          <svg width="24" height="24" fill="none" stroke="#2D6A4F" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/></svg>
        </div>
      </div>
    </div>
    <div class="kpi-card">
      <div class="kpi-top">
        <div>
          <div class="kpi-label">Pertes totales</div>
          <div class="kpi-value" style="color:var(--danger)">{{ totalKPIs.deaths }}</div>
          <div class="kpi-sub">Mortalité moy: {{ totalKPIs.mortality }}%</div>
        </div>
        <div class="kpi-icon" style="background:#FDECEA">
          <svg width="24" height="24" fill="none" stroke="#D62828" stroke-width="1.5" viewBox="0 0 24 24"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
        </div>
      </div>
    </div>
    <div class="kpi-card">
      <div class="kpi-top">
        <div>
          <div class="kpi-label">Aliments consommés</div>
          <div class="kpi-value" style="color:var(--warn)">{{ totalKPIs.feedConsumed }} kg</div>
          <div class="kpi-sub warn">Cumulatif</div>
        </div>
        <div class="kpi-icon" style="background:#FFF7ED">
          <svg width="24" height="24" fill="none" stroke="#E07B39" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
        </div>
      </div>
    </div>
    <div class="kpi-card">
      <div class="kpi-top">
        <div>
          <div class="kpi-label">Revenu estimé</div>
          <div class="kpi-value" style="color:var(--success)">{{ formatCurrency(totalKPIs.expectedRevenue) }}</div>
          <div class="kpi-sub">Total prévisionnel</div>
        </div>
        <div class="kpi-icon" style="background:#D4EDDA">
          <svg width="24" height="24" fill="none" stroke="#2D6A4F" stroke-width="1.5" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Grid -->
  <div class="flex flex-col gap-20 mb-gap">
    <!-- Active Campaigns Grid -->
    <div v-if="gerantStore.activeCampaigns.length > 0">
      <div class="card-title">Campagnes en cours</div>
      <div class="grid-2">
        <div class="card" v-for="campaign in gerantStore.activeCampaigns" :key="campaign._id || campaign.id">
          <div class="card-header">
            <div class="card-title" style="margin-bottom:0">{{ campaign.name }} <span class="badge badge-encours">{{ campaign.status }}</span></div>
            <RouterLink :to="`/gerant/campaigns/${campaign._id || campaign.id}`" class="btn btn-outline btn-sm">Voir détail</RouterLink>
          </div>
          <div class="progress-wrap mb-12">
            <div class="progress-header">
              <span>Animaux vivants</span>
              <span class="fw-600">{{ campaign.currentAnimalCount }}/{{ campaign.initialAnimalCount }} ({{ getAnimalPercentage(campaign) }}%)</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill fill-green" :style="{width: getAnimalPercentage(campaign) + '%'}"></div>
            </div>
          </div>
          <div class="progress-wrap">
            <div class="progress-header">
              <span>Budget consommé</span>
              <span class="fw-600">{{ formatCurrency(campaign.spent) }}/{{ formatCurrency(campaign.budget) }} ({{ getBudgetPercentage(campaign) }}%)</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill fill-yellow" :style="{width: getBudgetPercentage(campaign) + '%'}"></div>
            </div>
          </div>
          <div class="flex gap-20 mt-auto" style="margin-top:14px;font-size:12px;color:var(--soft)">
            <span class="flex items-center gap-8">
              <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Démarré le {{ formatDate(campaign.startDate) }}
            </span>
            <span class="flex items-center gap-8">
              <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Durée: {{ getDaysRemaining(campaign.startDate) }} j
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Preparation Campaigns Grid -->
    <div v-if="gerantStore.preparationCampaigns.length > 0">
      <div class="card-title">Campagnes en préparation</div>
      <div class="grid-2">
        <div class="card" v-for="campaign in gerantStore.preparationCampaigns" :key="campaign._id || campaign.id">
          <div class="card-header">
            <div class="card-title" style="margin-bottom:0">{{ campaign.name }} <span class="badge badge-prep">{{ campaign.status }}</span></div>
            <RouterLink :to="`/gerant/campaigns/${campaign._id || campaign.id}`" class="btn btn-outline btn-sm">Voir détail</RouterLink>
          </div>
          <div class="flex flex-col gap-12 mt-12" style="font-size:13px;color:var(--soft)">
            <p><strong>Objectif:</strong> {{ campaign.initialAnimalCount }} têtes ({{ campaign.animalType }})</p>
            <p><strong>Budget prévu:</strong> {{ formatCurrency(campaign.budget) }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="gerantStore.activeCampaigns.length === 0 && gerantStore.preparationCampaigns.length === 0" class="card" style="text-align: center; padding: 40px;">
      <p class="text-soft" style="font-size: 16px; margin-bottom: 20px;">Aucune campagne active ou en préparation pour le moment</p>
      <RouterLink to="/gerant/campaigns" class="btn btn-primary">Voir mes campagnes</RouterLink>
    </div>

    <div class="grid-2-1">
      <!-- Recent Events -->
      <div class="card">
        <div class="card-title">5 derniers événements</div>
        <div v-if="recentEvents.length === 0" class="text-center p-20">
          <p class="text-soft">Aucun événement pour le moment</p>
        </div>
        <div v-else class="table-wrap">
          <table class="table">
            <thead><tr><th>Date</th><th>Type</th><th>Description</th><th>Agent</th></tr></thead>
            <tbody>
              <tr v-for="event in recentEvents.slice(0, 5)" :key="event._id || event.id">
                <td class="text-soft text-sm">{{ formatEventDate(event.createdAt || event.date) }}</td>
                <td><span class="badge" :class="getEventBadgeClass(event.type)">{{ event.type }}</span></td>
                <td>{{ event.description }}</td>
                <td class="text-soft text-sm">{{ event.assignedTo?.name || event.createdBy?.name || 'N/A' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Vaccinations Sidebar -->
      <div class="card" style="align-self:start">
        <div class="card-title">Prochaines vaccinations</div>
        <div v-if="upcomingVaccinations.length === 0" class="text-center p-20">
          <p class="text-soft">Aucune vaccination programmée</p>
        </div>
        <div v-for="vacc in upcomingVaccinations.slice(0, 3)" :key="vacc._id || vacc.id" class="vacc-item">
          <div class="vacc-date-badge">
            <div class="vacc-day">{{ extractDay(vacc.nextScheduledDate || vacc.date) }}</div>
            <div class="vacc-mon">{{ extractMonth(vacc.nextScheduledDate || vacc.date) }}</div>
          </div>
          <div>
            <div class="vacc-name">{{ vacc.type }} - {{ vacc.animal?.idNumber || 'N/A' }}</div>
            <div class="vacc-lot">{{ vacc.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- No Campaign Message -->
  <!-- <div v-else class="card" style="text-align: center; padding: 40px;">
    <p class="text-soft" style="font-size: 16px; margin-bottom: 20px;">Aucune campagne active pour le moment</p>
    <RouterLink to="/gerant/campaigns" class="btn btn-primary">Voir mes campagnes</RouterLink>
  </div> -->
</div>
</template>

