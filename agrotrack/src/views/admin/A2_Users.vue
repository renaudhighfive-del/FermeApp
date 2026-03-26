<template>
  <div class="users-container">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title holographic-text">Utilisateurs</h1>
        <p class="page-subtitle">Gérez les utilisateurs et leurs rôles</p>
      </div>
      <button
        @click="showNewModal = true"
        class="cyber-button primary"
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        <span>Inviter Utilisateur</span>
      </button>
    </div>

    <!-- Users Table Card -->
    <div class="glass-card table-card">
      <div class="table-container">
        <table class="cyber-table">
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
              <td class="font-bold">{{ user.name }}</td>
              <td class="hide-mobile muted">{{ user.email }}</td>
              <td>
                <span :class="getRoleBadgeClass(user.role)" class="role-badge">
                  {{ user.role }}
                </span>
              </td>
              <td class="hide-mobile">
                <span :class="user.actif ? 'status-success' : 'status-danger'" class="status-badge">
                  {{ user.actif ? 'Actif' : 'Inactif' }}
                </span>
              </td>
              <td class="text-right actions-cell">
                <button @click="openDetailsModal(user)" class="action-btn success" title="Détails">
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
                <button @click="openEditModal(user)" class="action-btn primary" title="Modifier">
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button @click="deleteUser(user._id)" class="action-btn danger" title="Supprimer">
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
                </button>
                <button @click="deactivateUser(user._id)" :class="user.actif ? 'warning' : 'success'" class="action-btn" :title="user.actif ? 'Désactiver' : 'Activer'">
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10"/></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Details -->
    <div v-if="showDetailsModal" class="modal-overlay" @click.self="showDetailsModal = false">
      <div class="glass-card modal-card">
        <div class="modal-header">
          <h2 class="modal-title">Détails Utilisateur</h2>
          <button @click="showDetailsModal = false" class="modal-close">&times;</button>
        </div>
        
        <div v-if="selectedUser" class="modal-body">
          <div class="user-profile">
            <div class="user-avatar-large">
              {{ selectedUser.name.charAt(0).toUpperCase() }}
            </div>
            <h3 class="user-name">{{ selectedUser.name }}</h3>
            <span :class="selectedUser.actif ? 'status-success' : 'status-danger'" class="user-status">
              {{ selectedUser.actif ? 'Compte Actif' : 'Compte Inactif' }}
            </span>
          </div>

          <div class="user-details-grid">
            <div class="detail-item">
              <label class="detail-label">Email</label>
              <p class="detail-value">{{ selectedUser.email }}</p>
            </div>
            <div class="detail-item">
              <label class="detail-label">Rôle</label>
              <p class="detail-value capitalize">{{ selectedUser.role }}</p>
            </div>
            <div v-if="selectedUser.role === 'gerant' && selectedUser.campaignsAssignees?.length" class="detail-item full-width">
              <label class="detail-label">Campagnes Assignées</label>
              <ul class="detail-list">
                <li v-for="campId in selectedUser.campaignsAssignees" :key="campId">
                  <span class="list-dot primary"></span>
                  {{ getCampaignName(campId) }}
                </li>
              </ul>
            </div>
            <div v-if="(selectedUser.role === 'gerant' || selectedUser.role === 'agent') && selectedUser.farms?.length" class="detail-item full-width">
              <label class="detail-label">Fermes Assignées</label>
              <ul class="detail-list">
                <li v-for="farmId in selectedUser.farms" :key="farmId">
                  <span class="list-dot success"></span>
                  {{ getFarmName(farmId) }}
                </li>
              </ul>
            </div>
            <div v-if="selectedUser.role === 'agent' && selectedUser.campaignsAssignees?.length" class="detail-item">
              <label class="detail-label">Campagne de Travail</label>
              <p class="detail-value">{{ getCampaignName(selectedUser.campaignsAssignees[0]) }}</p>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="showDetailsModal = false" class="cyber-button secondary">
            Fermer
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Edit -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
      <div class="glass-card modal-card">
        <div class="modal-header">
          <h2 class="modal-title">Modifier Utilisateur</h2>
          <button @click="showEditModal = false" class="modal-close">&times;</button>
        </div>
        
        <form @submit.prevent="updateUser" class="modal-form">
          <div class="form-tabs">
            <button 
              type="button" 
              @click="editTab = 'info'" 
              :class="editTab === 'info' ? 'active' : ''"
              class="tab-btn"
            >
              Informations
            </button>
            <button 
              type="button" 
              @click="editTab = 'password'" 
              :class="editTab === 'password' ? 'active' : ''"
              class="tab-btn"
            >
              Sécurité
            </button>
          </div>

          <div v-if="editTab === 'info'" class="form-section">
            <div class="form-group">
              <label class="form-label">Nom Complet</label>
              <input v-model="editingUser.name" type="text" class="cyber-input" required />
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input v-model="editingUser.email" type="email" class="cyber-input" required />
            </div>
            <div class="form-group">
              <label class="form-label">Rôle</label>
              <select v-model="editingUser.role" class="cyber-select">
                <option value="admin">Administrateur</option>
                <option value="gerant">Gérant de ferme</option>
                <option value="agent">Agent de terrain</option>
              </select>
            </div>
            <div v-if="editingUser.role === 'gerant' || editingUser.role === 'agent'" class="form-group">
              <label class="form-label">Ferme(s) Assignée(s)</label>
              <select v-model="editingUser.farms" multiple class="cyber-select multi">
                <option v-for="farm in farms" :key="farm._id" :value="farm._id">
                  {{ farm.name }}
                </option>
              </select>
              <p class="form-hint">Maintenez Ctrl pour sélectionner plusieurs fermes (Gérant uniquement)</p>
            </div>
            <div v-if="editingUser.role === 'gerant' || editingUser.role === 'agent'" class="form-group">
              <label class="form-label">Campagne(s) Assignée(s)</label>
              <select v-model="editingUser.campaignsAssignees" multiple class="cyber-select multi">
                <option v-for="campaign in campaigns" :key="campaign._id" :value="campaign._id">
                  {{ campaign.name }}
                </option>
              </select>
            </div>
          </div>

          <div v-if="editTab === 'password'" class="form-section">
            <div class="form-alert warning">
              Modifier le mot de passe de l'utilisateur.
            </div>
            <div class="form-group">
              <label class="form-label">Nouveau mot de passe</label>
              <input v-model="newPassword" type="password" class="cyber-input" placeholder="Min. 6 caractères" />
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="showEditModal = false" class="cyber-button secondary">
              Annuler
            </button>
            <button type="submit" :disabled="isSaving" class="cyber-button primary">
              {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Inviter -->
    <div v-if="showNewModal" class="modal-overlay" @click.self="showNewModal = false">
      <div class="glass-card modal-card">
        <div class="modal-header">
          <h2 class="modal-title">Inviter Utilisateur</h2>
          <button @click="showNewModal = false" class="modal-close">&times;</button>
        </div>
        <form @submit.prevent="submitUser" class="modal-form">
          <div class="form-group">
            <label class="form-label">Nom</label>
            <input v-model="newUser.name" type="text" class="cyber-input" required />
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input v-model="newUser.email" type="email" class="cyber-input" required />
          </div>
          <div class="form-group">
            <label class="form-label">Mot de passe</label>
            <input v-model="newUser.password" type="password" class="cyber-input" required minlength="6" placeholder="Minimum 6 caractères" />
          </div>
          <div class="form-group">
            <label class="form-label">Rôle</label>
            <select v-model="newUser.role" class="cyber-select">
              <option value="admin">Admin</option>
              <option value="gerant">Gérant</option>
              <option value="agent">Agent</option>
            </select>
          </div>

          <div v-if="newUser.role === 'gerant' || newUser.role === 'agent'" class="form-group">
            <label class="form-label">{{ newUser.role === 'gerant' ? 'Ferme(s) à gérer' : 'Ferme de travail' }}</label>
            <select v-model="newUser.farms" :multiple="newUser.role === 'gerant'" class="cyber-select" :class="newUser.role === 'gerant' ? 'multi' : ''" required>
              <option v-if="newUser.role === 'agent'" value="">Sélectionner une ferme</option>
              <option v-for="farm in farms" :key="farm._id" :value="farm._id">{{ farm.name }}</option>
            </select>
          </div>

          <div v-if="newUser.role === 'gerant' || newUser.role === 'agent'" class="form-group">
            <label class="form-label">{{ newUser.role === 'gerant' ? 'Campagne(s) Assignée(s) (Optionnel)' : 'Campagne de travail' }}</label>
            <select v-model="newUser.campaignsAssignees" :multiple="newUser.role === 'gerant'" class="cyber-select" :class="newUser.role === 'gerant' ? 'multi' : ''" :required="newUser.role === 'agent'">
              <option v-if="newUser.role === 'agent'" value="">Sélectionner une campagne</option>
              <option v-for="campaign in (campaigns || []).filter(c => c && c.status !== 'Terminée')" :key="campaign._id" :value="campaign._id">
                {{ campaign.name }} ({{ getFarmName(campaign.farm) }})
              </option>
            </select>
          </div>

          <div class="form-actions">
            <button type="button" @click="showNewModal = false" class="cyber-button secondary">
              Annuler
            </button>
            <button type="submit" class="cyber-button primary">
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
  if (id && typeof id === 'object' && id.name) return id.name
  
  const farm = (farms.value || []).find(f => f && f._id === id)
  return farm ? farm.name : 'Ferme inconnue'
}

