<template>
  <div class="health-view space-y-6 p-6">
    <!-- Holographic Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="page-title text-3xl font-bold mb-1">Santé & Alertes</h1>
        <p class="text-cyan-300/70 text-sm flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          {{ urgentAlerts.length }} alerte(s) urgente(s) - {{ totalAlerts }} au total
        </p>
      </div>
      <button 
        v-if="totalAlerts > 0"
        @click="resolveAllAlerts"
        class="cyber-button px-6 py-3 rounded-lg text-sm font-medium text-white"
      >
        <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        Tout résoudre
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="admin.loading" class="flex justify-center items-center py-12">
      <div class="cyber-loader">
        <div class="loader-ring"></div>
        <div class="loader-ring"></div>
        <div class="loader-ring"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="admin.error" class="error-alert px-4 py-3 rounded-lg">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ admin.error }}</span>
      </div>
    </div>

    <!-- Alerts Grid -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Urgent Alerts -->
      <div class="space-y-4">
        <div class="alert-column-header urgent-header flex items-center gap-2 text-lg font-bold mb-4">
          <div class="header-icon w-8 h-8 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            </svg>
          </div>
          <span>Urgentes ({{ urgentAlerts.length }})</span>
        </div>
        <div v-if="urgentAlerts.length === 0" class="empty-state p-6 rounded-xl text-center">
          <div class="empty-icon w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-slate-400 text-sm">Aucune alerte urgente</p>
        </div>
        <div v-for="alert in urgentAlerts" :key="alert._id" class="alert-card urgent-card p-4 rounded-xl">
          <div class="flex items-start gap-3 mb-3">
            <div class="alert-indicator urgent-indicator w-2 h-2 rounded-full mt-2"></div>
            <div class="flex-1">
              <div class="font-semibold text-red-300">{{ alert.title }}</div>
              <div class="text-sm text-red-400/70 mt-1">{{ alert.campaign?.name || 'N/A' }}</div>
            </div>
          </div>
          <div class="text-sm text-slate-300 mt-2 pl-5">{{ alert.description }}</div>
          <div class="text-xs text-slate-500 mt-3 pl-5">{{ new Date(alert.date).toLocaleDateString('fr-FR') }}</div>
          <div class="flex gap-2 mt-4 pl-5">
            <button 
              @click="openDetailsModal(alert)"
              class="action-btn view-btn px-3 py-1.5 rounded-lg text-xs font-medium"
            >
              Voir Détails
            </button>
            <button 
              @click="confirmResolve(alert._id)"
              class="action-btn resolve-btn urgent-resolve px-3 py-1.5 rounded-lg text-xs font-medium"
            >
              Résoudre
            </button>
          </div>
        </div>
      </div>

      <!-- Warning Alerts -->
      <div class="space-y-4">
        <div class="alert-column-header warning-header flex items-center gap-2 text-lg font-bold mb-4">
          <div class="header-icon w-8 h-8 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <span>Moyennes ({{ warningAlerts.length }})</span>
        </div>
        <div v-if="warningAlerts.length === 0" class="empty-state p-6 rounded-xl text-center">
          <div class="empty-icon w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-slate-400 text-sm">Aucune alerte moyenne</p>
        </div>
        <div v-for="alert in warningAlerts" :key="alert._id" class="alert-card warning-card p-4 rounded-xl">
          <div class="flex items-start gap-3 mb-3">
            <div class="alert-indicator warning-indicator w-2 h-2 rounded-full mt-2"></div>
            <div class="flex-1">
              <div class="font-semibold text-amber-300">{{ alert.title }}</div>
              <div class="text-sm text-amber-400/70 mt-1">{{ alert.campaign?.name || 'N/A' }}</div>
            </div>
          </div>
          <div class="text-sm text-slate-300 mt-2 pl-5">{{ alert.description }}</div>
          <div class="text-xs text-slate-500 mt-3 pl-5">{{ new Date(alert.date).toLocaleDateString('fr-FR') }}</div>
          <div class="flex gap-2 mt-4 pl-5">
            <button 
              @click="openDetailsModal(alert)"
              class="action-btn view-btn px-3 py-1.5 rounded-lg text-xs font-medium"
            >
              Voir Détails
            </button>
            <button 
              @click="confirmResolve(alert._id)"
              class="action-btn resolve-btn warning-resolve px-3 py-1.5 rounded-lg text-xs font-medium"
            >
              Résoudre
            </button>
          </div>
        </div>
      </div>

      <!-- Info Alerts -->
      <div class="space-y-4">
        <div class="alert-column-header info-header flex items-center gap-2 text-lg font-bold mb-4">
          <div class="header-icon w-8 h-8 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </div>
          <span>Informations ({{ infoAlerts.length }})</span>
        </div>
        <div v-if="infoAlerts.length === 0" class="empty-state p-6 rounded-xl text-center">
          <div class="empty-icon w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-slate-400 text-sm">Aucune alerte d'information</p>
        </div>
        <div v-for="alert in infoAlerts" :key="alert._id" class="alert-card info-card p-4 rounded-xl">
          <div class="flex items-start gap-3 mb-3">
            <div class="alert-indicator info-indicator w-2 h-2 rounded-full mt-2"></div>
            <div class="flex-1">
              <div class="font-semibold text-cyan-300">{{ alert.title }}</div>
              <div class="text-sm text-cyan-400/70 mt-1">{{ alert.campaign?.name || 'N/A' }}</div>
            </div>
          </div>
          <div class="text-sm text-slate-300 mt-2 pl-5">{{ alert.description }}</div>
          <div class="text-xs text-slate-500 mt-3 pl-5">{{ new Date(alert.date).toLocaleDateString('fr-FR') }}</div>
          <div class="flex gap-2 mt-4 pl-5">
            <button 
              @click="openDetailsModal(alert)"
              class="action-btn view-btn px-3 py-1.5 rounded-lg text-xs font-medium"
            >
              Voir Détails
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Détails Alerte - Cyber Style -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDetailsModal && selectedAlert" class="fixed inset-0 flex items-center justify-center z-50" @click="closeDetailsModal">
          <div class="modal-backdrop absolute inset-0" @click="closeDetailsModal"></div>
          <div class="cyber-modal p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto relative" @click.stop>
            <div class="flex justify-between items-center mb-6">
              <div class="flex items-center gap-3">
                <div class="modal-icon w-10 h-10 rounded-lg flex items-center justify-center" :class="getPriorityIconClass(selectedAlert.priority)">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="selectedAlert.priority === 'urgent'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <path v-else-if="selectedAlert.priority === 'warning'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <h2 class="text-xl font-bold text-white">Détails de l'Alerte</h2>
                  <p class="text-slate-400 text-sm">{{ selectedAlert.title }}</p>
                </div>
              </div>
              <button 
                @click="closeDetailsModal"
                class="modal-close-btn w-8 h-8 rounded-lg flex items-center justify-center"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="space-y-4">
              <div class="detail-field">
                <label class="block text-xs font-medium text-cyan-400 uppercase tracking-wider mb-1">Titre</label>
                <p class="text-white font-medium text-lg">{{ selectedAlert.title }}</p>
              </div>

              <div class="detail-field">
                <label class="block text-xs font-medium text-cyan-400 uppercase tracking-wider mb-1">Priorité</label>
                <span 
                  :class="getPriorityBadgeClass(selectedAlert.priority)"
                  class="priority-badge px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1"
                >
                  <span class="status-dot w-1.5 h-1.5 rounded-full" :class="getPriorityDotClass(selectedAlert.priority)"></span>
                  {{ selectedAlert.priority === 'urgent' ? 'Urgente' : selectedAlert.priority === 'warning' ? 'Moyenne' : 'Information' }}
                </span>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="detail-field">
                  <label class="block text-xs font-medium text-cyan-400 uppercase tracking-wider mb-1">Campagne</label>
                  <p class="text-slate-200">{{ selectedAlert.campaign?.name || 'N/A' }}</p>
                </div>

                <div class="detail-field">
                  <label class="block text-xs font-medium text-cyan-400 uppercase tracking-wider mb-1">Animal concerné</label>
                  <p class="text-slate-200">{{ selectedAlert.animal?.idNumber || 'N/A' }}</p>
                </div>
              </div>

              <div class="detail-field">
                <label class="block text-xs font-medium text-cyan-400 uppercase tracking-wider mb-1">Description</label>
                <div class="description-box p-4 bg-slate-800/50 rounded-lg">
                  <p class="text-slate-300 text-sm leading-relaxed">{{ selectedAlert.description }}</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="detail-field">
                  <label class="block text-xs font-medium text-cyan-400 uppercase tracking-wider mb-1">Date</label>
                  <p class="text-slate-200">{{ new Date(selectedAlert.date).toLocaleString('fr-FR') }}</p>
                </div>

                <div class="detail-field">
                  <label class="block text-xs font-medium text-cyan-400 uppercase tracking-wider mb-1">Type</label>
                  <p class="text-slate-200">{{ selectedAlert.type === 'health_status' ? 'Changement de statut sanitaire' : selectedAlert.type }}</p>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-6 border-t border-slate-700/50 mt-6">
              <button 
                @click="closeDetailsModal"
                class="cyber-btn-secondary px-4 py-2 rounded-lg text-sm font-medium"
              >
                Fermer
              </button>
              <button 
                v-if="selectedAlert.priority !== 'info' && !selectedAlert.resolved"
                @click="confirmResolve(selectedAlert._id); closeDetailsModal()"
                :class="getResolveButtonClass(selectedAlert.priority)"
                class="px-4 py-2 rounded-lg text-sm font-medium text-white"
              >
                Résoudre
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { useUiStore } from '@/stores/ui'

