<template>
  <div class="space-y-6 p-6" id='pdf-content'>
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
      <div>
        <h1 class="text-3xl font-bold text-[var(--text)]">Gestion des Fermes</h1>
        <p class="text-[var(--soft)] mt-1">Gérez vos exploitations agricoles et leurs personnels</p>
      </div>
      <div class="flex gap-3 w-full lg:w-auto ">
        <button style="background-color: var(--primary);" 
          @click="openCreateModal"
          class="btn flex items-center gap-2 w-full lg:w-auto "
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          <span>Créer une ferme</span>
        </button> 
        <button 
          @click="exportToPDF"
          class="btn btn-outline flex items-center gap-2 w-full lg:w-auto bg-[var(--primary)]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          <span>Exporter PDF</span>
        </button>
      </div>
    </div>

    <!-- KPIs -->
    <div class="stats-grid">
      <div class="card p-6">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
          </div>
          <div>
            <div class="text-[var(--soft)] text-xs font-bold uppercase tracking-wider">Total Fermes</div>
            <div class="text-3xl font-bold text-[var(--text)]">{{ admin.farms?.length || 0 }}</div>
            <div class="text-[var(--soft)] text-[10px] mt-1 font-bold">exploitations</div>
          </div>
        </div>
      </div>
      <div class="card p-6">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
          <div>
            <div class="text-[var(--soft)] text-xs font-bold uppercase tracking-wider">Total Personnel</div>
            <div class="text-3xl font-bold text-[var(--text)]">{{ totalPersonnel }}</div>
            <div class="text-[var(--soft)] text-[10px] mt-1 font-bold">gérants + agents</div>
          </div>
        </div>
      </div>
      <div class="card p-6">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/>
            </svg>
          </div>
          <div>
            <div class="text-[var(--soft)] text-xs font-bold uppercase tracking-wider">Superficie Totale</div>
            <div class="text-3xl font-bold text-[var(--text)]">{{ totalArea }}</div>
            <div class="text-[var(--soft)] text-[10px] mt-1 font-bold">hectares</div>
          </div>
        </div>
      </div>
      <div class="card p-6">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
            </svg>
          </div>
          <div>
            <div class="text-[var(--soft)] text-xs font-bold uppercase tracking-wider">Types de Production</div>
            <div class="text-3xl font-bold text-[var(--text)]">{{ productionTypesCount }}</div>
            <div class="text-[var(--soft)] text-[10px] mt-1 font-bold">activités</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Farms Table -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-[var(--bg)] border-b border-[var(--border)]">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-bold text-[var(--soft)] uppercase tracking-wider">Ferme</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-[var(--soft)] uppercase tracking-wider">Localisation</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-[var(--soft)] uppercase tracking-wider">Types de Production</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-[var(--soft)] uppercase tracking-wider">Personnel</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-[var(--soft)] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--border)]">
            <tr v-for="farm in (admin.farms || [])" :key="farm._id" class="hover:bg-[var(--bg)] transition-colors">
              <td class="px-6 py-4">
                <div class="font-bold text-[var(--text)]">{{ farm.name }}</div>
                <div class="text-xs text-[var(--soft)]">{{ farm.totalArea }} Hectares</div>
              </td>
              <td class="px-6 py-4 text-sm text-[var(--text)]">{{ farm.location }}</td>
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
                    class="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-[var(--bg)] flex items-center justify-center text-[10px] font-bold text-[var(--soft)]"
                  >
                    +{{ (farm.managers?.length + farm.agents?.length) - 3 }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm space-x-3">
                <button @click="openDetailsModal(farm)" class="text-[var(--success)] hover:text-[var(--text)] font-medium transition-colors">Détails</button>
                <button @click="openEditModal(farm)" class="text-[var(--primary)] hover:text-[var(--text)] font-medium transition-colors">Modifier</button>
                <button @click="deleteFarm(farm._id)" class="text-[var(--danger)] hover:text-[var(--text)] font-medium transition-colors">Supprimer</button>
              </td>
            </tr>
            <tr v-if="!admin.loading && (!admin.farms || admin.farms.length === 0)">
              <td colspan="5" class="px-6 py-12 text-center text-[var(--soft)]">
                Aucune ferme trouvée. Commencez par en créer une.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Create/Edit -->
    <div v-if="showFormModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white rounded-lg shadow-lg max-w-2xl w-full overflow-y-auto max-h-[90vh]">
        <div class="p-6 border-b border-[var(--border)] flex justify-between items-center">
          <h2 class="text-xl font-bold text-[var(--text)]">{{ isEditing ? 'Modifier la ferme' : 'Créer une nouvelle ferme' }}</h2>
          <button @click="showFormModal = false" class="text-[var(--soft)] hover:text-[var(--text)] text-2xl transition-colors">&times;</button>
        </div>
        
        <form @submit.prevent="submitForm" class="p-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-sm font-bold text-[var(--text)]">Nom de la ferme *</label>
              <input v-model="form.name" type="text" required class="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all" placeholder="ex: Ferme Horizon" />
            </div>
            <div class="space-y-1">
              <label class="text-sm font-bold text-[var(--text)]">Localisation *</label>
              <input v-model="form.location" type="text" required class="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all" placeholder="ex: Zone Nord, Secteur 4" />
            </div>
            <div class="space-y-1">
              <label class="text-sm font-bold text-[var(--text)]">Superficie (Hectares)</label>
              <input v-model.number="form.totalArea" type="number" step="0.1" class="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all" placeholder="0.0" />
            </div>
            <div class="space-y-1">
              <label class="text-sm font-bold text-[var(--text)]">Types de Production</label>
              <div class="flex flex-wrap gap-2 mt-2">
                <label v-for="type in ['Volaille', 'Bétail', 'Pisciculture']" :key="type" class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] cursor-pointer hover:bg-[var(--bg)] transition-colors" :class="{'bg-blue-50 border-blue-200': form.productionTypes.includes(type)}">
                  <input type="checkbox" :value="type" v-model="form.productionTypes" class="hidden" />
                  <span class="text-sm font-medium" :class="{'text-blue-700': form.productionTypes.includes(type)}">{{ type }}</span>
                </label>
              </div>
            </div>
          </div>

          <div class="pt-6 flex gap-3 border-t border-[var(--border)]">
            <button type="button" @click="showFormModal = false" class="flex-1 px-6 py-3 rounded-lg bg-[var(--bg)] text-[var(--text)] font-bold hover:bg-[var(--border)] transition-all">Annuler</button>
            <button type="submit" :disabled="isSubmitting" class="flex-1 px-6 py-3 rounded-lg bg-[var(--primary)] text-white font-bold hover:bg-opacity-90 transition-all disabled:bg-gray-300">
              {{ isSubmitting ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer la ferme') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Details -->
    <div v-if="showDetailsModal && selectedFarm" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white rounded-lg shadow-lg max-w-3xl w-full overflow-y-auto max-h-[90vh]">
        <div class="relative h-32 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">
          <button @click="showDetailsModal = false" class="absolute top-4 right-4 text-white/80 hover:text-white text-2xl transition-colors">&times;</button>
          <div class="absolute -bottom-12 left-8 p-1 bg-white rounded-lg shadow-xl">
            <div class="w-24 h-24 bg-[var(--bg)] rounded-lg flex items-center justify-center text-4xl font-bold text-[var(--primary)] uppercase">
              {{ selectedFarm.name.charAt(0) }}
            </div>
          </div>
        </div>
        
        <div class="pt-16 p-8 space-y-8">
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-3xl font-black text-[var(--text)]">{{ selectedFarm.name }}</h2>
              <p class="text-[var(--soft)] flex items-center gap-1">
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
            <div class="p-4 bg-[var(--bg)] rounded-lg border border-[var(--border)]">
              <div class="text-xs font-bold text-[var(--soft)] uppercase tracking-widest mb-1">Superficie</div>
              <div class="text-xl font-black text-[var(--text)]">{{ selectedFarm.totalArea || 0 }} Ha</div>
            </div>
            <div class="p-4 bg-[var(--bg)] rounded-lg border border-[var(--border)]">
              <div class="text-xs font-bold text-[var(--soft)] uppercase tracking-widest mb-1">Gérants</div>
              <div class="text-xl font-black text-[var(--text)]">{{ selectedFarm.managers?.length || 0 }}</div>
            </div>
            <div class="p-4 bg-[var(--bg)] rounded-lg border border-[var(--border)]">
              <div class="text-xs font-bold text-[var(--soft)] uppercase tracking-widest mb-1">Agents</div>
              <div class="text-xl font-black text-[var(--text)]">{{ selectedFarm.agents?.length || 0 }}</div>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-lg font-bold text-[var(--text)]">Personnel de la ferme</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Managers List -->
              <div class="space-y-2">
                <div class="text-xs font-bold text-purple-500 uppercase">Gérants</div>
                <div v-if="!selectedFarm.managers?.length" class="text-sm text-[var(--soft)] italic">Aucun gérant assigné</div>
                <div v-for="m in selectedFarm.managers" :key="m._id" class="flex items-center gap-3 p-2 rounded-lg bg-purple-50 border border-purple-100">
                  <div class="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-xs font-bold text-purple-700">{{ m.name.charAt(0) }}</div>
                  <div class="text-sm font-bold text-purple-900">{{ m.name }}</div>
                </div>
              </div>
              <!-- Agents List -->
              <div class="space-y-2">
                <div class="text-xs font-bold text-green-500 uppercase">Agents</div>
                <div v-if="!selectedFarm.agents?.length" class="text-sm text-[var(--soft)] italic">Aucun agent assigné</div>
                <div v-for="a in selectedFarm.agents" :key="a._id" class="flex items-center gap-3 p-2 rounded-lg bg-green-50 border border-green-100">
                  <div class="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-xs font-bold text-green-700">{{ a.name?.charAt(0) }}</div>
                  <div class="text-sm font-bold text-green-900">{{ a.name }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button @click="showDetailsModal = false" class="flex-1 px-6 py-3 rounded-lg bg-[var(--bg)] text-[var(--text)] font-bold hover:bg-[var(--border)] transition-all">Fermer</button>
            <button @click="openEditModal(selectedFarm); showDetailsModal = false" class="flex-1 px-6 py-3 rounded-lg bg-[var(--primary)] text-white font-bold hover:bg-opacity-90 transition-all">Modifier les infos</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import html2pdf from 'html2pdf.js'

const admin = useAdminStore()
const auth = useAuthStore()
const ui = useUiStore()

// State
const showFormModal = ref(false)
const showDetailsModal = ref(false)
const isEditing = ref(false)
const isSubmitting = ref(false)
const selectedFarm = ref(null)
const isExportingPDF = ref(false)

const form = reactive({
  name: '',
  location: '',
  totalArea: 0,
  productionTypes: [],
  owner: ''
})

// Computed
const totalPersonnel = computed(() => {
  return admin.farms?.reduce((total, farm) => {
    return total + (farm.managers?.length || 0) + (farm.agents?.length || 0)
  }, 0) || 0
})

const totalArea = computed(() => {
  return admin.farms?.reduce((total, farm) => {
    return total + (farm.totalArea || 0)
  }, 0) || 0
})

const productionTypesCount = computed(() => {
  const types = new Set()
  admin.farms?.forEach(farm => {
    farm.productionTypes?.forEach(type => types.add(type))
  })
  return types.size
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

const exportToPDF = () => {
  isExportingPDF.value = true
  const element = document.getElementById('pdf-content')
  
  const opt = {
    margin: 10,
    filename: `Gestion Fermes_${new Date().toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true, 
      logging: false,
      onclone: (clonedDoc) => {
        clonedDoc.documentElement.classList.remove('dark')
        clonedDoc.documentElement.classList.add('light')
        
        const style = clonedDoc.createElement('style')
        style.innerHTML = `
          * { 
            color-scheme: light !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background-image: none !important;
          }
          :root {
            --primary: #3D2B1F !important;
            --accent: #F2B705 !important;
            --bg: #FDF6EC !important;
            --card: #FFFFFF !important;
            --text: #1A1008 !important;
            --soft: #7A6652 !important;
            --border: #E8D9C5 !important;
            --success: #2D6A4F !important;
            --warn: #E07B39 !important;
            --danger: #D62828 !important;
            --vol: #E8813A !important;
            --bet: #8B5E3C !important;
            --pis: #1A6B8A !important;
          }
          .card { background-color: #FFFFFF !important; }
          * { color: #1A1008 !important; background-color: #FFFFFF !important; border-color: #E8D9C5 !important; }
        `
        clonedDoc.head.appendChild(style)
      }
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
  }

  html2pdf().set(opt).from(element).save().then(() => {
    isExportingPDF.value = false
  }).catch(err => {
    console.error('PDF Export Error:', err)
    isExportingPDF.value = false
  })
}

onMounted(async () => {
  await admin.fetchFarms()
})
</script>

<style scoped>
/* Correction des modaux pour éviter les conflits avec le CSS global */

/* Overlay des modaux */
.fixed.inset-0 {
  z-index: 9999 !important;
}

/* Conteneur des modaux */
.fixed > div {
  max-height: 90vh !important;
  overflow-y: auto !important;
}

/* Espacement des modaux */
.bg-white.rounded-lg.shadow-lg {
  padding: 2.5rem !important; /* 40px */
  margin: 1rem !important;
  border-radius: 0.75rem !important; /* 12px au lieu de 16px */
}

/* Espacement entre les éléments */
.space-y-4 > * + * {
  margin-top: 1rem !important; /* 16px */
}

.space-y-8 > * + * {
  margin-top: 2rem !important; /* 32px */
}

/* Champs de formulaire */
input[type="text"],
input[type="number"] {
  padding: 0.75rem 1rem !important; /* 12px 16px */
  border-radius: 0.75rem !important; /* 12px */
  border: 1px solid var(--border) !important;
  background: var(--card) !important;
  color: var(--text) !important;
  font-size: 0.875rem !important; /* 14px */
  transition: all 0.2s ease !important;
}

input[type="text"]:focus,
input[type="number"]:focus {
  outline: none !important;
  border-color: var(--primary) !important;
  box-shadow: 0 0 0 3px rgba(61, 43, 31, 0.1) !important;
}

/* Labels */
label {
  display: block !important;
  font-size: 0.875rem !important; /* 14px */
  font-weight: 500 !important;
  color: var(--text) !important;
  margin-bottom: 0.5rem !important; /* 8px */
}

/* Boutons */
button {
  border-radius: 0.75rem !important; /* 12px au lieu de 16px */
  font-weight: 600 !important;
  transition: all 0.2s ease !important;
}

/* Bouton principal */
button[type="submit"] {
  background: var(--primary) !important;
  color: white !important;
  border: none !important;
  padding: 0.75rem 1.5rem !important; /* 12px 24px */
}

button[type="submit"]:hover {
  background: color-mix(in srgb, var(--primary) 90%, black) !important;
  transform: translateY(-1px) !important;
}

button[type="submit"]:disabled {
  background: #9ca3af !important;
  cursor: not-allowed !important;
  transform: none !important;
}

/* Bouton secondaire */
button[type="button"] {
  background: var(--bg) !important;
  color: var(--text) !important;
  border: 1px solid var(--border) !important;
  padding: 0.75rem 1.5rem !important; /* 12px 24px */
}

button[type="button"]:hover {
  background: var(--border) !important;
}

/* Boutons action (table) */
button:not([type]) {
  padding: 0.5rem 1rem !important; /* 8px 16px */
  border-radius: 0.5rem !important; /* 8px */
  font-size: 0.8125rem !important; /* 13px */
  background: transparent !important;
  border: none !important;
}

button:not([type]):hover {
  transform: translateY(-1px) !important;
}

/* Header des modaux */
.flex.justify-between.items-center {
  margin-bottom: 1.5rem !important; /* 24px */
}

/* Footer des modaux */
.flex.gap-3.pt-6 {
  padding-top: 1.5rem !important; /* 24px */
  margin-top: 1.5rem !important; /* 24px */
  border-top: 1px solid var(--border) !important;
}

/* Grid des formulaires */
.grid.grid-cols-1.md\\:grid-cols-2.gap-4 {
  gap: 1rem !important; /* 16px */
}

/* Sections des modaux */
.grid.grid-cols-1.md\\:grid-cols-3.gap-4 {
  gap: 1rem !important; /* 16px */
}

/* Cards KPIs */
.card {
  background-color: var(--card) !important;
  border-radius: 0.75rem !important; /* 12px */
  box-shadow: var(--shadow) !important;
  padding: 1.5rem !important; /* 24px */
  border: 1px solid var(--border) !important;
}

/* Stats Grid */
.stats-grid {
  display: grid !important;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) !important;
  gap: 1rem !important; /* 16px */
}

/* Responsive */
@media (max-width: 640px) {
  .bg-white.rounded-lg.shadow-lg {
    margin: 0.5rem !important;
    padding: 1.5rem !important; /* 24px */
  }
  
  button {
    padding: 0.625rem 1rem !important; /* 10px 16px */
    font-size: 0.8125rem !important; /* 13px */
  }
  
  .grid.grid-cols-2 {
    grid-template-columns: 1fr !important;
  }
  
  .stats-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>
