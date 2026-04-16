<script setup>
import { computed, onMounted } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { useAdminStore } from '@/stores/admin'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

const admin = useAdminStore()

const formatCurrency = (value) => new Intl.NumberFormat('fr-FR').format(value || 0)
const formatDate = (value) => new Date(value).toLocaleDateString('fr-FR')

const campaignById = computed(() => {
  const index = {}
  for (const campaign of admin.campaigns) {
    index[campaign._id] = campaign
  }
  return index
})

const totalRevenue = computed(() =>
  admin.sales.reduce((sum, sale) => sum + (sale.totalRevenue || 0), 0)
)

const totalAnimalsSold = computed(() =>
  admin.sales.reduce((sum, sale) => sum + (sale.animalsSold || 0), 0)
)

const pendingAmount = computed(() => {
  return admin.sales
    .filter((sale) => (sale.notes || '').toLowerCase().includes('attente'))
    .reduce((sum, sale) => sum + (sale.totalRevenue || 0), 0)
})

const monthlySeries = computed(() => {
  const buckets = {}
  for (const sale of admin.sales) {
    const date = new Date(sale.saleDate || sale.createdAt)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    if (!buckets[key]) {
      buckets[key] = 0
    }
    buckets[key] += sale.totalRevenue || 0
  }

  return Object.entries(buckets)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, amount]) => ({
      label: key,
      amount
    }))
})

const salesChartData = computed(() => ({
  labels: monthlySeries.value.map((m) => m.label),
  datasets: [
    {
      label: 'Revenus ventes',
      data: monthlySeries.value.map((m) => m.amount),
      borderColor: '#2D6A4F',
      backgroundColor: 'rgba(45, 106, 79, 0.2)',
      fill: true,
      tension: 0.3
    }
  ]
}))

const salesChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' }
  },
  scales: {
    y: {
      ticks: {
        callback: (value) => `${Math.round(value / 1000)}k`
      }
    }
  }
}

onMounted(async () => {
  await Promise.all([admin.fetchSales(), admin.fetchCampaigns()])
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-[var(--text)]">Ventes globales</h1>
        <p class="text-[var(--soft)]">Historique de toutes les ventes de la ferme</p>
      </div>
    </div>

    <div class="stats-grid">
      <div class="card p-6">
        <div class="text-[var(--soft)] text-xs font-bold uppercase tracking-wider mb-2">Total encaissé</div>
        <div class="text-2xl font-bold text-[var(--success)]">{{ formatCurrency(totalRevenue) }} F</div>
        <div class="text-[var(--soft)] text-[10px] mt-1 font-bold">FCFA · Réel</div>
      </div>
      <div class="card p-6">
        <div class="text-[var(--soft)] text-xs font-bold uppercase tracking-wider mb-2">En attente paiement</div>
        <div class="text-2xl font-bold text-[var(--warn)]">{{ formatCurrency(pendingAmount) }} F</div>
        <div class="text-[var(--soft)] text-[10px] mt-1 font-bold">FCFA · Créances</div>
      </div>
      <div class="card p-6">
        <div class="text-[var(--soft)] text-xs font-bold uppercase tracking-wider mb-2">Animaux vendus</div>
        <div class="text-2xl font-bold text-[var(--primary)] dark:text-[var(--accent)]">{{ totalAnimalsSold }}</div>
        <div class="text-[var(--soft)] text-[10px] mt-1 font-bold">Unités · Cumul</div>
      </div>
    </div>

    <div class="card">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-bold text-[var(--text)]">Évolution des revenus</h3>
      </div>
      <div class="h-64 relative">
        <Line :data="salesChartData" :options="salesChartOptions" />
      </div>
    </div>

    <div class="table-container mt-0">
      <div class="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Campagne</th>
              <th class="hide-mobile">Quantité</th>
              <th class="hide-mobile">Prix Unitaire</th>
              <th>Total</th>
              <th class="hide-mobile">Acheteur</th>
              <th>Paiement</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sale in admin.sales" :key="sale._id">
              <td class="text-sm text-[var(--soft)]">{{ formatDate(sale.saleDate || sale.createdAt) }}</td>
              <td class="font-bold text-[var(--text)]">{{ (typeof sale.campaign === 'object' ? sale.campaign?.name : campaignById[sale.campaign]?.name) || 'Campagne' }}</td>
              <td class="hide-mobile">{{ sale.animalsSold || 0 }} têtes</td>
              <td class="hide-mobile font-mono">{{ formatCurrency(sale.pricePerUnit) }} F</td>
              <td class="font-bold font-mono">{{ formatCurrency(sale.totalRevenue) }} F</td>
              <td class="hide-mobile">{{ sale.buyer || '-' }}</td>
              <td>
                <span
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  :class="(sale.notes || '').toLowerCase().includes('attente') ? 'bg-[var(--warn)]/10 text-[var(--warn)]' : 'bg-[var(--success)]/10 text-[var(--success)]'"
                >
                  {{ (sale.notes || '').toLowerCase().includes('attente') ? 'En attente' : 'Encaissé' }}
                </span>
              </td>
            </tr>
            <tr v-if="admin.sales.length === 0">
              <td colspan="7" class="text-center py-10 text-[var(--soft)] italic">Aucune vente enregistrée</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


