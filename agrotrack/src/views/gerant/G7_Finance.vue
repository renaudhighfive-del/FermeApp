<script setup>
import { ref, computed, onMounted,watch } from 'vue'
import { useGerantStore } from '@/stores/gerant'
import {transactionService } from '@/services/api'
import ModalNewTransaction from '@/components/common/ModalNewTransaction.vue'

const gerantStore = useGerantStore()
const activeCampaigns = computed(() => gerantStore.activeCampaigns)
const selectedCampaignId = ref('')
const loading = ref(false)

const showTransactionModal = ref(false)
const transactionType = ref('Dépense')

const campaign = computed(() => {
  if (selectedCampaignId.value) {
    return activeCampaigns.value.find(c => (c._id || c.id) === selectedCampaignId.value) || activeCampaigns.value[0] || null
  }
  return activeCampaigns.value[0] || null
})

const transactions = ref([])

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

    await loadTransactions()
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  } finally {
    loading.value = false
  }
}

watch(selectedCampaignId, async () => {
  await loadTransactions()
})

async function loadTransactions() {
  if (campaign.value) {
    try {
      const res = await transactionService.getAll({ 
        campaign: campaign.value._id || campaign.value.id, 
        limit: 10 
      })
      transactions.value = res.data.transactions || []
    } catch (err) {
      console.error('Erreur chargement transactions:', err)
    }
  }
}

function openModal(type) {
  transactionType.value = type
  showTransactionModal.value = true
}

const estimatedProfit = computed(() => {
  if (!campaign.value) return 0
  return campaign.value.actualRevenue - campaign.value.spent
})

function formatDate(date) {
  if (!date) return '-'
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR')
}

function formatCurrency(value) {
  if (!value) return '0 FCFA'
  return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA'
}
</script>
<template>
<div>
  <div class="page-header">
    <div class="page-header-row">
      <div>
        <h1 class="page-title">Finance</h1>
        <p class="page-subtitle" v-if="campaign">{{ campaign.name }} · {{ campaign.status }}</p>
        <p class="page-subtitle" v-else>Aucune campagne active</p>
      </div>
      <div class="page-actions">
        <select v-if="activeCampaigns.length > 1" class="filter-select" v-model="selectedCampaignId" style="margin-right: 10px;">
          <option v-for="c in activeCampaigns" :key="c._id || c.id" :value="c._id || c.id">
            {{ c.name }}
          </option>
        </select>
        <button class="btn btn-primary btn-sm"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Exporter PDF</button>
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
    <div class="card mb-gap">
      <div class="finance-result">
        <div style="font-size:13px;color:var(--soft);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.08em">Résultat net estimé</div>
        <div class="finance-result-val" :style="{color: estimatedProfit >= 0 ? 'var(--success)' : 'var(--danger)'}">{{ formatCurrency(estimatedProfit) }}</div>
        <div class="finance-result-sub">Campagne {{ campaign.status }} · Revenus: {{ formatCurrency(campaign.actualRevenue) }}</div>
      </div>
    </div>

    <div class="dep-rev-grid mb-gap">
      <div class="dep-card">
        <div class="dep-rev-title" style="color:var(--danger)">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
          Dépenses
        </div>
        <div class="dep-rev-total text-danger">{{ formatCurrency(campaign.spent) }}</div>
        <div class="line-item"><div class="line-item-left"><svg width="14" height="14" fill="none" stroke="#E8813A" stroke-width="1.5" viewBox="0 0 24 24"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>Alimentation</div><div class="line-item-val">{{ formatCurrency(campaign.feedCost) }}</div></div>
        <div class="line-item"><div class="line-item-left"><svg width="14" height="14" fill="none" stroke="#D62828" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>Autres dépenses</div><div class="line-item-val">{{ formatCurrency(campaign.spent - campaign.feedCost) }}</div></div>
        <button class="btn btn-danger-outline btn-sm w-full" style="margin-top:14px;justify-content:center" @click="openModal('Dépense')">+ Ajouter dépense</button>
      </div>

      <div class="rev-card">
        <div class="dep-rev-title" style="color:var(--success)">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
          Revenus
        </div>
        <div class="dep-rev-total" :style="{color: campaign.actualRevenue > 0 ? 'var(--success)' : 'var(--soft)'}">{{ formatCurrency(campaign.actualRevenue) }}</div>
        <div v-if="campaign.actualRevenue === 0" class="empty-state">
          <svg width="40" height="40" fill="none" stroke="#E8D9C5" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <p>Aucune vente enregistrée</p>
        </div>
        <div v-else class="line-item"><div class="line-item-left">Ventes réalisées</div><div class="line-item-val">{{ formatCurrency(campaign.actualRevenue) }}</div></div>
        <button class="btn btn-success-outline btn-sm w-full" style="margin-top:14px;justify-content:center" @click="openModal('Revenu')">+ Enregistrer vente</button>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Transactions récentes</div>
      <div v-if="transactions.length === 0" class="empty-state" style="padding: 20px;">
        <p class="text-soft">Aucune transaction enregistrée pour cette campagne</p>
      </div>
      <div v-else class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Catégorie</th>
              <th>Montant</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in transactions" :key="t._id || t.id">
              <td class="text-soft text-sm">{{ formatDate(t.date) }}</td>
              <td>
                <span class="badge" :class="t.type === 'Revenu' ? 'badge-sain' : 'badge-urgent'">
                  {{ t.type }}
                </span>
              </td>
              <td class="fw-600">{{ t.category }}</td>
              <td :class="t.type === 'Revenu' ? 'text-success' : 'text-danger'">
                {{ t.type === 'Revenu' ? '+' : '-' }} {{ formatCurrency(t.amount) }}
              </td>
              <td class="text-soft text-sm">{{ t.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card" style="margin-top: 20px;">
      <div class="card-title">Résumé financier</div>
      <div style="font-size:13px;line-height:2;color:var(--soft)">
        <p><strong>Budget initial:</strong> {{ formatCurrency(campaign.budget) }}</p>
        <p><strong>Total dépensé:</strong> {{ formatCurrency(campaign.spent) }}</p>
        <p><strong>Budget restant:</strong> {{ formatCurrency(campaign.budget - campaign.spent) }}</p>
        <p><strong>Revenus:</strong> {{ formatCurrency(campaign.actualRevenue) }}</p>
        <p><strong>Résultat net:</strong> <span :style="{color: estimatedProfit >= 0 ? 'var(--success)' : 'var(--danger)'}"><strong>{{ formatCurrency(estimatedProfit) }}</strong></span></p>
      </div>
    </div>
  </div>

  <ModalNewTransaction 
    :open="showTransactionModal" 
    :campaign="campaign" 
    :type="transactionType" 
    @close="showTransactionModal = false"
    @created="loadData"
  />
</div>
</template>


