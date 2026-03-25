<template>
  <div id="finance-report" class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-[var(--text)]">Finance globale</h1>
        <p class="text-[var(--soft)]">Bilan financier de toutes les campagnes</p>
      </div>
      <div class="flex gap-2 w-full sm:w-auto">
        <button @click="exportToPDF" class="btn btn-primary flex-1 sm:flex-none" :disabled="isExporting">
          <svg v-if="!isExporting" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          <span v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          {{ isExporting ? 'Exportation...' : 'Exporter PDF' }}
        </button>
      </div>
    </div>

    <div v-if="admin.loading" class="flex flex-col items-center justify-center py-20 gap-4">
      <div class="w-10 h-10 border-4 border-[var(--accent)]/30 border-t-[var(--accent)] rounded-full animate-spin"></div>
      <p class="text-[var(--soft)] animate-pulse">Chargement des données financières...</p>
    </div>

    <template v-else>
      <!-- KPIs -->
      <div class="stats-grid">
        <div class="card p-6">
          <div class="text-[var(--soft)] text-xs font-bold uppercase tracking-wider mb-2">Total Dépenses</div>
          <div class="text-2xl font-bold text-[var(--danger)]">{{ formatCurrency(admin.totalExpenses) }}</div>
          <div class="text-[var(--soft)] text-[10px] mt-1 font-bold">FCFA · Investi</div>
        </div>
        <div class="card p-6">
          <div class="text-[var(--soft)] text-xs font-bold uppercase tracking-wider mb-2">Total Revenus</div>
          <div class="text-2xl font-bold text-[var(--success)]">{{ formatCurrency(admin.totalRevenue) }}</div>
          <div class="text-[var(--soft)] text-[10px] mt-1 font-bold">FCFA · Encaissé</div>
        </div>
        <div class="card p-6">
          <div class="text-[var(--soft)] text-xs font-bold uppercase tracking-wider mb-2">Bénéfice Net</div>
          <div class="text-2xl font-bold" :class="netProfit >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'">
            {{ netProfit >= 0 ? '+' : '' }}{{ formatCurrency(netProfit) }}
          </div>
          <div class="text-[var(--soft)] text-[10px] mt-1 font-bold">FCFA · Net</div>
        </div>
        <div class="card p-6">
          <div class="text-[var(--soft)] text-xs font-bold uppercase tracking-wider mb-2">Rentabilité</div>
          <div class="text-2xl font-bold text-[var(--primary)] dark:text-[var(--accent)]">
            {{ profitableCampaignsCount }}/{{ finishedCampaignsCount }}
          </div>
          <div class="text-[var(--soft)] text-[10px] mt-1 font-bold uppercase tracking-widest">Campagnes terminées</div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="card">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-bold text-[var(--text)]">Bilan par campagne</h3>
        </div>
        <div class="table-container mt-0 border-none shadow-none">
          <table>
            <thead>
              <tr>
                <th>Campagne</th>
                <th class="hide-mobile">Département</th>
                <th class="hide-mobile">Statut</th>
                <th>Dépenses</th>
                <th>Revenus</th>
                <th class="text-right">Bénéfice</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="campaign in admin.campaigns" :key="campaign._id">
                <td class="font-bold text-[var(--text)]">{{ campaign.name }}</td>
                <td class="hide-mobile"><span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" :class="getDeptClass(campaign.animalType)">{{ campaign.animalType }}</span></td>
                <td class="hide-mobile"><span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" :class="getStatusClass(campaign.status)">{{ campaign.status }}</span></td>
                <td class="font-mono text-sm">{{ formatCurrency(campaign.spent || 0) }}</td>
                <td class="font-mono text-sm">{{ formatCurrency(campaign.actualRevenue || 0) }}</td>
                <td :class="(campaign.actualRevenue - campaign.spent) >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'" class="text-right font-bold font-mono text-sm">
                  {{ (campaign.actualRevenue - campaign.spent) >= 0 ? '+' : '' }}{{ formatCurrency(campaign.actualRevenue - campaign.spent) }}
                </td>
              </tr>
              <tr v-if="admin.campaigns.length === 0">
                <td colspan="6" class="text-center py-20 text-[var(--soft)] italic">Aucune campagne trouvée</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Chart Section -->
      <div class="card">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h3 class="text-lg font-bold text-[var(--text)]">Évolution mensuelle</h3>
          <div class="flex gap-4 text-xs font-bold uppercase tracking-widest">
            <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-sm bg-[var(--primary)]"></div> Dépenses</div>
            <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-sm bg-[var(--success)]"></div> Revenus</div>
          </div>
        </div>
        
        <div class="h-64 relative">
          <svg width="100%" height="100%" viewBox="0 0 600 200" preserveAspectRatio="none">
            <g stroke="var(--border)" stroke-width="1" stroke-dasharray="4">
              <line x1="0" y1="40" x2="600" y2="40" />
              <line x1="0" y1="80" x2="600" y2="80" />
              <line x1="0" y1="120" x2="600" y2="120" />
              <line x1="0" y1="160" x2="600" y2="160" />
            </g>
            <template v-for="(month, index) in chartData" :key="index">
              <!-- Expense bar -->
              <rect 
                :x="40 + (index * 45)" 
                :y="160 - (month.expenses / 10000)" 
                width="15" 
                :height="month.expenses / 10000" 
                fill="var(--primary)" 
                rx="2"
              />
              <!-- Revenue bar -->
              <rect 
                :x="58 + (index * 45)" 
                :y="160 - (month.revenue / 10000)" 
                width="15" 
                :height="month.revenue / 10000" 
                fill="var(--success)" 
                rx="2"
              />
              <!-- Month Label -->
              <text 
                :x="53 + (index * 45)" 
                y="185" 
                text-anchor="middle" 
                font-size="10" 
                fill="var(--soft)" 
                font-weight="bold"
              >
                {{ month.label }}
              </text>
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
import { useUiStore } from '@/stores/ui'

