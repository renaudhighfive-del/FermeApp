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
            <tr v-for="user in users" :key="user._id" class="hover:bg-slate-50">
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
                <button class="text-blue-600 hover:text-blue-800">Éditer</button>
                <button @click="deactivateUser(user._id)" class="text-red-600 hover:text-red-800">
                  {{ user.actif ? 'Désactiver' : 'Activer' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
          <div v-if="newUser.role === 'gerant'">
            <label class="block text-sm font-medium text-slate-700 mb-1">Campagne Assignée</label>
            <select
              v-model="newUser.campaignsAssignees[0]"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg"
              required
            >
              <option value="">Sélectionner une campagne</option>
              <option
                v-for="campaign in campaigns.filter(c => c.status !== 'Terminée')"
                :key="campaign._id"
                :value="campaign._id"
              >
                {{ campaign.name }} ({{ campaign.animalType }})
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Rôle</label>
            <select v-model="newUser.role" class="w-full px-4 py-2 border border-slate-300 rounded-lg">
              <option value="admin">Admin</option>
              <option value="gerant">Gérant</option>
              <option value="agent">Agent</option>
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

const admin = useAdminStore()
const users = ref([])
const campaigns = ref([])
const showNewModal = ref(false)
const newUser = ref({
  name: '',
  email: '',
  password: '',
  role: 'agent',
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

const submitUser = async () => {
  try {
    console.log('Données utilisateur envoyées:', newUser.value)
    
    // Préparer les données pour l'envoi
    const userData = { ...newUser.value }
    
    // Si le rôle est gérant, s'assurer qu'une campagne est bien sélectionnée
    if (userData.role === 'gerant') {
      if (!userData.campaignsAssignees[0]) {
        throw new Error('Un gérant doit avoir au moins une campagne assignée')
      }
      // Filtrer les valeurs vides et s'assurer que c'est un tableau
      userData.campaignsAssignees = userData.campaignsAssignees.filter(id => id)
    } else {
      // Pour les autres rôles, vider les campagnes assignées
      userData.campaignsAssignees = []
    }
    
    await userService.create(userData)
    showNewModal.value = false
    newUser.value = { name: '', email: '', password: '', role: 'agent', campaignsAssignees: [] }
    await fetchUsers()
  } catch (error) {
    console.error('Error:', error)
    alert('Erreur: ' + (error.message || 'Impossible de créer l\'utilisateur'))
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
    const response = await admin.fetchCampaigns()
    campaigns.value = admin.campaigns
  } catch (error) {
    console.error('Error fetching campaigns:', error)
  }
}

onMounted(() => {
  fetchUsers()
  fetchCampaigns()
})
</script>