const admin = useAdminStore()
const ui = useUiStore()
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

// Helper functions for styling
const getPriorityBadgeClass = (priority) => {
  const classes = {
    'urgent': 'priority-urgent',
    'warning': 'priority-warning',
    'info': 'priority-info'
  }
  return classes[priority] || 'priority-default'
}

const getPriorityDotClass = (priority) => {
  const classes = {
    'urgent': 'dot-urgent',
    'warning': 'dot-warning',
    'info': 'dot-info'
  }
  return classes[priority] || 'dot-default'
}

const getPriorityIconClass = (priority) => {
  const classes = {
    'urgent': 'icon-urgent',
    'warning': 'icon-warning',
    'info': 'icon-info'
  }
  return classes[priority] || 'icon-default'
}

const getResolveButtonClass = (priority) => {
  const classes = {
    'urgent': 'resolve-urgent-btn',
    'warning': 'resolve-warning-btn'
  }
  return classes[priority] || 'resolve-default-btn'
}

// Methods
const openDetailsModal = (alert) => {
  selectedAlert.value = alert
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedAlert.value = null
}

const confirmResolve = async (alertId) => {
  const confirm = await ui.confirm({
    title: 'Résoudre l\'alerte',
    message: 'Confirmez-vous que cette alerte est résolue ?',
    confirmText: 'Confirmer',
    type: 'info'
  })
  
  if (confirm) {
    resolveAlert(alertId)
  }
}

