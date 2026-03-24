<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Gestion des Fermes</h1>
        <p class="text-slate-600">Gérez vos exploitations agricoles et leurs personnels</p>
      </div>
      <button
        @click="openCreateModal"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition-all transform active:scale-95"
      >
        <span>+</span> Créer une ferme
      </button>
    </div>

    <!-- Farms Table -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Ferme</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Localisation</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Types de Production</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Personnel</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="farm in (admin.farms || [])" :key="farm._id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4">
                <div class="font-bold text-slate-900">{{ farm.name }}</div>
                <div class="text-xs text-slate-500">{{ farm.totalArea }} Hectares</div>
              </td>
              <td class="px-6 py-4 text-sm text-slate-600">{{ farm.location }}</td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="type in farm.productionTypes" 
                    :key="type"
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100"
                  >
                    {{ type }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex -space-x-2 overflow-hidden">
                  <div 
                    v-for="manager in (farm.managers || []).slice(0, 3)" 
                    :key="manager._id"
                    class="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-purple-100 flex items-center justify-center text-[10px] font-bold text-purple-600"
                    :title="'Gérant: ' + manager.name"
                  >
                    {{ manager.name?.charAt(0).toUpperCase() }}
                  </div>
                  <div 
                    v-if="(farm.managers?.length + farm.agents?.length) > 3"
                    class="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600"
                  >
                    +{{ (farm.managers?.length + farm.agents?.length) - 3 }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm space-x-3">
                <button @click="openDetailsModal(farm)" class="text-green-600 hover:text-green-800 font-medium">Détails</button>
                <button @click="openEditModal(farm)" class="text-blue-600 hover:text-blue-800 font-medium">Modifier</button>
                <button @click="deleteFarm(farm._id)" class="text-red-600 hover:text-red-800 font-medium">Supprimer</button>
              </td>
            </tr>
            <tr v-if="!admin.loading && (!admin.farms || admin.farms.length === 0)">
              <td colspan="5" class="px-6 py-12 text-center text-slate-500">
                Aucune ferme trouvée. Commencez par en créer une.
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
          <h2 class="text-xl font-bold text-slate-800">{{ isEditing ? 'Modifier la ferme' : 'Créer une nouvelle ferme' }}</h2>
          <button @click="showFormModal = false" class="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
        </div>
        
        <form @submit.prevent="submitForm" class="p-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-sm font-bold text-slate-700">Nom de la ferme *</label>
              <input v-model="form.name" type="text" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="ex: Ferme Horizon" />
            </div>
            <div class="space-y-1">
              <label class="text-sm font-bold text-slate-700">Localisation *</label>
              <input v-model="form.location" type="text" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="ex: Zone Nord, Secteur 4" />
            </div>
            <div class="space-y-1">
              <label class="text-sm font-bold text-slate-700">Superficie (Hectares)</label>
              <input v-model.number="form.totalArea" type="number" step="0.1" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="0.0" />
            </div>
            <div class="space-y-1">
              <label class="text-sm font-bold text-slate-700">Types de Production</label>
              <div class="flex flex-wrap gap-2 mt-2">
                <label v-for="type in ['Volaille', 'Bétail', 'Pisciculture']" :key="type" class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors" :class="{'bg-blue-50 border-blue-200': form.productionTypes.includes(type)}">
                  <input type="checkbox" :value="type" v-model="form.productionTypes" class="hidden" />
                  <span class="text-sm font-medium" :class="{'text-blue-700': form.productionTypes.includes(type)}">{{ type }}</span>
                </label>
              </div>
            </div>
          </div>

          <div class="pt-6 flex gap-3 border-t border-slate-100">
            <button type="button" @click="showFormModal = false" class="flex-1 px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all">Annuler</button>
            <button type="submit" :disabled="isSubmitting" class="flex-1 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:bg-blue-300">
              {{ isSubmitting ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer la ferme') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Details -->
    <div v-if="showDetailsModal && selectedFarm" class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden animate-modal-pop">
        <div class="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-700">
          <button @click="showDetailsModal = false" class="absolute top-4 right-4 text-white/80 hover:text-white text-2xl">&times;</button>
          <div class="absolute -bottom-12 left-8 p-1 bg-white rounded-2xl shadow-xl">
            <div class="w-24 h-24 bg-slate-100 rounded-xl flex items-center justify-center text-4xl font-bold text-blue-600 uppercase">
              {{ selectedFarm.name.charAt(0) }}
            </div>
          </div>
        </div>
        
        <div class="pt-16 p-8 space-y-8">
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-3xl font-black text-slate-900">{{ selectedFarm.name }}</h2>
              <p class="text-slate-500 flex items-center gap-1">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                {{ selectedFarm.location }}
              </p>
            </div>
            <div class="flex gap-2">
              <span v-for="type in selectedFarm.productionTypes" :key="type" class="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                {{ type }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Superficie</div>
              <div class="text-xl font-black text-slate-800">{{ selectedFarm.totalArea || 0 }} Ha</div>
            </div>
            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Gérants</div>
              <div class="text-xl font-black text-slate-800">{{ selectedFarm.managers?.length || 0 }}</div>
            </div>
            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Agents</div>
              <div class="text-xl font-black text-slate-800">{{ selectedFarm.agents?.length || 0 }}</div>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-lg font-bold text-slate-800">Personnel de la ferme</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Managers List -->
              <div class="space-y-2">
                <div class="text-xs font-bold text-purple-500 uppercase">Gérants</div>
                <div v-if="!selectedFarm.managers?.length" class="text-sm text-slate-400 italic">Aucun gérant assigné</div>
                <div v-for="m in selectedFarm.managers" :key="m._id" class="flex items-center gap-3 p-2 rounded-xl bg-purple-50 border border-purple-100">
                  <div class="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-xs font-bold text-purple-700">{{ m.name.charAt(0) }}</div>
                  <div class="text-sm font-bold text-purple-900">{{ m.name }}</div>
                </div>
              </div>
              <!-- Agents List -->
              <div class="space-y-2">
                <div class="text-xs font-bold text-green-500 uppercase">Agents</div>
                <div v-if="!selectedFarm.agents?.length" class="text-sm text-slate-400 italic">Aucun agent assigné</div>
                <div v-for="a in selectedFarm.agents" :key="a._id" class="flex items-center gap-3 p-2 rounded-xl bg-green-50 border border-green-100">
                  <div class="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-xs font-bold text-green-700">{{ a.name.charAt(0) }}</div>
                  <div class="text-sm font-bold text-green-900">{{ a.name }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button @click="showDetailsModal = false" class="flex-1 px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all">Fermer</button>
            <button @click="openEditModal(selectedFarm); showDetailsModal = false" class="flex-1 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">Modifier les infos</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'

const admin = useAdminStore()
const auth = useAuthStore()
const ui = useUiStore()

// State
const showFormModal = ref(false)
const showDetailsModal = ref(false)
const isEditing = ref(false)
const isSubmitting = ref(false)
const selectedFarm = ref(null)

const form = reactive({
  name: '',
  location: '',
  totalArea: 0,
  productionTypes: [],
  owner: ''
})

// Methods
const resetForm = () => {
  form.name = ''
  form.location = ''
  form.totalArea = 0
  form.productionTypes = []
  form.owner = auth.user?._id || ''
}

const openCreateModal = () => {
  isEditing.value = false
  resetForm()
  showFormModal.value = true
}

const openEditModal = (farm) => {
  isEditing.value = true
  selectedFarm.value = farm
  form.name = farm.name
  form.location = farm.location
  form.totalArea = farm.totalArea || 0
  form.productionTypes = [...(farm.productionTypes || [])]
  form.owner = farm.owner?._id || farm.owner || auth.user?._id
  showFormModal.value = true
}

const openDetailsModal = (farm) => {
  selectedFarm.value = farm
  showDetailsModal.value = true
}

const submitForm = async () => {
  try {
    isSubmitting.value = true
    
    if (isEditing.value) {
      await admin.updateFarm(selectedFarm.value._id, form)
      ui.success('Ferme mise à jour avec succès')
    } else {
      await admin.createFarm(form)
      ui.success('Ferme créée avec succès')
    }
    
    showFormModal.value = false
    await admin.fetchFarms() // Refresh list
  } catch (error) {
    console.error('Erreur:', error)
    ui.error(error.response?.data?.message || 'Une erreur est survenue')
  } finally {
    isSubmitting.value = false
  }
}

const deleteFarm = async (id) => {
  const confirm = await ui.confirm({
    title: 'Supprimer la ferme',
    message: 'Êtes-vous sûr de vouloir supprimer cette ferme ? Toutes les données associées seront définitivement perdues.',
    confirmText: 'Supprimer',
    type: 'danger'
  })

  if (confirm) {
    try {
      await admin.deleteFarm(id)
      ui.success('Ferme supprimée avec succès')
      await admin.fetchFarms()
    } catch (error) {
      console.error('Erreur:', error)
      ui.error('Impossible de supprimer la ferme')
    }
  }
}

onMounted(async () => {
  await admin.fetchFarms()
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