const getRoleBadgeClass = (role) => {
  const classes = {
    admin: 'role-admin',
    gerant: 'role-gerant',
    agent: 'role-agent'
  }
  return classes[role] || 'role-default'
}

const updateUser = async () => {
  try {
    isSaving.value = true
    
    if (editTab.value === 'info') {
      const updateData = {
        name: editingUser.value.name,
        email: editingUser.value.email,
        role: editingUser.value.role,
        farms: editingUser.value.farms.filter(id => id),
        campaignsAssignees: editingUser.value.campaignsAssignees.filter(id => id)
      }
      await userService.update(editingUser.value._id, updateData)
    } else if (editTab.value === 'password' && newPassword.value) {
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
    
    const userData = { ...newUser.value }
    
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
      userData.farms = [userData.farms[0]]
      userData.campaignsAssignees = [userData.campaignsAssignees[0]]
    } else {
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

<style scoped>
/* Container */
.users-container {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
    padding: var(--gap-lg);
    animation: fadeInUp 0.5s ease-out;
}

/* Page Header */
.page-header {
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
    margin-bottom: var(--gap-sm);
}

@media (min-width: 640px) {
    .page-header {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
}

.header-content {
    display: flex;
    flex-direction: column;
}

.page-title {
    font-family: var(--font-display);
    font-size: 28px;
    font-weight: 700;
    margin-bottom: var(--gap-xs);
}

.holographic-text {
    background: var(--gradient-hologram);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: holographic 3s ease infinite;
}

.page-subtitle {
    font-size: 14px;
    color: var(--text-tertiary);
}

/* Cyber Button */
.cyber-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-sm);
    padding: var(--gap-sm) var(--gap-md);
    font-family: var(--font-heading);
    font-size: 13px;
    font-weight: 600;
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: var(--transition-base);
    border: var(--border-thin) solid transparent;
}

.cyber-button.primary {
    background: var(--gradient-primary);
    color: var(--text-inverse);
    box-shadow: var(--glow-primary);
}

.cyber-button.primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--glow-primary), 0 8px 20px rgba(10, 77, 60, 0.3);
}

