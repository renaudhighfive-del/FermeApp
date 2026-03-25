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
        <button class="btn btn-outline btn-sm" @click="showOrderModal = true">+ Commander</button>
        <button class="btn btn-primary btn-sm" @click="showDistributionModal = true">+ Distribution</button>
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
      <div class="kpi-card"><div class="kpi-label">Consommation/jour</div><div class="kpi-value">{{ (campaign.feedConsumed / Math.max(1, getDaysRemaining(campaign.startDate)) || 0).toFixed(1) }} kg</div></div>
      <div class="kpi-card"><div class="kpi-label">Budget stock</div><div class="kpi-value">{{ formatCurrency(campaign.feedCost) }}</div></div>
    </div>

    <!-- Alertes de stock -->
    <div v-if="lowStockItems.length > 0" class="mb-gap">
      <div v-for="item in lowStockItems" :key="item._id" class="alert-card alert-danger mb-12">
        <svg width="18" height="18" fill="none" stroke="#D62828" stroke-width="1.5" viewBox="0 0 24 24" style="flex-shrink:0;margin-top:2px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <div class="alert-content">
          <div class="alert-title">Stock critique: {{ item.name }}</div>
          <div class="alert-desc">Il ne reste que {{ item.quantity }} kg en stock (Seuil: {{ item.reorderLevel }} kg).</div>
        </div>
        <button class="btn btn-outline btn-sm" @click="showOrderModal = true">Commander</button>
      </div>
    </div>

    <div v-else class="alert-card alert-success mb-gap">
      <svg width="18" height="18" fill="none" stroke="#2D6A4F" stroke-width="1.5" viewBox="0 0 24 24" style="flex-shrink:0;margin-top:2px"><polyline points="20 6 9 17 4 12"/></svg>
      <div class="alert-content">
        <div class="alert-title">Stocks optimaux</div>
        <div class="alert-desc">Tous les niveaux d'aliments sont au-dessus des seuils d'alerte.</div>
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

  <!-- Modals -->
  <ModalFoodDistribution 
    v-if="showDistributionModal"
    :open="showDistributionModal"
    :campaign="campaign"
    @close="showDistributionModal = false"
    @success="loadData"
  />

  <ModalFoodOrder 
    v-if="showOrderModal"
    :open="showOrderModal"
    :campaign="campaign"
    @close="showOrderModal = false"
    @success="loadData"
  />
</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGerantStore } from '@/stores/gerant'
import { productService } from '@/services/api'
import { formatCurrency, getDaysRemaining } from '@/utils/formatters'
import ModalFoodDistribution from '@/components/common/ModalFoodDistribution.vue'
import ModalFoodOrder from '@/components/common/ModalFoodOrder.vue'

const gerantStore = useGerantStore()
const activeCampaigns = computed(() => gerantStore.activeCampaigns)
const selectedCampaignId = ref('')
const loading = ref(false)
const showDistributionModal = ref(false)
const showOrderModal = ref(false)
const lowStockItems = ref([])

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

    if (campaign.value) {
      await fetchStockAlerts()
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  } finally {
    loading.value = false
  }
}

async function fetchStockAlerts() {
  try {
    const farmId = campaign.value.farm._id || campaign.value.farm
    const res = await productService.getAll({ farm: farmId, category: 'Aliment' })
    const products = res.data.products || res.data || []
    lowStockItems.value = products.filter(p => p.quantity <= p.reorderLevel)
  } catch (err) {
    console.error('Erreur alertes stock:', err)
  }
}
</script>