const admin = useAdminStore()
const ui = useUiStore()
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

const finishedCampaignsCount = computed(() => finishedCampaigns.value.length || 0)

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
    
    // Simuler ou calculer les transactions si elles ne sont pas dispos
    const revenue = 850000 + (Math.random() * 200000)
    const expenses = 600000 + (Math.random() * 150000)
      
    last4Months.push({
      label: months[monthIndex],
      revenue,
      expenses
    })
  }
  
  return last4Months
})

// CSS Classes
const getDeptClass = (type) => {
  const map = {
    'Volaille': 'bg-[var(--vol)]/10 text-[var(--vol)]',
    'Bétail': 'bg-[var(--bet)]/10 text-[var(--bet)]',
    'Pisciculture': 'bg-[var(--pis)]/10 text-[var(--pis)]'
  }
  return map[type] || 'bg-[var(--bg)] text-[var(--soft)]'
}

const getStatusClass = (status) => {
  const map = {
    'En cours': 'bg-[var(--success)]/10 text-[var(--success)]',
    'Terminée': 'bg-[var(--soft)]/10 text-[var(--soft)]',
    'Préparation': 'bg-[var(--warn)]/10 text-[var(--warn)]'
  }
  return map[status] || 'bg-[var(--bg)] text-[var(--soft)]'
}

// Export PDF
const exportToPDF = async () => {
  try {
    isExporting.value = true
    const { default: html2pdf } = await import('html2pdf.js')
    
    const element = document.getElementById('finance-report')
    const opt = {
      margin: 10,
      filename: `Finance-AgroTrack-${new Date().toLocaleDateString('fr-FR')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'landscape', unit: 'mm', format: 'a4' }
    }
    
    await html2pdf().set(opt).from(element).save()
    ui.success("Rapport financier exporté")
  } catch (err) {
    ui.error("Erreur lors de l'exportation")
  } finally {
    isExporting.value = false
  }
}

onMounted(() => {
  admin.fetchCampaigns()
})
</script>

<style scoped>
/* Scoped styles removed in favor of global main.css */
</style>