const resolveAlert = async (alertId) => {
  try {
    await admin.resolveAlert(alertId)
    ui.success('Alerte marquée comme résolue')
  } catch (error) {
    console.error('Erreur:', error)
    ui.error('Erreur lors de la résolution de l\'alerte')
  }
}

const resolveAllAlerts = async () => {
  const confirm = await ui.confirm({
    title: 'Tout résoudre',
    message: `Êtes-vous sûr de vouloir résoudre les ${urgentAlerts.value.length} alerte(s) urgente(s)?`,
    confirmText: 'Tout résoudre',
    type: 'danger'
  })

  if (confirm) {
    try {
      for (const alert of urgentAlerts.value) {
        await admin.resolveAlert(alert._id)
      }
      ui.success('Toutes les alertes ont été résolues')
    } catch (error) {
      console.error('Erreur:', error)
      ui.error('Erreur lors de la résolution des alertes')
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

<style scoped>
/* ===== DIGITAL TWIN THEME VARIABLES ===== */
.health-view {
  --color-primary: #06b6d4;
  --color-secondary: #3b82f6;
  --color-accent: #f59e0b;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-bg-dark: #0f172a;
  --color-bg-panel: rgba(15, 23, 42, 0.7);
  --color-border: rgba(6, 182, 212, 0.3);
  --shadow-glow: 0 0 20px rgba(6, 182, 212, 0.3);
  --shadow-glow-strong: 0 0 30px rgba(6, 182, 212, 0.5);
}

/* ===== HOLOGRAPHIC TITLE ===== */
.page-title {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(6, 182, 212, 0.5);
  position: relative;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #06b6d4, transparent);
}

/* ===== CYBER BUTTON ===== */
.cyber-button {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  border: 1px solid rgba(6, 182, 212, 0.5);
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.cyber-button:hover {
  box-shadow: 0 0 25px rgba(6, 182, 212, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

/* ===== ALERT COLUMN HEADERS ===== */
.alert-column-header {
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid transparent;
}

.urgent-header {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.1) 100%);
  border-color: rgba(239, 68, 68, 0.4);
  color: #f87171;
}

.warning-header {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.1) 100%);
  border-color: rgba(245, 158, 11, 0.4);
  color: #fbbf24;
}

.info-header {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(8, 145, 178, 0.1) 100%);
  border-color: rgba(6, 182, 212, 0.4);
  color: #22d3ee;
}

.header-icon {
  background: rgba(0, 0, 0, 0.2);
}

/* ===== ALERT CARDS ===== */
.alert-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.4) 100%);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.alert-card:hover {
  transform: translateY(-2px);
}

