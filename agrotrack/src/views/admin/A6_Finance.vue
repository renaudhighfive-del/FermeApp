<template>
<div id="finance-report">
  <div class="page-header">
    <div class="page-header-row">
      <div><h1 class="page-title">Finance globale</h1><p class="page-subtitle">Bilan financier de toutes les campagnes</p></div>
      <div class="page-actions">
        <button @click="exportToPDF" class="btn btn-primary btn-sm" :disabled="isExporting">
          <svg v-if="!isExporting" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span v-else class="spinner-sm"></span>
          {{ isExporting ? 'Exportation...' : 'Exporter PDF' }}
        </button>
      </div>
    </div>
  </div>

  <div v-if="admin.loading" class="loading-state">
    <div class="spinner"></div>
    <p>Chargement des données financières...</p>
  </div>

  <template v-else>
    <div class="kpi-grid mb-gap">
      <div class="kpi-card">
        <div class="kpi-label">Total Dépenses</div>
        <div class="kpi-value text-danger">{{ formatCurrency(admin.totalExpenses) }}</div>
        <div class="kpi-sub">FCFA</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Total Revenus</div>
        <div class="kpi-value" style="color:var(--success)">{{ formatCurrency(admin.totalRevenue) }}</div>
        <div class="kpi-sub">FCFA</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Bénéfice Net</div>
        <div class="kpi-value" :class="netProfit >= 0 ? 'text-success' : 'text-danger'">
          {{ netProfit >= 0 ? '+' : '' }}{{ formatCurrency(netProfit) }}
        </div>
        <div class="kpi-sub">FCFA · Toutes campagnes</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Campagnes rentables</div>
        <div class="kpi-value" style="color:var(--success)">{{ profitableCampaignsCount }}/{{ finishedCampaignsCount }}</div>
        <div class="kpi-sub">terminées</div>
      </div>
    </div>

    <div class="card mb-gap">
      <div class="card-title">Bilan par campagne</div>
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Campagne</th>
              <th>Département</th>
              <th>Statut</th>
              <th>Dépenses</th>
              <th>Revenus</th>
              <th>Bénéfice net</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="campaign in admin.campaigns" :key="campaign._id">
              <td class="fw-600">{{ campaign.name }}</td>
              <td><span class="badge" :class="getDeptClass(campaign.animalType)">{{ campaign.animalType }}</span></td>
              <td><span class="badge" :class="getStatusClass(campaign.status)">{{ campaign.status }}</span></td>
              <td>{{ formatCurrency(campaign.spent || 0) }} FCFA</td>
              <td>{{ formatCurrency(campaign.actualRevenue || 0) }} FCFA</td>
              <td :class="(campaign.actualRevenue - campaign.spent) >= 0 ? 'text-success' : 'text-danger'" class="fw-600">
                {{ (campaign.actualRevenue - campaign.spent) >= 0 ? '+' : '' }}{{ formatCurrency(campaign.actualRevenue - campaign.spent) }}
              </td>
            </tr>
            <tr v-if="admin.campaigns.length === 0">
              <td colspan="6" class="text-center py-20 text-soft">Aucune campagne trouvée</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Évolution revenus / dépenses par mois</div>
      <div class="chart-legend">
        <div class="chart-legend-item"><div class="legend-box" style="background:var(--primary)"></div>Dépenses</div>
        <div class="chart-legend-item"><div class="legend-box" style="background:var(--success)"></div>Revenus</div>
      </div>
      
      <div class="chart-container">
        <svg width="100%" height="200" viewBox="0 0 520 200" preserveAspectRatio="xMidYMid meet">
          <!-- Axes -->
          <line x1="40" y1="20" x2="40" y2="160" stroke="#E8D9C5" stroke-width="0.5"/>
          <line x1="40" y1="160" x2="520" y2="160" stroke="#E8D9C5" stroke-width="0.5"/>
          
          <!-- Grid lines -->
          <line x1="40" y1="60" x2="520" y2="60" stroke="#E8D9C5" stroke-width="0.5" stroke-dasharray="3"/>
          <line x1="40" y1="110" x2="520" y2="110" stroke="#E8D9C5" stroke-width="0.5" stroke-dasharray="3"/>
          
          <!-- Bars and Labels -->
          <template v-for="(month, index) in chartData" :key="index">
            <!-- Expense bar -->
            <rect 
              :x="70 + (index * 110)" 
              :y="160 - (month.expenses / maxChartValue * 120)" 
              width="28" 
              :height="month.expenses / maxChartValue * 120" 
              fill="#3D2B1F" 
              rx="3"
            />
            <!-- Revenue bar -->
            <rect 
              :x="102 + (index * 110)" 
              :y="160 - (month.revenue / maxChartValue * 120)" 
              width="28" 
              :height="month.revenue / maxChartValue * 120" 
              fill="#2D6A4F" 
              rx="3"
            />
            <!-- Month label -->
            <text 
              :x="100 + (index * 110)" 
              y="180" 
              text-anchor="middle" 
              font-size="10" 
              fill="#7A6652"
            >{{ month.name }}</text>
          </template>
        </svg>
      </div>
    </div>
  </template>
