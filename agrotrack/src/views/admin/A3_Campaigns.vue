<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-[var(--text)]">Gestion des Campagnes</h1>
        <p class="text-[var(--soft)]">Gérez toutes vos campagnes d'élevage</p>
      </div>
      <button 
        @click="openCreateModal" 
        class="btn btn-primary"
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M12 4v16m8-8H4" />
        </svg>
        <span>Nouvelle Campagne</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="card p-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="form-group mb-0">
          <input 
            v-model="filters.search" 
            placeholder="Rechercher par nom..." 
            class="form-input"
          />
        </div>
        <div class="form-group mb-0">
          <select v-model="filters.status" class="form-input">
            <option value="">Tous les statuts</option>
            <option value="En cours">En cours</option>
            <option value="Terminée">Terminée</option>
            <option value="Préparation">Préparation</option>
          </select>
        </div>
        <div class="form-group mb-0">
          <select v-model="filters.animalType" class="form-input">
            <option value="">Tous les types</option>
            <option value="Volaille">Volaille</option>
            <option value="Bétail">Bétail</option>
            <option value="Pisciculture">Pisciculture</option>
          </select>
        </div>
        <button 
          @click="resetFilters" 
          class="btn btn-ghost h-[42px]"
        >
          Réinitialiser
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="admin.loading" class="flex flex-col items-center justify-center py-20 gap-4">
      <div class="w-10 h-10 border-4 border-[var(--accent)]/30 border-t-[var(--accent)] rounded-full animate-spin"></div>
      <p class="text-[var(--soft)]">Chargement des campagnes...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="admin.error" class="card bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 p-4">
      {{ admin.error }}
    </div>

    <!-- Main Content -->
    <div v-if="!admin.loading && filteredCampaigns.length > 0" class="table-container mt-0">
      <div class="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th class="hide-mobile">Type</th>
              <th>Statut</th>
              <th class="hide-mobile">Animaux</th>
              <th class="hide-mobile">Budget</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="campaign in filteredCampaigns" :key="campaign._id">
              <td>
                <div class="font-bold text-[var(--text)]">{{ campaign.name }}</div>
                <div class="lg:hidden text-[10px] text-[var(--soft)] uppercase font-bold mt-0.5">{{ campaign.animalType }}</div>
              </td>
              <td class="hide-mobile">
                <span class="text-sm font-medium text-[var(--soft)]">{{ campaign.animalType }}</span>
              </td>
              <td>
                <span 
                  :class="{
                    'bg-[var(--primary)]/10 text-[var(--primary)] dark:bg-[var(--accent)]/10 dark:text-[var(--accent)]': campaign.status === 'En cours',
                    'bg-[var(--success)]/10 text-[var(--success)]': campaign.status === 'Terminée',
                    'bg-[var(--warn)]/10 text-[var(--warn)]': campaign.status === 'Préparation',
                  }"
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                >
                  {{ campaign.status }}
                </span>
              </td>
              <td class="hide-mobile">
                <div class="text-sm font-mono font-medium">
                  {{ campaign.currentAnimalCount }} / {{ campaign.initialAnimalCount }}
                </div>
              </td>
              <td class="hide-mobile">
                <div class="text-sm font-mono font-medium">{{ campaign.budget?.toLocaleString() }} F</div>
              </td>
              <td class="text-right space-x-1 whitespace-nowrap">
                <button @click="openEditModal(campaign)" class="p-2 text-[var(--primary)] hover:bg-[var(--bg)] rounded-lg transition-colors" title="Modifier">
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button @click="deleteCampaign(campaign._id)" class="p-2 text-[var(--danger)] hover:bg-[var(--danger)]/10 rounded-lg transition-colors" title="Supprimer">
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!admin.loading && filteredCampaigns.length === 0" class="card p-12 text-center">
      <svg class="mx-auto h-12 w-12 text-[var(--soft)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <h3 class="mt-2 text-lg font-bold text-[var(--text)]">Aucune campagne</h3>
      <p class="mt-1 text-[var(--soft)]">Créez votre première campagne pour commencer</p>
    </div>

    <!-- Modal Create/Edit -->
    <div v-if="showModal" class="fixed inset-0 z-[1100] flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="showModal = false"></div>
      <div class="card max-w-lg w-full relative z-10 animate-fadeIn">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-[var(--text)]">
            {{ isEditing ? 'Modifier Campagne' : 'Nouvelle Campagne' }}
          </h2>
          <button @click="showModal = false" class="text-[var(--soft)] hover:text-[var(--text)]">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitForm" class="space-y-4">
          <div class="form-group">
            <label class="form-label">Nom de la campagne *</label>
            <input 
              v-model="form.name" 
              type="text"
              required
              class="form-input"
              placeholder="Ex: Volaille été 2024"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label">Type d'animal *</label>
              <select v-model="form.animalType" required class="form-input">
                <option value="Volaille">Volaille</option>
                <option value="Bétail">Bétail</option>
                <option value="Pisciculture">Pisciculture</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Nombre initial *</label>
              <input v-model.number="form.initialAnimalCount" type="number" min="1" required class="form-input" placeholder="500" />
            </div>
          </div>

          <div v-if="isEditing" class="form-group">
            <label class="form-label">Nombre actuel d'animaux *</label>
            <input v-model.number="form.currentAnimalCount" type="number" min="0" required class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">Budget (FCFA) *</label>
            <input v-model.number="form.budget" type="number" min="0" required class="form-input" placeholder="5000000" />
          </div>

          <div v-if="isEditing" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label">Statut</label>
              <select v-model="form.status" class="form-input">
                <option value="Préparation">Préparation</option>
                <option value="En cours">En cours</option>
                <option value="Terminée">Terminée</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Taux de mortalité (%)</label>
              <input v-model.number="form.mortality" type="number" min="0" max="100" class="form-input" />
            </div>
          </div>

          <div class="flex gap-3 justify-end pt-6 border-t border-[var(--border)]">
            <button type="button" @click="closeModal" class="btn btn-ghost">Annuler</button>
            <button type="submit" :disabled="isSubmitting" class="btn btn-primary">
              <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
              {{ isEditing ? 'Mettre à jour' : 'Créer la campagne' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Détails Campagne -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl max-h-96 overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Détails de la Campagne</h2>
          <button 
            @click="closeDetailsModal"
            class="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div v-if="selectedCampaign" class="grid grid-cols-2 gap-6">
          <!-- Colonne 1 -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Nom</label>
              <p class="text-gray-900 font-medium">{{ selectedCampaign.name }}</p>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Type d'animal</label>
              <p class="text-gray-900">{{ selectedCampaign.animalType }}</p>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Statut</label>
              <span 
                :class="{
                  'bg-blue-100 text-blue-800': selectedCampaign.status === 'En cours',
                  'bg-green-100 text-green-800': selectedCampaign.status === 'Terminée',
                  'bg-yellow-100 text-yellow-800': selectedCampaign.status === 'Préparation',
                }"
                class="px-3 py-1 rounded-full text-sm font-medium inline-block"
              >
                {{ selectedCampaign.status }}
              </span>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Budget</label>
              <p class="text-gray-900 font-medium">{{ selectedCampaign.budget.toLocaleString() }} FCFA</p>
            </div>
          </div>

          <!-- Colonne 2 -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Nombre initial d'animaux</label>
              <p class="text-gray-900">{{ selectedCampaign.initialAnimalCount }}</p>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Nombre actuel d'animaux</label>
              <p class="text-gray-900">{{ selectedCampaign.currentAnimalCount }}</p>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Taux de mortalité</label>
              <p 
                :class="{
                  'text-red-600': selectedCampaign.mortality > 10,
                  'text-yellow-600': selectedCampaign.mortality > 5 && selectedCampaign.mortality <= 10,
                  'text-green-600': selectedCampaign.mortality <= 5,
                }"
                class="font-bold text-lg"
              >
                {{ selectedCampaign.mortality }}%
              </p>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Date de démarrage</label>
              <p class="text-gray-900">{{ new Date(selectedCampaign.startDate).toLocaleDateString('fr-FR') }}</p>
            </div>
          </div>

          <!-- Ligne complète : Informations complémentaires -->
          <div v-if="selectedCampaign.endDate" class="col-span-2">
            <label class="block text-sm font-semibold text-gray-700 mb-1">Date de fin</label>
            <p class="text-gray-900">{{ new Date(selectedCampaign.endDate).toLocaleDateString('fr-FR') }}</p>
          </div>

          <div v-if="selectedCampaign.spent !== undefined" class="col-span-2">
            <label class="block text-sm font-semibold text-gray-700 mb-1">Montant dépensé</label>
            <p class="text-gray-900 font-medium">{{ selectedCampaign.spent.toLocaleString() }} FCFA</p>
          </div>

          <div v-if="selectedCampaign.actualRevenue !== undefined" class="col-span-2">
            <label class="block text-sm font-semibold text-gray-700 mb-1">Revenu réalisé</label>
            <p class="text-gray-900 font-medium text-green-600">{{ selectedCampaign.actualRevenue.toLocaleString() }} FCFA</p>
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
            @click="editFromDetails(selectedCampaign)"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Modifier
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { useUiStore } from '@/stores/ui'