.urgent-card {
  border-color: rgba(239, 68, 68, 0.4);
  box-shadow: 0 4px 20px rgba(239, 68, 68, 0.1);
}

.urgent-card:hover {
  box-shadow: 0 8px 30px rgba(239, 68, 68, 0.2), 0 0 20px rgba(239, 68, 68, 0.1);
}

.warning-card {
  border-color: rgba(245, 158, 11, 0.4);
  box-shadow: 0 4px 20px rgba(245, 158, 11, 0.1);
}

.warning-card:hover {
  box-shadow: 0 8px 30px rgba(245, 158, 11, 0.2), 0 0 20px rgba(245, 158, 11, 0.1);
}

.info-card {
  border-color: rgba(6, 182, 212, 0.4);
  box-shadow: 0 4px 20px rgba(6, 182, 212, 0.1);
}

.info-card:hover {
  box-shadow: 0 8px 30px rgba(6, 182, 212, 0.2), 0 0 20px rgba(6, 182, 212, 0.1);
}

/* ===== ALERT INDICATORS ===== */
.alert-indicator {
  box-shadow: 0 0 8px currentColor;
  animation: pulse 2s infinite;
}

.urgent-indicator {
  background-color: #f87171;
  color: #f87171;
}

.warning-indicator {
  background-color: #fbbf24;
  color: #fbbf24;
}

.info-indicator {
  background-color: #22d3ee;
  color: #22d3ee;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* ===== ACTION BUTTONS ===== */
.action-btn {
  transition: all 0.3s ease;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid transparent;
}

.view-btn {
  color: #22c55e;
  border-color: rgba(34, 197, 94, 0.3);
}

.view-btn:hover {
  background: rgba(34, 197, 94, 0.2);
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
}

.resolve-btn {
  transition: all 0.3s ease;
}

.urgent-resolve {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #f87171;
}

.urgent-resolve:hover {
  background: rgba(239, 68, 68, 0.3);
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.3);
}

.warning-resolve {
  background: rgba(245, 158, 11, 0.2);
  border: 1px solid rgba(245, 158, 11, 0.4);
  color: #fbbf24;
}

.warning-resolve:hover {
  background: rgba(245, 158, 11, 0.3);
  box-shadow: 0 0 15px rgba(245, 158, 11, 0.3);
}

/* ===== EMPTY STATE ===== */
.empty-state {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.4) 0%, rgba(30, 41, 59, 0.3) 100%);
  border: 1px dashed rgba(100, 116, 139, 0.4);
}

.empty-icon {
  background: rgba(100, 116, 139, 0.2);
  color: #64748b;
}

/* ===== LOADER ===== */
.cyber-loader {
  position: relative;
  width: 60px;
  height: 60px;
}

.loader-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top-color: #06b6d4;
  border-radius: 50%;
  animation: spin 1.2s linear infinite;
}

