<template>
  <div class="space-y-6 p-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold">Santé & Alertes</h1>
        <p class="text-slate-600">{{ urgentAlerts.length }} alerte(s) urgente(s) - {{ totalAlerts }} au total</p>
      </div>
      <button 
        v-if="totalAlerts > 0"
        @click="resolveAllAlerts"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
      >
        Tout résoudre
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="admin.loading" class="flex justify-center items-center py-12">
      <div class="text-slate-600">
        <div class="inline-block animate-spin mr-2">⟳</div>
        Chargement des alertes...
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="admin.error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      {{ admin.error }}
    </div>

    <!-- Alerts Grid -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Urgent Alerts -->
      <div class="space-y-4">
        <div class="flex items-center gap-2 text-xl font-bold text-red-600 mb-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          </svg>
          Urgentes ({{ urgentAlerts.length }})
        </div>
        <div v-if="urgentAlerts.length === 0" class="text-gray-500 text-sm">
          Aucune alerte urgente
        </div>
        <div v-for="alert in urgentAlerts" :key="alert._id" class="bg-red-50 border-l-4 border-red-600 p-4 rounded">
          <div class="font-medium text-red-900">{{ alert.title }}</div>
          <div class="text-sm text-red-700 mt-1">{{ alert.campaign?.name || 'N/A' }}</div>
          <div class="text-sm text-gray-600 mt-2">{{ alert.description }}</div>
          <div class="text-xs text-gray-500 mt-2">{{ new Date(alert.date).toLocaleDateString('fr-FR') }}</div>
          <div class="flex gap-2 mt-3">
            <button 
              @click="openDetailsModal(alert)"
              class="text-sm px-3 py-1 text-green-600 hover:text-green-800 font-medium"
            >
              Voir Détails
            </button>
            <button 
              @click="confirmResolve(alert._id)"
              class="text-sm px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
            >
              Résoudre
            </button>
          </div>
        </div>
      </div>

      <!-- Warning Alerts -->
      <div class="space-y-4">
        <div class="flex items-center gap-2 text-xl font-bold text-yellow-600 mb-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Moyennes ({{ warningAlerts.length }})
        </div>
        <div v-if="warningAlerts.length === 0" class="text-gray-500 text-sm">
          Aucune alerte moyenne
        </div>
        <div v-for="alert in warningAlerts" :key="alert._id" class="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded">
          <div class="font-medium text-yellow-900">{{ alert.title }}</div>
          <div class="text-sm text-yellow-700 mt-1">{{ alert.campaign?.name || 'N/A' }}</div>
          <div class="text-sm text-gray-600 mt-2">{{ alert.description }}</div>
          <div class="text-xs text-gray-500 mt-2">{{ new Date(alert.date).toLocaleDateString('fr-FR') }}</div>
          <div class="flex gap-2 mt-3">
            <button 
              @click="openDetailsModal(alert)"
              class="text-sm px-3 py-1 text-green-600 hover:text-green-800 font-medium"
            >
              Voir Détails
            </button>
            <button 
              @click="confirmResolve(alert._id)"
              class="text-sm px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded"
            >
              Résoudre
            </button>
          </div>
        </div>
      </div>

      <!-- Info Alerts -->
      <div class="space-y-4">
        <div class="flex items-center gap-2 text-xl font-bold text-blue-600 mb-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          Informations ({{ infoAlerts.length }})
        </div>
        <div v-if="infoAlerts.length === 0" class="text-gray-500 text-sm">
          Aucune alerte d'information
        </div>
        <div v-for="alert in infoAlerts" :key="alert._id" class="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
          <div class="font-medium text-blue-900">{{ alert.title }}</div>
          <div class="text-sm text-blue-700 mt-1">{{ alert.campaign?.name || 'N/A' }}</div>
          <div class="text-sm text-gray-600 mt-2">{{ alert.description }}</div>
          <div class="text-xs text-gray-500 mt-2">{{ new Date(alert.date).toLocaleDateString('fr-FR') }}</div>
          <div class="flex gap-2 mt-3">
            <button 
              @click="openDetailsModal(alert)"
              class="text-sm px-3 py-1 text-green-600 hover:text-green-800 font-medium"
            >
              Voir Détails
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Détails Alerte -->
    <div v-if="showDetailsModal && selectedAlert" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl max-h-96 overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Détails de l'Alerte</h2>
          <button 
            @click="closeDetailsModal"
            class="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Titre</label>
            <p class="text-gray-900 font-medium">{{ selectedAlert.title }}</p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Priorité</label>
            <span 
              :class="{
                'bg-red-100 text-red-800': selectedAlert.priority === 'urgent',
                'bg-yellow-100 text-yellow-800': selectedAlert.priority === 'warning',
                'bg-blue-100 text-blue-800': selectedAlert.priority === 'info',
              }"
              class="px-3 py-1 rounded-full text-sm font-medium inline-block"
            >
              {{ selectedAlert.priority === 'urgent' ? 'Urgente' : selectedAlert.priority === 'warning' ? 'Moyenne' : 'Information' }}
            </span>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Campagne</label>
            <p class="text-gray-900">{{ selectedAlert.campaign?.name || 'N/A' }}</p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Animal concerné</label>
            <p class="text-gray-900">{{ selectedAlert.animal?.idNumber || 'N/A' }}</p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <p class="text-gray-900 bg-gray-50 p-3 rounded">{{ selectedAlert.description }}</p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Date</label>
            <p class="text-gray-900">{{ new Date(selectedAlert.date).toLocaleString('fr-FR') }}</p>
          </div>

          <div v-if="selectedAlert.type === 'health_status'">
            <label class="block text-sm font-semibold text-gray-700 mb-1">Type</label>
            <p class="text-gray-900">Changement de statut sanitaire</p>
          </div>
          <div v-else>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Type</label>
            <p class="text-gray-900">{{ selectedAlert.type }}</p>
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-6 border-t mt-6">
          <button 
            @click="closeDetailsModal"
            class="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            Fermer
          </button>
          <button 
            v-if="selectedAlert.priority !== 'info' && !selectedAlert.resolved"
            @click="confirmResolve(selectedAlert._id)"
            :class="{
              'bg-red-600 hover:bg-red-700': selectedAlert.priority === 'urgent',
              'bg-yellow-600 hover:bg-yellow-700': selectedAlert.priority === 'warning',
            }"
            class="px-4 py-2 text-white rounded-lg"
          >
            Résoudre
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'

