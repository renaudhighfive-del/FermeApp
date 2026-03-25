<template>
<div>
  <div class="page-header">
    <div class="page-header-row">
      <div>
        <h1 class="page-title">Alimentation</h1>
        <p class="page-subtitle" v-if="campaign">{{ campaign.name }} · Gestion des stocks et distributions</p>
        <p class="page-subtitle" v-else>Aucune campagne active</p>
      </div>
      <div class="page-actions">
        <select v-if="activeCampaigns.length > 1" class="filter-select" v-model="selectedCampaignId" style="margin-right: 10px;">
          <option v-for="c in activeCampaigns" :key="c._id || c.id" :value="c._id || c.id">
            {{ c.name }}
          </option>
        </select>
        <button class="btn btn-outline btn-sm">+ Commander</button>
        <button class="btn btn-primary btn-sm">+ Distribution</button>
      </div>
    </div>
  </div>

  <div v-if="loading" class="card" style="text-align: center; padding: 40px;">
    <p class="text-soft">Chargement...</p>
  </div>

  <div v-else-if="!campaign" class="card" style="text-align: center; padding: 40px;">
    <p class="text-soft" style="font-size: 16px;">Aucune campagne active</p>
    <RouterLink to="/gerant/campaigns" class="btn btn-primary" style="margin-top: 20px;">Voir les campagnes</RouterLink>
  </div>

  <div v-else>
    <div class="kpi-grid mb-gap">
      <div class="kpi-card"><div class="kpi-label">Consommation aliments</div><div class="kpi-value" style="color:var(--warn)">{{ campaign.feedConsumed }} kg</div><div class="kpi-sub warn">FCR: {{ campaign.fcr }}</div></div>
      <div class="kpi-card"><div class="kpi-label">Coût alimentation</div><div class="kpi-value">{{ formatCurrency(campaign.feedCost) }}</div></div>
      <div class="kpi-card"><div class="kpi-label">Consommation/jour</div><div class="kpi-value">{{ (campaign.feedConsumed / getDaysRemaining() || 0).toFixed(1) }} kg</div></div>
      <div class="kpi-card"><div class="kpi-label">Budget stock</div><div class="kpi-value">{{ formatCurrency(campaign.feedCost) }}</div></div>
    </div>

    <div class="alert-card alert-warning mb-gap">
      <svg width="18" height="18" fill="none" stroke="#E07B39" stroke-width="1.5" viewBox="0 0 24 24" style="flex-shrink:0;margin-top:2px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
      <div class="alert-content">
        <div class="alert-title">Informations sur l'alimentation</div>
        <div class="alert-desc">Suivi de la consommation et du coût des aliments pour cette campagne</div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Résumé alimentation</div>
      <div style="font-size:13px;line-height:2;color:var(--soft)">
        <p><strong>Campagne:</strong> {{ campaign.name }}</p>
        <p><strong>Aliments consommés:</strong> {{ campaign.feedConsumed }} kg</p>
        <p><strong>Coût total:</strong> {{ formatCurrency(campaign.feedCost) }}</p>
        <p><strong>FCR (Food Conversion Ratio):</strong> {{ campaign.fcr }}</p>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGerantStore } from '@/stores/gerant'

const gerantStore = useGerantStore()
const activeCampaigns = computed(() => gerantStore.activeCampaigns)
const selectedCampaignId = ref('')
const loading = ref(false)

const campaign = computed(() => {
  if (selectedCampaignId.value) {
    return activeCampaigns.value.find(c => (c._id || c.id) === selectedCampaignId.value) || activeCampaigns.value[0] || null
  }
  return activeCampaigns.value[0] || null
})

onMounted(async () => {
  await loadData()
})

async function loadData() {
  loading.value = true
  try {
    await gerantStore.fetchGerantFarms()
    await gerantStore.fetchGerantCampaigns()
    
    if (activeCampaigns.value.length > 0 && !selectedCampaignId.value) {
      selectedCampaignId.value = activeCampaigns.value[0]._id || activeCampaigns.value[0].id
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  } finally {
    loading.value = false
  }
}

function formatCurrency(value) {
  if (!value) return '0 FCFA'
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M FCFA`
  return `${(value / 1000).toFixed(0)}k FCFA`
}

function getDaysRemaining() {
  if (!campaign.value?.startDate) return 1
  const start = new Date(campaign.value.startDate)
  const today = new Date()
  const diffTime = today.getTime() - start.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(1, diffDays)
}
</script>