.loader-ring:nth-child(1) {
  width: 100%;
  height: 100%;
}

.loader-ring:nth-child(2) {
  width: 70%;
  height: 70%;
  top: 15%;
  left: 15%;
  border-top-color: #3b82f6;
  animation-duration: 0.9s;
  animation-direction: reverse;
}

.loader-ring:nth-child(3) {
  width: 40%;
  height: 40%;
  top: 30%;
  left: 30%;
  border-top-color: #8b5cf6;
  animation-duration: 0.6s;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* ===== ERROR ALERT ===== */
.error-alert {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #f87171;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* ===== MODAL STYLES ===== */
.modal-backdrop {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.cyber-modal {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border: 1px solid rgba(6, 182, 212, 0.4);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(6, 182, 212, 0.2);
}

.modal-icon {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%);
  border: 1px solid rgba(6, 182, 212, 0.4);
  color: #22d3ee;
}

.icon-urgent {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%);
  border-color: rgba(239, 68, 68, 0.5);
  color: #f87171;
}

.icon-warning {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.2) 100%);
  border-color: rgba(245, 158, 11, 0.5);
  color: #fbbf24;
}

.icon-info {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(8, 145, 178, 0.2) 100%);
  border-color: rgba(6, 182, 212, 0.5);
  color: #22d3ee;
}

.modal-close-btn {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #94a3b8;
  transition: all 0.3s ease;
}

.modal-close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.5);
  color: #f87171;
}

/* ===== DETAIL FIELDS ===== */
.detail-field {
  transition: all 0.3s ease;
}

.description-box {
  border: 1px solid rgba(100, 116, 139, 0.2);
}

/* ===== PRIORITY BADGES ===== */
.priority-badge {
  border: 1px solid transparent;
}

.priority-urgent {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.5);
  color: #f87171;
}

.priority-warning {
  background: rgba(245, 158, 11, 0.15);
  border-color: rgba(245, 158, 11, 0.5);
  color: #fbbf24;
}

.priority-info {
  background: rgba(6, 182, 212, 0.15);
  border-color: rgba(6, 182, 212, 0.5);
  color: #22d3ee;
}

.priority-default {
  background: rgba(100, 116, 139, 0.15);
  border-color: rgba(100, 116, 139, 0.5);
  color: #94a3b8;
}

.status-dot {
  box-shadow: 0 0 8px currentColor;
}

.dot-urgent { background-color: #f87171; }
.dot-warning { background-color: #fbbf24; }
.dot-info { background-color: #22d3ee; }
.dot-default { background-color: #94a3b8; }

/* ===== RESOLVE BUTTONS ===== */
.resolve-urgent-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border: 1px solid rgba(239, 68, 68, 0.5);
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.3);
  transition: all 0.3s ease;
}

.resolve-urgent-btn:hover {
  box-shadow: 0 0 25px rgba(239, 68, 68, 0.5);
}

.resolve-warning-btn {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border: 1px solid rgba(245, 158, 11, 0.5);
  box-shadow: 0 0 15px rgba(245, 158, 11, 0.3);
  transition: all 0.3s ease;
}

.resolve-warning-btn:hover {
  box-shadow: 0 0 25px rgba(245, 158, 11, 0.5);
}

.resolve-default-btn {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  border: 1px solid rgba(6, 182, 212, 0.5);
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
  transition: all 0.3s ease;
}

.resolve-default-btn:hover {
  box-shadow: 0 0 25px rgba(6, 182, 212, 0.5);
}

/* ===== SECONDARY BUTTON ===== */
.cyber-btn-secondary {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #94a3b8;
  transition: all 0.3s ease;
}

.cyber-btn-secondary:hover {
  background: rgba(51, 65, 85, 0.8);
  border-color: rgba(148, 163, 184, 0.5);
  color: #e2e8f0;
}

/* ===== MODAL TRANSITIONS ===== */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .cyber-modal,
.modal-leave-to .cyber-modal {
  transform: scale(0.95) translateY(-10px);
  opacity: 0;
}

.modal-enter-to .cyber-modal,
.modal-leave-from .cyber-modal {
  transform: scale(1) translateY(0);
  opacity: 1;
}
</style>