.cyber-button.secondary {
    background: var(--glass-bg);
    border-color: var(--glass-border);
    color: var(--text-secondary);
}

.cyber-button.secondary:hover {
    border-color: var(--primary);
    color: var(--primary);
}

.cyber-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Glass Card */
.glass-card {
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: var(--border-thin) solid var(--glass-border);
    border-radius: var(--radius-xl);
    box-shadow: var(--glass-shadow);
}

/* Table Card */
.table-card {
    padding: var(--gap-lg);
}

/* Table Container */
.table-container {
    overflow-x: auto;
}

/* Cyber Table */
.cyber-table {
    width: 100%;
    border-collapse: collapse;
}

.cyber-table th {
    text-align: left;
    padding: var(--gap-sm) var(--gap-md);
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-tertiary);
    border-bottom: var(--border-thin) solid var(--glass-border);
}

.cyber-table td {
    padding: var(--gap-md);
    font-size: 14px;
    color: var(--text-primary);
    border-bottom: var(--border-thin) solid var(--glass-border);
}

.cyber-table tbody tr {
    transition: var(--transition-base);
}

.cyber-table tbody tr:hover {
    background: rgba(var(--bg-rgb, 250, 248, 245), 0.5);
}

.cyber-table .muted {
    color: var(--text-tertiary);
}

/* Role Badge */
.role-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: var(--radius-full);
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
}

.role-admin {
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
}

.role-gerant {
    background: rgba(168, 85, 247, 0.1);
    color: #a855f7;
}

.role-agent {
    background: rgba(34, 197, 94, 0.1);
    color: #22c55e;
}

.role-default {
    background: var(--glass-bg);
    color: var(--text-secondary);
}

/* Status Badge */
.status-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: var(--radius-full);
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
}

.status-success {
    background: rgba(45, 106, 79, 0.1);
    color: var(--success);
}

.status-danger {
    background: rgba(214, 40, 40, 0.1);
    color: var(--danger);
}

/* Action Buttons */
.actions-cell {
    display: flex;
    gap: 4px;
    justify-content: flex-end;
}

.action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: var(--radius-md);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: var(--transition-base);
}

.action-btn.success {
    color: var(--success);
}

.action-btn.success:hover {
    background: rgba(45, 106, 79, 0.1);
}