</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import html2pdf from 'html2pdf.js'

const admin = useAdminStore()
const isExporting = ref(false)

// Formatting
const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-FR').format(value)
}

// Computed stats
const netProfit = computed(() => admin.totalRevenue - admin.totalExpenses)

const finishedCampaigns = computed(() => 
  admin.campaigns.filter(c => c.status === 'Terminée')
)

const finishedCampaignsCount = computed(() => finishedCampaigns.value.length)

const profitableCampaignsCount = computed(() => 
  finishedCampaigns.value.filter(c => (c.actualRevenue || 0) > (c.spent || 0)).length
)

// Chart Data Processing
const chartData = computed(() => {
  const months = ['Jan', 'Fév', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc']
  const now = new Date()
  const last4Months = []
  
  for (let i = 3; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthIndex = d.getMonth()
    const year = d.getFullYear()
    
    const monthlyTransactions = admin.transactions.filter(t => {
      const tDate = new Date(t.date)
      return tDate.getMonth() === monthIndex && tDate.getFullYear() === year
    })
    
    const revenue = monthlyTransactions
      .filter(t => t.type === 'Revenu')
      .reduce((sum, t) => sum + t.amount, 0)
      
    const expenses = monthlyTransactions
      .filter(t => t.type === 'Dépense')
      .reduce((sum, t) => sum + t.amount, 0)
      
    last4Months.push({
      name: months[monthIndex],
      revenue,
      expenses
    })
  }
  
  return last4Months
})

const maxChartValue = computed(() => {
  const allValues = chartData.value.flatMap(m => [m.revenue, m.expenses])
  const max = Math.max(...allValues, 1000000) // Default max if no data
  return max * 1.1 // Add 10% padding
})

// CSS Classes
const getDeptClass = (type) => {
  const map = {
    'Volaille': 'badge-vol',
    'Bétail': 'badge-bet',
    'Pisciculture': 'badge-pis'
  }
  return map[type] || ''
}

const getStatusClass = (status) => {
  const map = {
    'En cours': 'badge-encours',
    'Terminée': 'badge-terminee',
    'Préparation': 'badge-prep'
  }
  return map[status] || ''
}

// Actions
const exportToPDF = () => {
  isExporting.value = true
  const element = document.getElementById('finance-report')
  const opt = {
    margin: 10,
    filename: `Rapport_Finance_${new Date().toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }

  html2pdf().set(opt).from(element).save().then(() => {
    isExporting.value = false
  }).catch(err => {
    console.error('PDF Export Error:', err)
    isExporting.value = false
  })
}

onMounted(async () => {
  await Promise.all([
    admin.fetchCampaigns({ limit: 100 }),
    admin.fetchTransactions({ limit: 1000 })
  ])
})
</script>

<style scoped>
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  color: var(--soft);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.spinner-sm {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 8px;
  vertical-align: middle;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.chart-container {
  margin-top: 20px;
  overflow-x: auto;
}

.py-20 { padding-top: 20px; padding-bottom: 20px; }

@media print {
  .page-actions { display: none; }
}
</style>

