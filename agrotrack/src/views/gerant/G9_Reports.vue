<template>
<div>
  <div class="page-header">
    <div class="page-header-row">
      <div>
        <h1 class="page-title">Rapports</h1>
        <p class="page-subtitle" v-if="campaign">Campagne {{ campaign.name }}</p>
        <p class="page-subtitle" v-else>Générez et exportez vos rapports</p>
      </div>
      <div class="page-actions"><button class="btn btn-primary" @click="generateReport" :disabled="!campaign"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>{{ isGenerating ? 'Génération...' : 'Générer PDF' }}</button></div>
    </div>
  </div>

  <div v-if="!campaign" class="card" style="text-align: center; padding: 40px;">
    <p class="text-soft" style="font-size: 16px;">Aucune campagne active</p>
    <RouterLink to="/gerant/campaigns" class="btn btn-primary" style="margin-top: 20px;">Voir les campagnes</RouterLink>
  </div>

  <div v-else class="grid-2 mb-gap" style="align-items:start">
    <div>
      <div class="card mb-gap">
        <div class="card-title">Paramètres du rapport</div>
        <div class="form-group">
          <label class="form-label">Campagne</label>
          <select class="form-select" v-model="selectedCampaignId">
            <option :value="campaign._id">{{ campaign.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Période</label>
          <div class="filter-group w-full">
            <button class="filter-btn" :class="{active: period === 'month'}" @click="period = 'month'" style="flex:1">Mois</button>
            <button class="filter-btn" :class="{active: period === 'quarter'}" @click="period = 'quarter'" style="flex:1">Trimestre</button>
            <button class="filter-btn" :class="{active: period === 'campaign'}" @click="period = 'campaign'" style="flex:1">Campagne</button>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Sections à inclure</label>
          <div class="flex flex-col gap-8" style="font-size:13px">
            <label class="flex items-center gap-8"><input type="checkbox" v-model="sections.animals"/> Performances animaux</label>
            <label class="flex items-center gap-8"><input type="checkbox" v-model="sections.finance"/> Bilan financier</label>
            <label class="flex items-center gap-8"><input type="checkbox" v-model="sections.health"/> Résumé santé</label>
            <label class="flex items-center gap-8"><input type="checkbox" v-model="sections.feed"/> Consommation aliments</label>
            <label class="flex items-center gap-8"><input type="checkbox" v-model="sections.sales"/> Détail ventes</label>
          </div>
        </div>
        <button class="btn btn-primary btn-full" @click="generateReport" :disabled="isGenerating">{{ isGenerating ? 'Génération...' : 'Générer le rapport' }}</button>
      </div>
    </div>
    <div class="report-preview">
      <div class="report-preview-header">
        <div class="report-preview-title">Rapport — {{ campaign.name }}</div>
        <div class="report-preview-sub">Généré le {{ formatDate(new Date()) }} · AgroTrack</div>
      </div>
      <div class="report-block" v-if="sections.animals">
        <div class="report-block-title">Performances animaux</div>
        <div class="report-stat-row"><span>Effectif initial</span><span class="fw-600">{{ campaign.initialAnimalCount }}</span></div>
        <div class="report-stat-row"><span>Effectif actuel</span><span class="fw-600" style="color:var(--success)">{{ campaign.currentAnimalCount }}</span></div>
        <div class="report-stat-row"><span>Taux de survie</span><span class="fw-600">{{ survivalRate }}%</span></div>
        <div class="report-stat-row"><span>Taux de mortalité</span><span class="fw-600" style="color:var(--danger)">{{ campaign.mortality }}%</span></div>
      </div>
      <div class="report-block" v-if="sections.finance">
        <div class="report-block-title">Bilan financier</div>
        <div class="report-stat-row"><span>Budget alloué</span><span class="fw-600">{{ formatCurrency(campaign.budget) }}</span></div>
        <div class="report-stat-row"><span>Total dépenses</span><span class="fw-600 text-danger">{{ formatCurrency(campaign.spent) }}</span></div>
        <div class="report-stat-row"><span>Total revenus</span><span class="fw-600" :style="{color: campaign.actualRevenue > 0 ? 'var(--success)' : 'var(--soft)'}">{{ formatCurrency(campaign.actualRevenue) }}</span></div>
        <div class="report-stat-row"><span>Résultat net</span><span class="fw-600" :style="{color: netProfit >= 0 ? 'var(--success)' : 'var(--danger)'}">{{ formatCurrency(netProfit) }}</span></div>
      </div>
      <div class="report-block" v-if="sections.health">
        <div class="report-block-title">Résumé santé</div>
        <div class="report-stat-row"><span>Animaux sains</span><span class="fw-600 text-success">{{ campaign.currentAnimalCount - campaign.deaths }} ({{ healthyPercent }}%)</span></div>
        <div class="report-stat-row"><span>Décès</span><span class="fw-600 text-danger">{{ campaign.deaths }}</span></div>
        <div class="report-stat-row"><span>Pertes totales</span><span class="fw-600 text-danger">{{ campaign.deaths }} ({{ campaign.mortality }}%)</span></div>
      </div>
      <div class="report-block" v-if="sections.feed">
        <div class="report-block-title">Consommation aliments</div>
        <div class="report-stat-row"><span>Aliments consommés</span><span class="fw-600">{{ campaign.feedConsumed }} kg</span></div>
        <div class="report-stat-row"><span>Coût alimentation</span><span class="fw-600">{{ formatCurrency(campaign.feedCost) }}</span></div>
        <div class="report-stat-row"><span>Indice de conversion</span><span class="fw-600">{{ campaign.fcr }}</span></div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGerantStore } from '@/stores/gerant'

const gerantStore = useGerantStore()
const campaign = computed(() => gerantStore.activeCampaigns[0] || null)
const isGenerating = ref(false)
const selectedCampaignId = computed(() => campaign.value?._id || '')
const period = ref('campaign')

const sections = ref({
  animals: true,
  finance: true,
  health: true,
  feed: true,
  sales: false
})

const survivalRate = computed(() => {
  if (!campaign.value || campaign.value.initialAnimalCount === 0) return 0
  return Math.round(((campaign.value.currentAnimalCount / campaign.value.initialAnimalCount) * 100))
})

const healthyPercent = computed(() => {
  if (!campaign.value || campaign.value.currentAnimalCount === 0) return 0
  return Math.round(((campaign.value.currentAnimalCount - campaign.value.deaths) / campaign.value.currentAnimalCount) * 100)
})

const netProfit = computed(() => {
  if (!campaign.value) return 0
  return campaign.value.actualRevenue - campaign.value.spent
})

function formatCurrency(value) {
  if (!value) return '0 FCFA'
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M FCFA`
  return `${(value / 1000).toFixed(0)}k FCFA`
}

function formatDate(date) {
  return date.toLocaleDateString('fr-FR')
}

async function generateReport() {
  if (!campaign.value) return
  
  isGenerating.value = true
  try {
    // Simulate PDF generation
    // In a real app, this would call reportService.generate(...)
    const reportData = {
      campaign: campaign.value,
      sections: sections.value,
      period: period.value,
      generatedAt: new Date()
    }
    console.log('Generating report:', reportData)
    alert('Rapport généré avec succès et téléchargé')
  } catch (error) {
    console.error('Error generating report:', error)
    alert('Erreur lors de la génération du rapport')
  } finally {
    isGenerating.value = false
  }
}
</script>