.action-btn.primary {
    color: var(--primary);
}

.action-btn.primary:hover {
    background: rgba(10, 77, 60, 0.1);
}

.action-btn.danger {
    color: var(--danger);
}

.action-btn.danger:hover {
    background: rgba(214, 40, 40, 0.1);
}

.action-btn.warning {
    color: var(--warn);
}

.action-btn.warning:hover {
    background: rgba(224, 123, 57, 0.1);
}

/* Modal */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    padding: var(--gap-lg);
}

.modal-card {
    width: 100%;
    max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
    animation: fadeInUp 0.3s ease-out;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--gap-lg);
    border-bottom: var(--border-thin) solid var(--glass-border);
}

.modal-title {
    font-family: var(--font-heading);
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
}

.modal-close {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    font-size: 24px;
    color: var(--text-tertiary);
    cursor: pointer;
    border-radius: var(--radius-md);
    transition: var(--transition-base);
}

.modal-close:hover {
    background: var(--glass-bg);
    color: var(--text-primary);
}

.modal-body {
    padding: var(--gap-lg);
}

.modal-footer {
    padding: var(--gap-lg);
    border-top: var(--border-thin) solid var(--glass-border);
}

.modal-form {
    padding: var(--gap-lg);
}

/* User Profile */
.user-profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: var(--gap-lg);
}

.user-avatar-large {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--gradient-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: 700;
    color: var(--text-inverse);
    margin-bottom: var(--gap-sm);
}

.user-name {
    font-family: var(--font-heading);
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--gap-xs);
}

.user-status {
    font-size: 13px;
    font-weight: 500;
}

/* User Details Grid */
.user-details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--gap-md);
}

.detail-item {
    display: flex;
    flex-direction: column;
}

.detail-item.full-width {
    grid-column: 1 / -1;
}

.detail-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-tertiary);
    margin-bottom: var(--gap-xs);
}

.detail-value {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
}

.detail-list {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
    margin: 0;
    padding: 0;
    list-style: none;
}

.detail-list li {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    font-size: 13px;
    color: var(--text-secondary);
}

.list-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.list-dot.primary {
    background: var(--primary);
}

.list-dot.success {
    background: var(--success);
}

/* Form Tabs */
.form-tabs {
    display: flex;
    gap: var(--gap-md);
    margin-bottom: var(--gap-lg);
    border-bottom: var(--border-thin) solid var(--glass-border);
}

.tab-btn {
    padding: var(--gap-sm) var(--gap-md);
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    font-family: var(--font-heading);
    font-size: 13px;
    font-weight: 500;
    color: var(--text-tertiary);
    cursor: pointer;
    transition: var(--transition-base);
    margin-bottom: -1px;
}

.tab-btn:hover {
    color: var(--text-secondary);
}

.tab-btn.active {
    color: var(--primary);
    border-bottom-color: var(--primary);
}

/* Form Section */
.form-section {
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
}

.form-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
}

.form-hint {
    font-size: 11px;
    color: var(--text-tertiary);
    margin-top: 2px;
}

.form-alert {
    padding: var(--gap-sm);
    border-radius: var(--radius-md);
    font-size: 13px;
    margin-bottom: var(--gap-md);
}

.form-alert.warning {
    background: rgba(224, 123, 57, 0.1);
    color: var(--warn);
    border: var(--border-thin) solid rgba(224, 123, 57, 0.3);
}

/* Form Inputs */
.cyber-input,
.cyber-select {
    width: 100%;
    height: 44px;
    padding: 0 var(--gap-md);
    background: rgba(var(--bg-rgb, 250, 248, 245), 0.5);
    border: var(--border-thin) solid var(--glass-border);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-size: 14px;
    transition: var(--transition-base);
}

.cyber-select {
    cursor: pointer;
}

.cyber-select.multi {
    height: auto;
    min-height: 96px;
    padding: var(--gap-sm);
}

.cyber-input:focus,
.cyber-select:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: var(--glow-primary);
}

/* Form Actions */
.form-actions {
    display: flex;
    gap: var(--gap-md);
    margin-top: var(--gap-lg);
    padding-top: var(--gap-lg);
    border-top: var(--border-thin) solid var(--glass-border);
}

.form-actions .cyber-button {
    flex: 1;
}

/* Utilities */
.capitalize {
    text-transform: capitalize;
}

.text-right {
    text-align: right;
}

/* Hide on mobile */
@media (max-width: 768px) {
    .hide-mobile {
        display: none !important;
    }
    
    .user-details-grid {
        grid-template-columns: 1fr;
    }
    
    .form-actions {
        flex-direction: column;
    }
}

/* Animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes holographic {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
</style>
