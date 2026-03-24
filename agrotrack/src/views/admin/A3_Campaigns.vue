<template>
  <div class="space-y-6 p-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold">Gestion des Campagnes</h1>
        <p class="text-slate-600">Gérez toutes vos campagnes d'élevage</p>
      </div>
      <button 
        @click="openCreateModal" 
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nouvelle Campagne
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="admin.loading" class="flex justify-center items-center py-12">
      <div class="text-slate-600">
        <div class="inline-block animate-spin mr-2">⟳</div>
        Chargement...
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="admin.error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      {{ admin.error }}
    </div>

    <!-- Filters -->
    <div v-else class="bg-white p-4 rounded-lg space-y-3">
      <div class="grid grid-cols-4 gap-4">
        <input 
          v-model="filters.search" 
          placeholder="Rechercher par nom..." 
          class="px-3 py-2 border rounded"
        />
        <select v-model="filters.status" class="px-3 py-2 border rounded">
          <option value="">Tous les statuts</option>
          <option value="En cours">En cours</option>
          <option value="Terminée">Terminée</option>
          <option value="Préparation">Préparation</option>
        </select>
        <select v-model="filters.animalType" class="px-3 py-2 border rounded">
          <option value="">Tous les types</option>
          <option value="Volaille">Volaille</option>
          <option value="Bétail">Bétail</option>
          <option value="Pisciculture">Pisciculture</option>
        </select>
        <button 
          @click="resetFilters" 
          class="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded"
        >
          Réinitialiser
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="!admin.loading && filteredCampaigns.length > 0" class="grid grid-cols-1 gap-4">
      <!-- Table View -->
      <div class="bg-white rounded-lg overflow-hidden shadow">
        <table class="w-full">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Nom</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Animaux</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Budget</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Mortalité</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="campaign in filteredCampaigns" :key="campaign._id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="font-medium text-gray-900">{{ campaign.name }}</div>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-600">{{ campaign.animalType }}</span>
              </td>
              <td class="px-6 py-4">
                <span 
                  :class="{
                    'bg-blue-100 text-blue-800': campaign.status === 'En cours',
                    'bg-green-100 text-green-800': campaign.status === 'Terminée',
                    'bg-yellow-100 text-yellow-800': campaign.status === 'Préparation',
                  }"
                  class="px-3 py-1 rounded-full text-xs font-medium"
                >
                  {{ campaign.status }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm">
                  <span class="font-medium">{{ campaign.currentAnimalCount }}</span>
                  <span class="text-gray-500">/ {{ campaign.initialAnimalCount }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="font-medium">{{ campaign.budget.toLocaleString() }} F</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div 
                    :class="{
                      'text-red-600': campaign.mortality > 10,
                      'text-yellow-600': campaign.mortality > 5 && campaign.mortality <= 10,
                      'text-green-600': campaign.mortality <= 5,
                    }"
                    class="font-medium"
                  >
                    {{ campaign.mortality }}%
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <button 
                    @click="openDetailsModal(campaign)"
                    class="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    Voir Détails
                  </button>
                  <button 
                    @click="openEditModal(campaign)"
                    class="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Éditer
                  </button>
                  <button 
                    @click="deleteCampaign(campaign._id)"
                    class="text-red-600 hover:text-red-800 text-sm"
                  >
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!admin.loading && filteredCampaigns.length === 0" class="bg-gray-50 rounded-lg p-12 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">Aucune campagne</h3>
      <p class="mt-1 text-gray-500">Créez votre première campagne pour commencer</p>
    </div>

    <!-- Modal Create/Edit -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 class="text-2xl font-bold mb-4">
          {{ isEditing ? 'Modifier Campagne' : 'Nouvelle Campagne' }}
        </h2>

        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nom de la campagne *
            </label>
            <input 
              v-model="form.name" 
              type="text"
              required
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Volaille été 2024"
            />
          </div>

          <div v-if="!isEditing">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Type d'animal *
            </label>
            <select 
              v-model="form.animalType" 
              required
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Volaille">Volaille</option>
              <option value="Bétail">Bétail</option>
              <option value="Pisciculture">Pisciculture</option>
            </select>
          </div>

          <div v-if="!isEditing">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nombre initial d'animaux *
            </label>
            <input 
              v-model.number="form.initialAnimalCount" 
              type="number"
              min="1"
              required
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="500"
            />
          </div>

          <div v-if="isEditing">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nombre actuel d'animaux *
            </label>
            <input 
              v-model.number="form.currentAnimalCount" 
              type="number"
              min="0"
              required
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Budget (FCFA) *
            </label>
            <input 
              v-model.number="form.budget" 
              type="number"
              min="0"
              required
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="5000000"
            />
          </div>

          <div v-if="isEditing">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select 
              v-model="form.status"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Préparation">Préparation</option>
              <option value="En cours">En cours</option>
              <option value="Terminée">Terminée</option>
            </select>
          </div>

          <div v-if="isEditing">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Taux de mortalité (%) 
            </label>
            <input 
              v-model.number="form.mortality" 
              type="number"
              min="0"
              max="100"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div class="flex gap-2 justify-end pt-4 border-t">
            <button 
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
              Annuler
            </button>
            <button 
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg"
            >
              {{ isSubmitting ? 'Chargement...' : (isEditing ? 'Mettre à jour' : 'Créer') }}
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

const admin = useAdminStore()

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
        farm: farmId
      })
    }
    
    closeModal()
  } catch (error) {
    console.error('Erreur:', error)
    alert('Erreur: ' + (error.message || 'Impossible de sauvegarder'))
  } finally {
    isSubmitting.value = false
  }
}

const deleteCampaign = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette campagne?')) {
    try {
      await admin.deleteCampaign(id)
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur de suppression')
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
  const farmId = sessionStorage.getItem('currentFarm')
  if (farmId) {
    await admin.fetchCampaigns({ farm: farmId })
  } else {
    // Utiliser une ferme par défaut pour le test
    console.warn('Aucune ferme sélectionnée, utilisation d\'une ferme par défaut')
    sessionStorage.setItem('currentFarm', '507f1f77bcf86cd799439011') // ID par défaut
    await admin.fetchCampaigns({ farm: '507f1f77bcf86cd799439011' })
  }
})
</script>
