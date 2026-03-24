<template>
<div>
  <div class="page-header">
    <div class="page-header-row">
      <div><h1 class="page-title">Mes Campagnes</h1><p class="page-subtitle">Gérez vos campagnes agricoles</p></div>
      <div class="page-actions">
        <button class="btn btn-primary" @click="showModal=true">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nouvelle campagne
        </button>
      </div>
    </div>
  </div>

  <div class="filters-bar">
    <div class="filter-group">
      <button v-for="status in ['Toutes', 'En cours', 'Terminée', 'Préparation']" :key="status" 
              class="filter-btn" :class="{active: activeFilter === status}" @click="activeFilter = status">
        {{ status }}
      </button>
    </div>
    <select class="filter-select" v-model="selectedAnimalType">
      <option value="">Tous types d'animaux</option>
      <option value="Volaille">Volaille</option>
      <option value="Bétail">Bétail</option>
      <option value="Pisciculture">Pisciculture</option>
    </select>
  </div>

  <div v-if="loading" class="text-center p-20">
    <p>Chargement des campagnes...</p>
  </div>

  <div v-else-if="filteredCampaigns.length === 0" class="text-center p-20">
    <p class="text-soft">Aucune campagne trouvée</p>
  </div>

  <div v-else class="campaign-cards">
    <div class="campaign-card" v-for="campaign in filteredCampaigns" :key="campaign._id || campaign.id">
      <div class="campaign-card-header">
        <div>
          <div class="campaign-card-name">{{ campaign.name }}</div>
          <div class="flex gap-8 mb-12">
            <span class="badge" :class="getAnimalTypeClass(campaign.animalType)">{{ campaign.animalType }}</span>
            <span class="badge" :class="getStatusClass(campaign.status)">{{ campaign.status }}</span>
          </div>
        </div>
      </div>
      <div class="campaign-card-meta">
        <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Démarré le {{ formatDate(campaign.startDate) }} · 
        <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        {{ getDaysRemaining(campaign.startDate) }} jours
      </div>
      <div class="progress-wrap">
        <div class="progress-header">
          <span>Animaux</span>
          <span>{{ campaign.currentAnimalCount }}/{{ campaign.initialAnimalCount }} ({{ getAnimalPercentage(campaign) }}%)</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill fill-green" :style="{width: getAnimalPercentage(campaign) + '%'}"></div>
        </div>
      </div>
      <div class="progress-wrap">
        <div class="progress-header">
          <span>Budget</span>
          <span>{{ formatCurrency(campaign.spent) }}/{{ formatCurrency(campaign.budget) }} ({{ getBudgetPercentage(campaign) }}%)</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill fill-yellow" :style="{width: getBudgetPercentage(campaign) + '%'}"></div>
        </div>
      </div>
      <div class="campaign-card-actions">
        <RouterLink :to="'/gerant/campaigns/' + (campaign._id || campaign.id)" class="btn btn-primary btn-sm">Voir détail</RouterLink>
        <button class="btn btn-outline btn-sm">Modifier</button>
      </div>
    </div>
  </div>

  <ModalNewCampaign :open="showModal" @close="handleModalClose"/>
</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGerantStore } from '@/stores/gerant'
import ModalNewCampaign from '@/components/common/ModalNewCampaign.vue'

const gerantStore = useGerantStore()
const showModal = ref(false)
const activeFilter = ref('Toutes')
const selectedAnimalType = ref('')
const loading = ref(false)

onMounted(async () => {
  await loadData()
})

async function loadData() {
  loading.value = true
  try {
    await gerantStore.fetchGerantFarms()
    await gerantStore.fetchGerantCampaigns()
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  } finally {
    loading.value = false
  }
}

const filteredCampaigns = computed(() => {
  let filtered = gerantStore.campaigns

  if (activeFilter.value !== 'Toutes') {
    filtered = filtered.filter(c => c.status === activeFilter.value)
  }

  if (selectedAnimalType.value) {
    filtered = filtered.filter(c => c.animalType === selectedAnimalType.value)
  }

  return filtered
})

function formatDate(date) {
  if (!date) return '-'
  const d = new Date(date)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

function formatCurrency(value) {
  if (!value) return '0 FCFA'
  return `${(value / 1000).toFixed(0)}k FCFA`
}

function getDaysRemaining(startDate) {
  if (!startDate) return 0
  const start = new Date(startDate)
  const today = new Date()
  const diffTime = start.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

function getAnimalPercentage(campaign) {
  if (!campaign.initialAnimalCount) return 0
  return Math.round((campaign.currentAnimalCount / campaign.initialAnimalCount) * 100)
}

function getBudgetPercentage(campaign) {
  if (!campaign.budget) return 0
  return Math.round((campaign.spent / campaign.budget) * 100)
}

function getAnimalTypeClass(animalType) {
  const classes = {
    'Volaille': 'badge-vol',
    'Bétail': 'badge-bet',
    'Pisciculture': 'badge-pis'
  }
  return classes[animalType] || ''
}

function getStatusClass(status) {
  const classes = {
    'En cours': 'badge-encours',
    'Terminée': 'badge-terminee',
    'Préparation': 'badge-prep'
  }
  return classes[status] || ''
}

async function handleModalClose() {
  showModal.value = false
  await loadData()
}
</script>

