<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-[var(--text)]">Gestion des Tâches</h1>
        <p class="text-[var(--soft)]">Assignez et suivez les activités des agents sur le terrain</p>
      </div>
      <button
        @click="openCreateModal"
        class="btn btn-primary"
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        <span>Créer une tâche</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="card p-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
        <div class="form-group mb-0">
          <label class="form-label">Statut</label>
          <select v-model="filters.status" class="form-input">
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="done">Terminée</option>
          </select>
        </div>
        <div class="form-group mb-0">
          <label class="form-label">Type</label>
          <select v-model="filters.type" class="form-input">
            <option value="">Tous les types</option>
            <option value="feeding">Alimentation</option>
            <option value="vaccination">Vaccination</option>
            <option value="treatment">Traitement</option>
            <option value="weight">Pesée</option>
            <option value="mortality">Mortalité</option>
            <option value="other">Autre</option>
          </select>
        </div>
        <button @click="resetFilters" class="btn btn-ghost h-[42px]">
          Réinitialiser
        </button>
      </div>
    </div>

    <!-- Tasks Table -->
    <div class="table-container mt-0">
      <div class="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Tâche</th>
              <th class="hide-mobile">Assignée à</th>
              <th class="hide-mobile">Campagne</th>
              <th class="hide-mobile">Échéance</th>
              <th>Priorité</th>
              <th>Statut</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in filteredEvents" :key="event._id">
              <td>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" :class="getTypeClass(event.type)">
                    <component :is="getTypeIcon(event.type)" class="w-5 h-5" />
                  </div>
                  <div>
                    <div class="font-bold text-[var(--text)] capitalize">{{ getTypeName(event.type) }}</div>
                    <div class="text-[10px] text-[var(--soft)] font-bold uppercase truncate max-w-[150px]">{{ event.description || 'Sans description' }}</div>
                  </div>
                </div>
              </td>
              <td class="hide-mobile">
                <div v-if="event.assignedTo" class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] dark:bg-[var(--accent)]/10 dark:text-[var(--accent)] flex items-center justify-center text-xs font-bold">
                    {{ event.assignedTo.name.charAt(0) }}
                  </div>
                  <span class="text-sm font-medium text-[var(--text)]">{{ event.assignedTo.name }}</span>
                </div>
                <span v-else class="text-xs text-[var(--soft)] italic">Non assignée</span>
              </td>
              <td class="hide-mobile text-sm text-[var(--soft)]">
                {{ event.campaign?.name || 'N/A' }}
              </td>
              <td class="hide-mobile text-sm text-[var(--soft)]">
                {{ event.dueDate ? new Date(event.dueDate).toLocaleDateString() : 'N/A' }}
              </td>
              <td>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" :class="getPriorityClass(event.priority)">
                  {{ event.priority }}
                </span>
              </td>
              <td>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" :class="event.status === 'done' ? 'bg-[var(--success)]/10 text-[var(--success)]' : 'bg-[var(--warn)]/10 text-[var(--warn)]'">
                  {{ event.status === 'done' ? 'Terminée' : 'En attente' }}
                </span>
              </td>
              <td class="text-right space-x-1 whitespace-nowrap">
                <button @click="openDetailsModal(event)" class="p-2 text-[var(--success)] hover:bg-[var(--success)]/10 rounded-lg transition-colors" title="Détails">
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
                <button @click="openEditModal(event)" class="p-2 text-[var(--primary)] hover:bg-[var(--bg)] rounded-lg transition-colors" title="Modifier">
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button @click="deleteTask(event._id)" class="p-2 text-[var(--danger)] hover:bg-[var(--danger)]/10 rounded-lg transition-colors" title="Supprimer">
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
                </button>
              </td>
            </tr>
            <tr v-if="!admin.loading && filteredEvents.length === 0">
              <td colspan="7" class="px-6 py-12 text-center text-[var(--soft)] italic">
                Aucune tâche trouvée.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Create/Edit -->
    <div v-if="showFormModal" class="fixed inset-0 z-[1100] flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="showFormModal = false"></div>
      <div class="card max-w-2xl w-full relative z-10 animate-fadeIn">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-[var(--text)]">{{ isEditing ? 'Modifier la tâche' : 'Créer une tâche' }}</h2>
          <button @click="showFormModal = false" class="text-[var(--soft)] hover:text-[var(--text)]">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="submitForm" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label">Type d'action *</label>
              <select v-model="form.type" required class="form-input">
                <option value="feeding">Alimentation</option>
                <option value="vaccination">Vaccination</option>
                <option value="treatment">Traitement</option>
                <option value="weight">Pesée</option>
                <option value="mortality">Mortalité</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Campagne *</label>
              <select v-model="form.campaign" required class="form-input">
                <option v-for="c in admin.campaigns" :key="c._id" :value="c._id">{{ c.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Assigner à (Agent) *</label>
              <select v-model="form.assignedTo" required class="form-input">
                <option v-for="u in agents" :key="u._id" :value="u._id">{{ u.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Date d'échéance</label>
              <input v-model="form.dueDate" type="date" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Priorité</label>
              <select v-model="form.priority" class="form-input">
                <option value="low">Faible</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Quantité (optionnel)</label>
              <input v-model.number="form.quantity" type="number" class="form-input" placeholder="ex: 50 (kg, doses...)" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Description / Instructions</label>
            <textarea v-model="form.description" class="form-input h-24" placeholder="Détails de la tâche..."></textarea>
          </div>

          <div class="pt-6 flex gap-3 border-t border-[var(--border)]">
            <button type="button" @click="showFormModal = false" class="btn btn-ghost flex-1">Annuler</button>
            <button type="submit" :disabled="isSubmitting" class="btn btn-primary flex-1">
              <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
              {{ isEditing ? 'Mettre à jour' : 'Assigner la tâche' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Details -->
    <div v-if="showDetailsModal && selectedTask" class="fixed inset-0 z-[1100] flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="showDetailsModal = false"></div>
      <div class="card max-w-lg w-full relative z-10 animate-fadeIn p-8">
        <h2 class="text-2xl font-bold mb-4 capitalize text-[var(--text)]">{{ getTypeName(selectedTask.type) }}</h2>
        <div class="space-y-4 text-[var(--soft)]">
          <p><strong>Description:</strong> {{ selectedTask.description }}</p>
          <p><strong>Assignée à:</strong> {{ selectedTask.assignedTo?.name }}</p>
          <p><strong>Échéance:</strong> {{ selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : 'N/A' }}</p>
          <p><strong>Priorité:</strong> <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" :class="getPriorityClass(selectedTask.priority)">{{ selectedTask.priority }}</span></p>
          <p><strong>Statut:</strong> <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" :class="selectedTask.status === 'done' ? 'bg-[var(--success)]/10 text-[var(--success)]' : 'bg-[var(--warn)]/10 text-[var(--warn)]'">{{ selectedTask.status === 'done' ? 'Terminée' : 'En attente' }}</span></p>
        </div>
        <button @click="showDetailsModal = false" class="btn btn-primary w-full mt-6">Fermer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { useUiStore } from '@/stores/ui'
import { userService } from '@/services/api'

const admin = useAdminStore()
const ui = useUiStore()

const showFormModal = ref(false)
const showDetailsModal = ref(false)
const isEditing = ref(false)
const isSubmitting = ref(false)
const selectedTask = ref(null)
const agents = ref([])

const filters = reactive({
  status: '',
  type: ''
})

const form = reactive({
  type: 'feeding',
  campaign: '',
  assignedTo: '',
  dueDate: '',
  priority: 'medium',
  quantity: 0,
  description: ''
})

const filteredEvents = computed(() => {
  return (admin.events || []).filter(e => {
    const matchStatus = !filters.status || e.status === filters.status
    const matchType = !filters.type || e.type === filters.type
    return matchStatus && matchType
  })
})

const resetFilters = () => {
  filters.status = ''
  filters.type = ''
}

const openCreateModal = () => {
  isEditing.value = false
  Object.assign(form, {
    type: 'feeding',
    campaign: admin.campaigns[0]?._id || '',
    assignedTo: agents.value[0]?._id || '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'medium',
    quantity: 0,
    description: ''
  })
  showFormModal.value = true
}

const openEditModal = (task) => {
  isEditing.value = true
  selectedTask.value = task
  Object.assign(form, {
    type: task.type,
    campaign: task.campaign?._id || task.campaign,
    assignedTo: task.assignedTo?._id || task.assignedTo,
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    priority: task.priority,
    quantity: task.quantity,
    description: task.description
  })
  showFormModal.value = true
}

const openDetailsModal = (task) => {
  selectedTask.value = task
  showDetailsModal.value = true
}

const submitForm = async () => {
  try {
    isSubmitting.value = true
    if (isEditing.value) {
      await admin.updateEvent(selectedTask.value._id, form)
      ui.success('Tâche mise à jour')
    } else {
      await admin.createEvent(form)
      ui.success('Tâche assignée avec succès')
    }
    showFormModal.value = false
    await admin.fetchEvents()
  } catch (err) {
    ui.error('Erreur lors de la sauvegarde')
  } finally {
    isSubmitting.value = false
  }
}

const deleteTask = async (id) => {
  const confirm = await ui.confirm({
    title: 'Supprimer la tâche',
    message: 'Êtes-vous sûr de vouloir supprimer cette tâche ?',
    confirmText: 'Supprimer',
    type: 'danger'
  })
  if (confirm) {
    try {
      await admin.deleteEvent(id)
      ui.success('Tâche supprimée')
    } catch (err) {
      ui.error('Erreur de suppression')
    }
  }
}

const getTypeName = (type) => {
  const map = { feeding: 'Alimentation', mortality: 'Mortalité', vaccination: 'Vaccination', treatment: 'Traitement', weight: 'Pesée', other: 'Autre' }
  return map[type] || type
}

const getTypeClass = (type) => {
  const map = { feeding: 'bg-blue-50 text-blue-600', mortality: 'bg-red-50 text-red-600', vaccination: 'bg-purple-50 text-purple-600', treatment: 'bg-emerald-50 text-emerald-600', weight: 'bg-amber-50 text-amber-600', other: 'bg-slate-50 text-slate-600' }
  return map[type] || 'bg-slate-50 text-slate-600'
}

const getPriorityClass = (p) => {
  const map = { low: 'bg-slate-50 text-slate-600 border-slate-200', medium: 'bg-blue-50 text-blue-600 border-blue-200', high: 'bg-orange-50 text-orange-600 border-orange-200', urgent: 'bg-red-50 text-red-600 border-red-200 animate-pulse' }
  return map[p] || ''
}

// Simple icons placeholders (SVG)
const getTypeIcon = (type) => 'svg' // Replace with real icons in full implementation

onMounted(async () => {
  await Promise.all([
    admin.fetchEvents(),
    admin.fetchCampaigns({ limit: 100 }),
    userService.getAll({ role: 'agent' }).then(res => agents.value = res.data.users)
  ])
})
</script>

<style scoped>
@keyframes modal-pop {
  0% { transform: scale(0.95) translateY(10px); opacity: 0; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}
.animate-modal-pop {
  animation: modal-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
</style>
