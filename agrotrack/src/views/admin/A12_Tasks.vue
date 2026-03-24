<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Gestion des Tâches</h1>
        <p class="text-slate-600">Assignez et suivez les activités des agents sur le terrain</p>
      </div>
      <button
        @click="openCreateModal"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition-all transform active:scale-95"
      >
        <span>+</span> Créer une tâche
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4">
      <div class="flex-1 min-w-[200px]">
        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Statut</label>
        <select v-model="filters.status" class="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="done">Terminée</option>
        </select>
      </div>
      <div class="flex-1 min-w-[200px]">
        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
        <select v-model="filters.type" class="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Tous les types</option>
          <option value="feeding">Alimentation</option>
          <option value="vaccination">Vaccination</option>
          <option value="treatment">Traitement</option>
          <option value="weight">Pesée</option>
          <option value="mortality">Mortalité</option>
          <option value="other">Autre</option>
        </select>
      </div>
      <button @click="resetFilters" class="self-end px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
        Réinitialiser
      </button>
    </div>

    <!-- Tasks Table -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Tâche</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Assignée à</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Campagne</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Échéance</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Priorité</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Statut</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="event in filteredEvents" :key="event._id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="getTypeClass(event.type)">
                    <component :is="getTypeIcon(event.type)" class="w-5 h-5" />
                  </div>
                  <div>
                    <div class="font-bold text-slate-900 capitalize">{{ getTypeName(event.type) }}</div>
                    <div class="text-xs text-slate-500 line-clamp-1">{{ event.description || 'Pas de description' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div v-if="event.assignedTo" class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                    {{ event.assignedTo.name.charAt(0) }}
                  </div>
                  <span class="text-sm font-medium text-slate-700">{{ event.assignedTo.name }}</span>
                </div>
                <span v-else class="text-xs text-slate-400 italic">Non assignée</span>
              </td>
              <td class="px-6 py-4 text-sm text-slate-600">
                {{ event.campaign?.name || 'N/A' }}
              </td>
              <td class="px-6 py-4 text-sm text-slate-600">
                {{ event.dueDate ? new Date(event.dueDate).toLocaleDateString() : 'N/A' }}
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 rounded-full text-[10px] font-bold uppercase border" :class="getPriorityClass(event.priority)">
                  {{ event.priority }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 rounded-full text-[10px] font-bold uppercase" :class="event.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'">
                  {{ event.status === 'done' ? 'Terminée' : 'En attente' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm space-x-3">
                <button @click="openDetailsModal(event)" class="text-green-600 hover:text-green-800 font-medium">Détails</button>
                <button @click="openEditModal(event)" class="text-blue-600 hover:text-blue-800 font-medium">Modifier</button>
                <button @click="deleteTask(event._id)" class="text-red-600 hover:text-red-800 font-medium">Supprimer</button>
              </td>
            </tr>
            <tr v-if="!admin.loading && filteredEvents.length === 0">
              <td colspan="7" class="px-6 py-12 text-center text-slate-500">
                Aucune tâche trouvée.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Create/Edit -->
    <div v-if="showFormModal" class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-modal-pop">
        <div class="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 class="text-xl font-bold text-slate-800">{{ isEditing ? 'Modifier la tâche' : 'Créer une tâche' }}</h2>
          <button @click="showFormModal = false" class="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
        </div>
        
        <form @submit.prevent="submitForm" class="p-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-sm font-bold text-slate-700">Type d'action *</label>
              <select v-model="form.type" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="feeding">Alimentation</option>
                <option value="vaccination">Vaccination</option>
                <option value="treatment">Traitement</option>
                <option value="weight">Pesée</option>
                <option value="mortality">Mortalité</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-sm font-bold text-slate-700">Campagne *</label>
              <select v-model="form.campaign" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none">
                <option v-for="c in admin.campaigns" :key="c._id" :value="c._id">{{ c.name }}</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-sm font-bold text-slate-700">Assigner à (Agent) *</label>
              <select v-model="form.assignedTo" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none">
                <option v-for="u in agents" :key="u._id" :value="u._id">{{ u.name }}</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-sm font-bold text-slate-700">Date d'échéance</label>
              <input v-model="form.dueDate" type="date" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div class="space-y-1">
              <label class="text-sm font-bold text-slate-700">Priorité</label>
              <select v-model="form.priority" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="low">Faible</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-sm font-bold text-slate-700">Quantité (optionnel)</label>
              <input v-model.number="form.quantity" type="number" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ex: 50 (kg, doses...)" />
            </div>
          </div>
          <div class="space-y-1">
            <label class="text-sm font-bold text-slate-700">Description / Instructions</label>
            <textarea v-model="form.description" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none h-24" placeholder="Détails de la tâche..."></textarea>
          </div>

          <div class="pt-6 flex gap-3 border-t border-slate-100">
            <button type="button" @click="showFormModal = false" class="flex-1 px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all">Annuler</button>
            <button type="submit" :disabled="isSubmitting" class="flex-1 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
              {{ isSubmitting ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Assigner la tâche') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Details (Simple version for brevity) -->
    <div v-if="showDetailsModal && selectedTask" class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden p-8 animate-modal-pop">
        <h2 class="text-2xl font-bold mb-4 capitalize">{{ getTypeName(selectedTask.type) }}</h2>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-xs font-bold text-slate-400 uppercase">Campagne</div>
              <div class="font-medium">{{ selectedTask.campaign?.name }}</div>
            </div>
            <div>
              <div class="text-xs font-bold text-slate-400 uppercase">Assignée à</div>
              <div class="font-medium">{{ selectedTask.assignedTo?.name }}</div>
            </div>
            <div>
              <div class="text-xs font-bold text-slate-400 uppercase">Priorité</div>
              <div class="font-medium capitalize">{{ selectedTask.priority }}</div>
            </div>
            <div>
              <div class="text-xs font-bold text-slate-400 uppercase">Statut</div>
              <div class="font-medium">{{ selectedTask.status === 'done' ? 'Terminée' : 'En attente' }}</div>
            </div>
          </div>
          <div>
            <div class="text-xs font-bold text-slate-400 uppercase">Description</div>
            <p class="text-slate-600 mt-1">{{ selectedTask.description || 'Aucune description fournie.' }}</p>
          </div>
        </div>
        <button @click="showDetailsModal = false" class="w-full mt-8 px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200">Fermer</button>
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
