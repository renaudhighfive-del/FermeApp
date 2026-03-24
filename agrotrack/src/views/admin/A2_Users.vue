<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Utilisateurs</h1>
        <p class="text-slate-600">Gérez les utilisateurs et leurs rôles</p>
      </div>
      <button
        @click="showNewModal = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <span>+</span> Inviter Utilisateur
      </button>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-100 border-b border-slate-200">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-semibold text-slate-700">Nom</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-slate-700">Email</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-slate-700">Rôle</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-slate-700">Statut</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="user in (users || []).filter(u => u && u._id)" :key="user._id" class="hover:bg-slate-50">
              <td class="px-6 py-4 text-sm font-medium text-slate-900">{{ user.name }}</td>
              <td class="px-6 py-4 text-sm text-slate-600">{{ user.email }}</td>
              <td class="px-6 py-4 text-sm">
                <span
                  :class="{
                    'bg-blue-100 text-blue-800': user.role === 'admin',
                    'bg-purple-100 text-purple-800': user.role === 'gerant',
                    'bg-green-100 text-green-800': user.role === 'agent',
                  }"
                  class="px-3 py-1 rounded-full text-xs font-medium"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm">
                <span
                  :class="{
                    'bg-green-100 text-green-800': user.actif,
                    'bg-red-100 text-red-800': !user.actif,
                  }"
                  class="px-3 py-1 rounded-full text-xs font-medium"
                >
                  {{ user.actif ? 'Actif' : 'Inactif' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm space-x-2">
                <button @click="openDetailsModal(user)" class="text-green-600 hover:text-green-800">Voir</button>
                <button @click="openEditModal(user)" class="text-blue-600 hover:text-blue-800">Modifier</button>
                <button @click="deleteUser(user._id)" class="text-red-600 hover:text-red-800">Supprimer</button>
                <button @click="deactivateUser(user._id)" class="text-amber-600 hover:text-amber-800">
                  {{ user.actif ? 'Désactiver' : 'Activer' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Details -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-slate-800">Détails Utilisateur</h2>
          <button @click="showDetailsModal = false" class="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
        </div>
        
        <div v-if="selectedUser" class="space-y-4">
          <div class="flex flex-col items-center mb-6">
            <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-3xl font-bold text-blue-600 mb-2">
              {{ selectedUser.name.charAt(0).toUpperCase() }}
            </div>
            <h3 class="text-xl font-semibold">{{ selectedUser.name }}</h3>
            <span :class="selectedUser.actif ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium">
              ● {{ selectedUser.actif ? 'Compte Actif' : 'Compte Inactif' }}
            </span>
          </div>

          <div class="grid grid-cols-1 gap-4 bg-slate-50 p-4 rounded-lg">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
              <p class="text-slate-900 font-medium">{{ selectedUser.email }}</p>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">Rôle</label>
              <p class="capitalize text-slate-900 font-medium">{{ selectedUser.role }}</p>
            </div>
            <div v-if="selectedUser.role === 'gerant' && selectedUser.campaignsAssignees?.length">
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">Campagnes Assignées</label>
              <ul class="mt-1 space-y-1">
                <li v-for="campId in selectedUser.campaignsAssignees" :key="campId" class="text-sm text-slate-700 flex items-center gap-2">
                  <span class="w-2 h-2 bg-blue-400 rounded-full"></span>
                  {{ getCampaignName(campId) }}
                </li>
              </ul>
            </div>
            <div v-if="(selectedUser.role === 'gerant' || selectedUser.role === 'agent') && selectedUser.farms?.length">
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">Fermes Assignées</label>
              <ul class="mt-1 space-y-1">
                <li v-for="farmId in selectedUser.farms" :key="farmId" class="text-sm text-slate-700 flex items-center gap-2">
                  <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                  {{ getFarmName(farmId) }}
                </li>
              </ul>
            </div>
            <div v-if="selectedUser.role === 'agent' && selectedUser.campaignsAssignees?.length">
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">Campagne de Travail</label>
              <p class="text-slate-900 font-medium">{{ getCampaignName(selectedUser.campaignsAssignees[0]) }}</p>
            </div>
          </div>
        </div>

        <div class="mt-8">
          <button @click="showDetailsModal = false" class="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors">
            Fermer
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Edit -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-slate-800">Modifier Utilisateur</h2>
          <button @click="showEditModal = false" class="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
        </div>
        
        <form @submit.prevent="updateUser" class="space-y-4">
          <div class="flex gap-4 mb-4 border-b">
            <button 
              type="button" 
              @click="editTab = 'info'" 
              :class="editTab === 'info' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'"
              class="pb-2 px-1 border-b-2 font-medium text-sm transition-colors"
            >
              Informations
            </button>
            <button 
              type="button" 
              @click="editTab = 'password'" 
              :class="editTab === 'password' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'"
              class="pb-2 px-1 border-b-2 font-medium text-sm transition-colors"
            >
              Sécurité
            </button>
          </div>

          <div v-if="editTab === 'info'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Nom Complet</label>
              <input v-model="editingUser.name" type="text" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input v-model="editingUser.email" type="email" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Rôle</label>
              <select v-model="editingUser.role" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="admin">Administrateur</option>
                <option value="gerant">Gérant de ferme</option>
                <option value="agent">Agent de terrain</option>
              </select>
            </div>
            <div v-if="editingUser.role === 'gerant' || editingUser.role === 'agent'">
              <label class="block text-sm font-medium text-slate-700 mb-1">Ferme(s) Assignée(s)</label>
              <select v-model="editingUser.farms" multiple class="w-full px-4 py-2 border border-slate-300 rounded-lg h-24">
                <option v-for="farm in farms" :key="farm._id" :value="farm._id">
                  {{ farm.name }}
                </option>
              </select>
              <p class="text-xs text-slate-500 mt-1">Maintenez Ctrl pour sélectionner plusieurs fermes (Gérant uniquement)</p>
            </div>
            <div v-if="editingUser.role === 'gerant' || editingUser.role === 'agent'">
              <label class="block text-sm font-medium text-slate-700 mb-1">Campagne(s) Assignée(s)</label>
              <select v-model="editingUser.campaignsAssignees" multiple class="w-full px-4 py-2 border border-slate-300 rounded-lg h-24">
                <option v-for="campaign in campaigns" :key="campaign._id" :value="campaign._id">
                  {{ campaign.name }}
                </option>
              </select>
            </div>
          </div>

          <div v-if="editTab === 'password'" class="space-y-4">
            <div class="bg-amber-50 p-3 rounded text-amber-800 text-sm mb-4">
              Modifier le mot de passe de l'utilisateur.
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Nouveau mot de passe</label>
              <input v-model="newPassword" type="password" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Min. 6 caractères" />
            </div>
          </div>

          <div class="flex gap-3 mt-6 pt-4 border-t">
            <button type="button" @click="showEditModal = false" class="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50">
              Annuler
            </button>
            <button type="submit" :disabled="isSaving" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-300">
              {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Inviter -->
    <div v-if="showNewModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 class="text-xl font-bold mb-4">Inviter Utilisateur</h2>
        <form @submit.prevent="submitUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Nom</label>
            <input
              v-model="newUser.name"
              type="text"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              v-model="newUser.email"
              type="email"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
            <input
              v-model="newUser.password"
              type="password"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg"
              required
              minlength="6"
              placeholder="Minimum 6 caractères"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Rôle</label>
            <select v-model="newUser.role" class="w-full px-4 py-2 border border-slate-300 rounded-lg">
              <option value="admin">Admin</option>
              <option value="gerant">Gérant</option>
              <option value="agent">Agent</option>
            </select>
          </div>

          <div v-if="newUser.role === 'gerant' || newUser.role === 'agent'">
            <label class="block text-sm font-medium text-slate-700 mb-1">
              {{ newUser.role === 'gerant' ? 'Ferme(s) à gérer' : 'Ferme de travail' }}
            </label>
            <select
              v-model="newUser.farms"
              :multiple="newUser.role === 'gerant'"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg"
              :class="newUser.role === 'gerant' ? 'h-24' : ''"
              required
            >
              <option v-if="newUser.role === 'agent'" value="">Sélectionner une ferme</option>
              <option v-for="farm in farms" :key="farm._id" :value="farm._id">
                {{ farm.name }}
              </option>
            </select>
          </div>

          <div v-if="newUser.role === 'gerant' || newUser.role === 'agent'">
            <label class="block text-sm font-medium text-slate-700 mb-1">
              {{ newUser.role === 'gerant' ? 'Campagne(s) Assignée(s) (Optionnel)' : 'Campagne de travail' }}
            </label>
            <select
              v-model="newUser.campaignsAssignees"
              :multiple="newUser.role === 'gerant'"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg"
              :class="newUser.role === 'gerant' ? 'h-24' : ''"
              :required="newUser.role === 'agent'"
            >
              <option v-if="newUser.role === 'agent'" value="">Sélectionner une campagne</option>
              <option
                v-for="campaign in (campaigns || []).filter(c => c && c.status !== 'Terminée')"
                :key="campaign._id"
                :value="campaign._id"
              >
                {{ campaign.name }} ({{ getFarmName(campaign.farm) }})
              </option>
            </select>
          </div>
          <div class="flex gap-2">
            <button
              type="button"
              @click="showNewModal = false"
              class="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg"
            >
              Annuler
            </button>
            <button type="submit" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg">
              Inviter
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { userService } from '@/services/api'
import { useAdminStore } from '@/stores/admin'
import { useUiStore } from '@/stores/ui'

const admin = useAdminStore()
const ui = useUiStore()
const users = ref([])
const campaigns = ref([])
const farms = ref([])
const showNewModal = ref(false)
const showDetailsModal = ref(false)
const showEditModal = ref(false)
const selectedUser = ref(null)
const editingUser = ref(null)
const editTab = ref('info')
const newPassword = ref('')
const isSaving = ref(false)

const newUser = ref({
  name: '',
  email: '',
  password: '',
  role: 'agent',
  farms: [],
  campaignsAssignees: []
})

const fetchUsers = async () => {
  try {
    const response = await userService.getAll()
    users.value = response.data.users
  } catch (error) {
    console.error('Error:', error)
  }
}

const fetchFarms = async () => {
  try {
    if (admin.fetchFarms && typeof admin.fetchFarms === 'function') {
      await admin.fetchFarms()
      farms.value = admin.farms || []
    } else {
      console.warn('admin.fetchFarms is not available yet')
    }
  } catch (error) {
    console.error('Error fetching farms:', error)
  }
}

const openDetailsModal = (user) => {
  selectedUser.value = user
  showDetailsModal.value = true
}

const openEditModal = (user) => {
  editingUser.value = JSON.parse(JSON.stringify(user)) // Deep copy
  if (!editingUser.value.campaignsAssignees) {
    editingUser.value.campaignsAssignees = []
  }
  if (!editingUser.value.farms) {
    editingUser.value.farms = []
  }
  newPassword.value = ''
  editTab.value = 'info'
  showEditModal.value = true
}

const getCampaignName = (id) => {
  if (!id) return 'Sans campagne'
  const camp = (campaigns.value || []).find(c => c && c._id === id)
  return camp ? camp.name : 'Campagne inconnue'
}

const getFarmName = (id) => {
  if (!id) return 'Sans ferme'
  // Si id est déjà un objet ferme (cas où c'est déjà peuplé)
  if (id && typeof id === 'object' && id.name) return id.name
  
  const farm = (farms.value || []).find(f => f && f._id === id)
  return farm ? farm.name : 'Ferme inconnue'
}

const updateUser = async () => {
  try {
    isSaving.value = true
    
    // 1. Update basic info if on info tab
    if (editTab.value === 'info') {
      const updateData = {
        name: editingUser.value.name,
        email: editingUser.value.email,
        role: editingUser.value.role,
        farms: editingUser.value.farms.filter(id => id),
        campaignsAssignees: editingUser.value.campaignsAssignees.filter(id => id)
      }
      await userService.update(editingUser.value._id, updateData)
    } 
    // 2. Update password if on security tab
    else if (editTab.value === 'password' && newPassword.value) {
      if (newPassword.value.length < 6) {
        ui.error('Le mot de passe doit faire au moins 6 caractères')
        return
      }
      await userService.resetPassword(editingUser.value._id, newPassword.value)
    }

    showEditModal.value = false
    await fetchUsers()
    ui.success('Utilisateur mis à jour avec succès')
  } catch (error) {
    console.error('Error updating user:', error)
    ui.error('Erreur lors de la mise à jour')
  } finally {
    isSaving.value = false
  }
}

const deleteUser = async (userId) => {
  const confirm = await ui.confirm({
    title: 'Supprimer l\'utilisateur',
    message: 'Êtes-vous sûr de vouloir supprimer cet utilisateur définitivement ? Cette action est irréversible.',
    confirmText: 'Supprimer définitivement',
    type: 'danger'
  })

  if (confirm) {
    try {
      await userService.delete(userId)
      await fetchUsers()
      ui.success('Utilisateur supprimé avec succès')
    } catch (error) {
      console.error('Error deleting user:', error)
      ui.error('Erreur lors de la suppression')
    }
  }
}

const submitUser = async () => {
  try {
    isSaving.value = true
    console.log('Données utilisateur envoyées:', newUser.value)
    
    // Préparer les données pour l'envoi
    const userData = { ...newUser.value }
    
    // Validations selon le rôle
    if (userData.role === 'gerant') {
      if (!userData.farms || userData.farms.length === 0 || !userData.farms[0]) {
        ui.warning('Un gérant doit être assigné à au moins une ferme')
        return
      }
      userData.farms = userData.farms.filter(id => id)
      userData.campaignsAssignees = userData.campaignsAssignees.filter(id => id)
    } else if (userData.role === 'agent') {
      if (!userData.farms || userData.farms.length === 0 || !userData.farms[0]) {
        ui.warning('Un agent doit être assigné à une ferme')
        return
      }
      if (!userData.campaignsAssignees || userData.campaignsAssignees.length === 0 || !userData.campaignsAssignees[0]) {
        ui.warning('Un agent doit être assigné à une campagne')
        return
      }
      userData.farms = [userData.farms[0]] // Un agent travaille sur une seule ferme
      userData.campaignsAssignees = [userData.campaignsAssignees[0]] // Un agent travaille sur une seule campagne
    } else {
      // Pour admin, vider les assignations
      userData.farms = []
      userData.campaignsAssignees = []
    }
    
    await userService.create(userData)
    showNewModal.value = false
    newUser.value = { name: '', email: '', password: '', role: 'agent', farms: [], campaignsAssignees: [] }
    await fetchUsers()
    ui.success('Utilisateur invité avec succès')
  } catch (error) {
    console.error('Error:', error)
    ui.error('Erreur: ' + (error.message || 'Impossible de créer l\'utilisateur'))
  } finally {
    isSaving.value = false
  }
}

const deactivateUser = async (userId) => {
  try {
    await userService.deactivateUser(userId)
    await fetchUsers()
  } catch (error) {
    console.error('Error:', error)
  }
}

const fetchCampaigns = async () => {
  try {
    if (admin.fetchCampaigns && typeof admin.fetchCampaigns === 'function') {
      await admin.fetchCampaigns({ limit: 100 })
      campaigns.value = admin.campaigns || []
    } else {
      console.warn('admin.fetchCampaigns is not available yet')
    }
  } catch (error) {
    console.error('Error fetching campaigns:', error)
  }
}

onMounted(() => {
  fetchUsers()
  fetchFarms()
  fetchCampaigns()
})
</script>
