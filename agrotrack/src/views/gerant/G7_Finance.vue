<template>
<div>
  <div class="page-header">
    <div class="page-header-row">
      <div>
        <h1 class="page-title">Finance</h1>
        <p class="page-subtitle" v-if="campaign">{{ campaign.name }} · {{ campaign.status }}</p>
        <p class="page-subtitle" v-else>Aucune campagne active</p>
      </div>
      <div class="page-actions"><button class="btn btn-primary btn-sm"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Exporter PDF</button></div>
    </div>
  </div>

  <div v-if="!campaign" class="card" style="text-align: center; padding: 40px;">
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
        <button class="btn btn-danger-outline btn-sm w-full" style="margin-top:14px;justify-content:center">+ Ajouter dépense</button>
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
        <button class="btn btn-success-outline btn-sm w-full" style="margin-top:14px;justify-content:center">+ Enregistrer vente</button>
      </div>
    </div>

    <div class="card">
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
</div>
</template>

<script setup>
import { computed } from 'vue'
import { useGerantStore } from '@/stores/gerant'

const gerantStore = useGerantStore()
const campaign = computed(() => gerantStore.activeCampaigns[0] || null)

const estimatedProfit = computed(() => {
  if (!campaign.value) return 0
  return campaign.value.actualRevenue - campaign.value.spent
})

function formatCurrency(value) {
  if (!value) return '0 FCFA'
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M FCFA`
  return `${(value / 1000).toFixed(0)}k FCFA`
}
</script>
