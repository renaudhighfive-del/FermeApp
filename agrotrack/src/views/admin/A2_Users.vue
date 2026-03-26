<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-[var(--text)]">Utilisateurs</h1>
        <p class="text-[var(--soft)]">Gérez les utilisateurs et leurs rôles</p>
      </div>
      <button
        @click="showNewModal = true"
        class="btn btn-primary"
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        <span>Inviter Utilisateur</span>
      </button>
    </div>

    <!-- Users Table -->
    <div class="table-container">
      <div class="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th class="hide-mobile">Email</th>
              <th>Rôle</th>
              <th class="hide-mobile">Statut</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in (users || []).filter(u => u && u._id)" :key="user._id">
              <td class="font-bold text-[var(--text)]">{{ user.name }}</td>
              <td class="hide-mobile text-[var(--soft)]">{{ user.email }}</td>
              <td>
                <span
                  :class="{
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400': user.role === 'admin',
                    'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400': user.role === 'gerant',
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400': user.role === 'agent',
                  }"
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="hide-mobile">
                <span
                  :class="user.actif ? 'bg-[var(--success)]/10 text-[var(--success)]' : 'bg-[var(--danger)]/10 text-[var(--danger)]'"
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                >
                  {{ user.actif ? 'Actif' : 'Inactif' }}
                </span>
              </td>
              <td class="text-right space-x-1 whitespace-nowrap">
                <button @click="openDetailsModal(user)" class="p-2 text-[var(--success)] hover:bg-[var(--success)]/10 rounded-lg transition-colors" title="Détails">
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
                <button @click="openEditModal(user)" class="p-2 text-[var(--primary)] hover:bg-[var(--bg)] rounded-lg transition-colors" title="Modifier">
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button @click="deleteUser(user._id)" class="p-2 text-[var(--danger)] hover:bg-[var(--danger)]/10 rounded-lg transition-colors" title="Supprimer">
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
                </button>
                <button @click="deactivateUser(user._id)" :class="user.actif ? 'text-[var(--warn)]' : 'text-[var(--success)]'" class="p-2 hover:bg-[var(--bg)] rounded-lg transition-colors" :title="user.actif ? 'Désactiver' : 'Activer'">
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10"/></svg>
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
import { userService, farmService, campaignService } from '@/services/api'
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
    const response = await farmService.getAll()
    farms.value = response.data.farms || response.data || []
    console.log('Farms loaded:', farms.value)
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
    
    // Préparer les données pour l'envoi - conversion propre du Vue Proxy
    const userData = JSON.parse(JSON.stringify(newUser.value))
    
    // Nettoyer les données
    userData.name = userData.name?.trim() || ''
    userData.email = userData.email?.trim().toLowerCase() || ''
    userData.password = userData.password || ''
    userData.role = userData.role || 'agent'
    
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
    
    // Ajouter le statut actif par défaut
    userData.actif = true
    
    console.log('Données finales envoyées à l\'API:', userData)
    
    const response = await userService.create(userData)
    console.log('Réponse de l\'API:', response.data)
    
    showNewModal.value = false
    newUser.value = { name: '', email: '', password: '', role: 'agent', farms: [], campaignsAssignees: [] }
    await fetchUsers()
    ui.success('Utilisateur invité avec succès')
  } catch (error) {
    console.error('Error:', error)
    console.error('Error response:', error.response?.data)
    
    // Afficher un message d'erreur plus précis
    let errorMessage = 'Impossible de créer l\'utilisateur'
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error
    } else if (error.message) {
      errorMessage = error.message
    }
    
    ui.error('Erreur: ' + errorMessage)
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
    const response = await campaignService.getAll()
    campaigns.value = response.data.campaigns || response.data || []
    console.log('Campaigns loaded:', campaigns.value)
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