const admin = useAdminStore()
const showDetailsModal = ref(false)
const selectedAlert = ref(null)

// Computed
const urgentAlerts = computed(() => 
  admin.alerts.filter(a => a.priority === 'urgent')
)

const warningAlerts = computed(() => 
  admin.alerts.filter(a => a.priority === 'warning')
)

const infoAlerts = computed(() => 
  admin.alerts.filter(a => a.priority === 'info')
)

const totalAlerts = computed(() => admin.alerts.length)

// Methods
const openDetailsModal = (alert) => {
  selectedAlert.value = alert
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedAlert.value = null
}

const confirmResolve = (alertId) => {
  if (confirm('Êtes-vous sûr de vouloir résoudre cette alerte?')) {
    resolveAlert(alertId)
  }
}

const resolveAlert = async (alertId) => {
  try {
    await admin.resolveAlert(alertId)
  } catch (error) {
    console.error('Erreur:', error)
    alert('Erreur lors de la résolution de l\'alerte')
  }
}

const resolveAllAlerts = async () => {
  if (confirm(`Êtes-vous sûr de vouloir résoudre les ${urgentAlerts.value.length} alerte(s) urgente(s)?`)) {
    try {
      for (const alert of urgentAlerts.value) {
        await admin.resolveAlert(alert._id)
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la résolution des alertes')
    }
  }
}

// Init
onMounted(async () => {
  const farmId = sessionStorage.getItem('currentFarm')
  if (farmId) {
    await admin.fetchAlerts({ farm: farmId })
  } else {
    console.warn('Aucune ferme sélectionnée')
    sessionStorage.setItem('currentFarm', '507f1f77bcf86cd799439011')
    await admin.fetchAlerts({ farm: '507f1f77bcf86cd799439011' })
  }
})
</script>