const admin = useAdminStore()
const ui = useUiStore()

// State
const showModal = ref(false)
const isEditing = ref(false)
const isSubmitting = ref(false)
const currentCampaignId = ref(null)
const showDetailsModal = ref(false)
const selectedCampaign = ref(null)

// Filters
const filters = reactive({
  search: '',
  status: '',
  animalType: ''
})

// Form
const form = reactive({
  name: '',
  animalType: 'Volaille',
  initialAnimalCount: 500,
  currentAnimalCount: 500,
  budget: 5000000,
  status: 'Préparation',
  mortality: 0
})

// Computed
const filteredCampaigns = computed(() => {
  return admin.campaigns.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(filters.search.toLowerCase())
    const matchStatus = !filters.status || c.status === filters.status
    const matchType = !filters.animalType || c.animalType === filters.animalType
    return matchSearch && matchStatus && matchType
  })
})

// Methods
const openCreateModal = () => {
  isEditing.value = false
  resetForm()
  showModal.value = true
}

const openEditModal = (campaign) => {
  isEditing.value = true
  currentCampaignId.value = campaign._id
  form.name = campaign.name
  form.currentAnimalCount = campaign.currentAnimalCount
  form.budget = campaign.budget
  form.status = campaign.status
  form.mortality = campaign.mortality
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const resetForm = () => {
  form.name = ''
  form.animalType = 'Volaille'
  form.initialAnimalCount = 500
  form.currentAnimalCount = 500
  form.budget = 5000000
  form.status = 'Préparation'
  form.mortality = 0
}

const submitForm = async () => {
  try {
    isSubmitting.value = true
    
    const farmId = sessionStorage.getItem('currentFarm')
    if (!farmId) {
      throw new Error('Aucune ferme sélectionnée')
    }
    
    if (isEditing.value) {
      await admin.updateCampaign(currentCampaignId.value, {
        name: form.name,
        currentAnimalCount: form.currentAnimalCount,
        budget: form.budget,
        status: form.status,
        mortality: form.mortality
      })
    } else {
      await admin.createCampaign({
        name: form.name,
        animalType: form.animalType,
        initialAnimalCount: form.initialAnimalCount,
        budget: form.budget,
        startDate: new Date().toISOString(),
        farm: farmId,
        status: 'Préparation'
      })
    }
    
    // Refresh the list after any change (Fetch all for admin)
    await admin.fetchCampaigns({ limit: 100 })
    
    closeModal()
    ui.success(`Campagne ${isEditing.value ? 'mise à jour' : 'créée'} avec succès`)
  } catch (error) {
    console.error('Erreur:', error)
    ui.error('Erreur: ' + (error.message || 'Impossible de sauvegarder'))
  } finally {
    isSubmitting.value = false
  }
}

const deleteCampaign = async (id) => {
  const confirm = await ui.confirm({
    title: 'Supprimer la campagne',
    message: 'Êtes-vous sûr de vouloir supprimer cette campagne ? Toutes les données associées seront perdues.',
    confirmText: 'Supprimer',
    type: 'danger'
  })

  if (confirm) {
    try {
      await admin.deleteCampaign(id)
      
      // Refresh the list after deletion (Fetch all for admin)
      await admin.fetchCampaigns({ limit: 100 })
      ui.success('Campagne supprimée avec succès')
    } catch (error) {
      console.error('Erreur:', error)
      ui.error('Erreur de suppression')
    }
  }
}

const resetFilters = () => {
  filters.search = ''
  filters.status = ''
  filters.animalType = ''
}

const openDetailsModal = (campaign) => {
  selectedCampaign.value = campaign
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedCampaign.value = null
}

const editFromDetails = (campaign) => {
  closeDetailsModal()
  openEditModal(campaign)
}

// Init
onMounted(async () => {
  await admin.fetchCampaigns({ limit: 100 })
})
</script>
