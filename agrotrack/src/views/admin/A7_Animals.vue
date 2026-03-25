<template>
  <div class="space-y-6 p-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold">Gestion Animaux</h1>
        <p class="text-slate-600">{{ totalAnimals }} animaux dans {{ activeCampaigns.length }} campagne(s) active(s)</p>
      </div>
      <button 
        @click="showAddModal = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Ajouter animal
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow space-y-3">
      <div class="grid grid-cols-4 gap-4">
        <div>
          <input 
            v-model="filters.search" 
            placeholder="Rechercher par ID, lot..." 
            class="w-full px-3 py-2 border rounded"
          />
        </div>
        <select v-model="filters.type" class="px-3 py-2 border rounded">
          <option value="">Tous départements</option>
          <option value="Volaille">Volaille</option>
          <option value="Bétail">Bétail</option>
          <option value="Pisciculture">Pisciculture</option>
        </select>
        <select v-model="filters.campaign" class="px-3 py-2 border rounded">
          <option value="">Toutes campagnes</option>
          <option v-for="campaign in campaigns" :key="campaign._id" :value="campaign._id">
            {{ campaign.name }}
          </option>
        </select>
        <select v-model="filters.healthStatus" class="px-3 py-2 border rounded">
          <option value="">Tous statuts santé</option>
          <option value="Sain">Sain</option>
          <option value="Malade">Malade</option>
          <option value="Suspect">Suspect</option>
          <option value="Décédé">Décédé</option>
        </select>
      </div>
      <button 
        @click="resetFilters"
        class="text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        Réinitialiser filtres
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

    <!-- Table -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="filteredAnimals.length > 0" class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Campagne</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Poids</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Santé</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Vaccins</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date Naissance</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="animal in paginatedAnimals" :key="animal._id" class="hover:bg-gray-50">
              <td class="px-6 py-4 font-medium text-blue-600">{{ animal.idNumber }}</td>
              <td class="px-6 py-4 text-sm">{{ animal.campaign?.name || 'N/A' }}</td>
              <td class="px-6 py-4 text-sm">{{ animal.type }}</td>
              <td class="px-6 py-4">{{ animal.weight || 'N/A' }} kg</td>
              <td class="px-6 py-4">
                <span 
                  :class="{
                    'bg-green-100 text-green-800': animal.healthStatus === 'Sain',
                    'bg-red-100 text-red-800': animal.healthStatus === 'Malade',
                    'bg-yellow-100 text-yellow-800': animal.healthStatus === 'Suspect',
                    'bg-gray-100 text-gray-800': animal.healthStatus === 'Décédé',
                  }"
                  class="px-3 py-1 rounded-full text-sm font-medium inline-block"
                >
                  {{ animal.healthStatus }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm">{{ animal.vaccinations?.length || 0 }}/4</td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ animal.dateOfBirth ? new Date(animal.dateOfBirth).toLocaleDateString('fr-FR') : 'N/A' }}
              </td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <button 
                    @click="openDetailsModal(animal)"
                    class="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    Voir Détails
                  </button>
                  <button 
                    @click="openEditModal(animal)"
                    class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Modifier
                  </button>
                  <button 
                    @click="deleteAnimal(animal._id)"
                    class="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">Aucun animal</h3>
        <p class="mt-1 text-gray-500">Aucun animal ne correspond aux filtres selectionnés</p>
      </div>

      <!-- Pagination -->
      <div v-if="filteredAnimals.length > 0" class="flex justify-between items-center p-4 border-t bg-gray-50">
        <div class="text-sm text-gray-600">
          Affichage {{ (currentPage - 1) * itemsPerPage + 1 }} à {{ Math.min(currentPage * itemsPerPage, filteredAnimals.length) }} sur {{ filteredAnimals.length }}
        </div>
        <div class="flex gap-2">
          <button 
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1 border rounded disabled:opacity-50"
          >
            ‹
          </button>
          <button 
            v-for="page in totalPages" 
            :key="page"
            @click="currentPage = page"
            :class="{ 'bg-blue-600 text-white': currentPage === page }"
            class="px-3 py-1 border rounded"
          >
            {{ page }}
          </button>
          <button 
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 border rounded disabled:opacity-50"
          >
            ›
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Détails Animal -->
    <div v-if="showDetailsModal && selectedAnimal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl max-h-96 overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Détails de l'Animal</h2>
          <button 
            @click="closeDetailsModal"
            class="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <!-- Colonne 1 -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">ID Animal</label>
              <p class="text-gray-900 font-medium">{{ selectedAnimal.idNumber }}</p>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Type</label>
              <p class="text-gray-900">{{ selectedAnimal.type }}</p>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Race/Variété</label>
              <p class="text-gray-900">{{ selectedAnimal.breed || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Poids</label>
              <p class="text-gray-900">{{ selectedAnimal.weight || 'N/A' }} kg</p>
            </div>
          </div>

          <!-- Colonne 2 -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Campagne</label>
              <p class="text-gray-900">{{ selectedAnimal.campaign?.name || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Statut sanitaire</label>
              <span 
                :class="{
                  'bg-green-100 text-green-800': selectedAnimal.healthStatus === 'Sain',
                  'bg-red-100 text-red-800': selectedAnimal.healthStatus === 'Malade',
                  'bg-yellow-100 text-yellow-800': selectedAnimal.healthStatus === 'Suspect',
                  'bg-gray-100 text-gray-800': selectedAnimal.healthStatus === 'Décédé',
                }"
                class="px-3 py-1 rounded-full text-sm font-medium inline-block"
              >
                {{ selectedAnimal.healthStatus }}
              </span>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Date de naissance</label>
              <p class="text-gray-900">{{ selectedAnimal.dateOfBirth ? new Date(selectedAnimal.dateOfBirth).toLocaleDateString('fr-FR') : 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Vaccinations</label>
              <p class="text-gray-900">{{ selectedAnimal.vaccinations?.length || 0 }} vaccin(s)</p>
            </div>
          </div>

          <!-- Notes pleine largeur -->
          <div class="col-span-2" v-if="selectedAnimal.notes">
            <label class="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
            <p class="text-gray-900 bg-gray-50 p-3 rounded">{{ selectedAnimal.notes }}</p>
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
            @click="openEditModal(selectedAnimal)"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Modifier
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Modifier Animal -->
    <div v-if="showEditModal && selectedAnimal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl max-h-96 overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Modifier Animal</h2>
          <button 
            @click="closeEditModal"
            class="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form @submit.prevent="submitEditAnimal" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <!-- ID Animal (non modifiable) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ID Animal</label>
              <input 
                :value="editForm.idNumber" 
                disabled
                class="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600"
              />
            </div>

            <!-- Type (non modifiable) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <input 
                :value="editForm.type" 
                disabled
                class="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600"
              />
            </div>

            <!-- Poids -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Poids (kg)</label>
              <input 
                v-model.number="editForm.weight" 
                type="number"
                step="0.01"
                min="0"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Statut sanitaire -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Statut sanitaire</label>
              <select 
                v-model="editForm.healthStatus"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Sain">Sain</option>
                <option value="Suspect">Suspect</option>
                <option value="Malade">Malade</option>
                <option value="Décédé">Décédé</option>
              </select>
            </div>

            <!-- Race/Variété -->
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Race/Variété</label>
              <input 
                v-model="editForm.breed" 
                type="text"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Notes -->
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea 
                v-model="editForm.notes" 
                rows="3"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-6 border-t mt-6">
            <button 
              type="button"
              @click="closeEditModal"
              class="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
              Annuler
            </button>
            <button 
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg"
            >
              {{ isSubmitting ? 'Mise à jour...' : 'Mettre à jour' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Ajouter Animal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl max-h-96 overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Ajouter Animal</h2>
          <button 
            @click="closeAddModal"
            class="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form @submit.prevent="submitAddAnimal" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <!-- ID Animal -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ID Animal *</label>
              <input 
                v-model="animalForm.idNumber" 
                type="text"
                required
                placeholder="VOL-001"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Type d'animal -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type d'animal *</label>
              <select 
                v-model="animalForm.type" 
                required
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner...</option>
                <option value="Volaille">Volaille</option>
                <option value="Bétail">Bétail</option>
                <option value="Pisciculture">Pisciculture</option>
              </select>
            </div>

            <!-- Ferme -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ferme *</label>
              <select 
                v-model="animalForm.farm" 
                required
                @change="onFarmChange"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner une ferme...</option>
                <option v-for="farm in farms" :key="farm._id" :value="farm._id">
                  {{ farm.name }}
                </option>
              </select>
            </div>

            <!-- Campagne -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Campagne *</label>
              <select 
                v-model="animalForm.campaign" 
                required
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">Sélectionner une campagne...</option>
                <option v-for="campaign in filteredCampaigns" :key="campaign._id" :value="campaign._id">
                  {{ campaign.name }} ({{ campaign.animalType }})
                </option>
              </select>
            </div>

            <!-- Poids -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Poids (kg) *</label>
              <input 
                v-model.number="animalForm.weight" 
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="1.35"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Date de naissance -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date de naissance *</label>
              <input 
                v-model="animalForm.dateOfBirth" 
                type="date"
                required
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Statut sanitaire -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Statut sanitaire</label>
              <select 
                v-model="animalForm.healthStatus"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Sain">Sain</option>
                <option value="Suspect">Suspect</option>
                <option value="Malade">Malade</option>
                <option value="Décédé">Décédé</option>
              </select>
            </div>

            <!-- Race/Variété -->
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Race/Variété</label>
              <input 
                v-model="animalForm.breed" 
                type="text"
                placeholder="Ex: Sussex, Tilapia Rouge..."
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Notes -->
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea 
                v-model="animalForm.notes" 
                placeholder="Notes additionnelles..."
                rows="3"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-6 border-t mt-6">
            <button 
              type="button"
              @click="closeAddModal"
              class="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
              Annuler
            </button>
            <button 
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg"
            >
              {{ isSubmitting ? 'Ajout en cours...' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { useUiStore } from '@/stores/ui'
import { farmService } from '@/services/api'

const admin = useAdminStore()
const ui = useUiStore()
const showAddModal = ref(false)
const showDetailsModal = ref(false)
const showEditModal = ref(false)
const selectedAnimal = ref(null)
const isSubmitting = ref(false)
const currentPage = ref(1)
const itemsPerPage = 20
const farms = ref([])

// Form state for add
const animalForm = reactive({
  idNumber: '',
  type: '',
  farm: '',
  campaign: '',
  weight: 0,
  dateOfBirth: '',
  healthStatus: 'Sain',
  breed: '',
  notes: ''
})

// Form state for edit
const editForm = reactive({
  idNumber: '',
  type: '',
  weight: 0,
  healthStatus: 'Sain',
  breed: '',
  notes: ''
})

// Filters
const filters = reactive({
  search: '',
  type: '',
  campaign: '',
  healthStatus: ''
})

// Computed
const campaigns = computed(() => admin.campaigns)

const filteredCampaigns = computed(() => {
  // Temporairement, retourner toutes les campagnes pour debug
  if (!animalForm.farm) {
    console.log('Pas de ferme sélectionnée, retour de toutes les campagnes')
    return admin.campaigns
  }
  
  console.log('Ferme sélectionnée:', animalForm.farm)
  console.log('Campagnes disponibles:', admin.campaigns)
  
  const filtered = admin.campaigns.filter(campaign => {
    // Convertir l'ObjectId en string pour la comparaison
    const campaignFarmId = campaign.farm?._id || campaign.farm
    const match = campaignFarmId.toString() === animalForm.farm.toString()
    console.log(`Campagne ${campaign.name} - Ferme: ${campaignFarmId} - Match: ${match}`)
    return match
  })
  
  console.log('Campagnes filtrées:', filtered)
  return filtered
})

const activeCampaigns = computed(() => 
  admin.campaigns.filter(c => c.status === 'En cours')
)

const totalAnimals = computed(() => admin.animals.length)

const filteredAnimals = computed(() => {
  return admin.animals.filter(animal => {
    const matchSearch = animal.idNumber?.toLowerCase().includes(filters.search.toLowerCase()) || false
    const matchType = !filters.type || animal.type === filters.type
    const matchCampaign = !filters.campaign || animal.campaign?._id === filters.campaign
    const matchHealth = !filters.healthStatus || animal.healthStatus === filters.healthStatus
    
    return matchSearch && matchType && matchCampaign && matchHealth
  })
})

const totalPages = computed(() => 
  Math.ceil(filteredAnimals.value.length / itemsPerPage)
)

const paginatedAnimals = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredAnimals.value.slice(start, end)
})

// Methods
const onFarmChange = () => {
  // Réinitialiser la campagne quand la ferme change
  animalForm.campaign = ''
}

const fetchFarms = async () => {
  try {
    const response = await farmService.getAll()
    farms.value = response.data.farms || []
  } catch (error) {
    console.error('Erreur lors du chargement des fermes:', error)
  }
}

const resetFilters = () => {
  filters.search = ''
  filters.type = ''
  filters.campaign = ''
  filters.healthStatus = ''
  currentPage.value = 1
}

const closeAddModal = () => {
  showAddModal.value = false
  resetAnimalForm()
}

const resetAnimalForm = () => {
  animalForm.idNumber = ''
  animalForm.type = ''
  animalForm.farm = ''
  animalForm.campaign = ''
  animalForm.weight = 0
  animalForm.dateOfBirth = ''
  animalForm.healthStatus = 'Sain'
  animalForm.breed = ''
  animalForm.notes = ''
}

const submitAddAnimal = async () => {
  try {
    isSubmitting.value = true
    
    if (!animalForm.farm) {
      throw new Error('Veuillez sélectionner une ferme')
    }
    
    if (!animalForm.campaign) {
      throw new Error('Veuillez sélectionner une campagne')
    }
    
    const newAnimal = {
      idNumber: animalForm.idNumber,
      type: animalForm.type,
      farm: animalForm.farm,
      campaign: animalForm.campaign,
      weight: animalForm.weight,
      dateOfBirth: animalForm.dateOfBirth,
      healthStatus: animalForm.healthStatus,
      breed: animalForm.breed,
      notes: animalForm.notes
    }
    
    await admin.addAnimal(newAnimal)
    closeAddModal()
    // Reset page to 1 to see new animal
    currentPage.value = 1
    ui.success('Animal ajouté avec succès')
  } catch (error) {
    console.error('Erreur:', error)
    ui.error('Erreur: ' + (error.message || 'Impossible d\'ajouter l\'animal'))
  } finally {
    isSubmitting.value = false
  }
}

const openDetailsModal = (animal) => {
  selectedAnimal.value = animal
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedAnimal.value = null
}

const openEditModal = (animal) => {
  selectedAnimal.value = animal
  editForm.idNumber = animal.idNumber
  editForm.type = animal.type
  editForm.weight = animal.weight || 0
  editForm.healthStatus = animal.healthStatus
  editForm.breed = animal.breed || ''
  editForm.notes = animal.notes || ''
  showDetailsModal.value = false
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedAnimal.value = null
}

const submitEditAnimal = async () => {
  try {
    isSubmitting.value = true
    
    const updatedData = {
      weight: editForm.weight,
      healthStatus: editForm.healthStatus,
      breed: editForm.breed,
      notes: editForm.notes
    }
    
    // Update animal in store
    await admin.updateAnimal(selectedAnimal.value._id, updatedData)
    closeEditModal()
    ui.success('Informations de l\'animal mises à jour')
  } catch (error) {
    console.error('Erreur:', error)
    ui.error('Erreur: ' + (error.message || 'Impossible de modifier l\'animal'))
  } finally {
    isSubmitting.value = false
  }
}

const deleteAnimal = async (animalId) => {
  const confirm = await ui.confirm({
    title: 'Supprimer l\'animal',
    message: 'Êtes-vous sûr de vouloir supprimer cet animal ? Cette action est irréversible.',
    confirmText: 'Supprimer',
    type: 'danger'
  })

  if (confirm) {
    try {
      await admin.deleteAnimal(animalId)
      ui.success('Animal supprimé avec succès')
    } catch (error) {
      console.error('Erreur:', error)
      ui.error('Erreur de suppression')
    }
  }
}

// Init
onMounted(async () => {
  try {
    console.log('Chargement initial des données...')
    
    // Charger les fermes
    await fetchFarms()
    console.log('Fermes chargées:', farms.value)
    
    // Charger les campagnes et animaux
    await admin.fetchCampaigns()
    console.log('Campagnes chargées:', admin.campaigns)
    
    await admin.fetchAnimals()
    console.log('Animaux chargés:', admin.animals)
  } catch (error) {
    console.error('Erreur lors du chargement initial:', error)
  }
})
</script>

