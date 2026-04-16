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

    <div class="flex items-center gap-2">
      <button
        @click="changeStatusFilter('actifs')"
        class="px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
        :class="statusFilter === 'actifs' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--bg)] text-[var(--text)]'"
      >
        Actifs
      </button>
      <button
        @click="changeStatusFilter('inactifs')"
        class="px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
        :class="statusFilter === 'inactifs' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--bg)] text-[var(--text)]'"
      >
        Inactifs
      </button>
      <button
        @click="changeStatusFilter('archives')"
        class="px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
        :class="statusFilter === 'archives' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--bg)] text-[var(--text)]'"
      >
        Archivés
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
                  :class="user.archivedAt ? 'bg-slate-200 text-slate-700' : (user.actif ? 'bg-[var(--success)]/10 text-[var(--success)]' : 'bg-[var(--danger)]/10 text-[var(--danger)]')"
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                >
                  {{ user.archivedAt ? 'Archivé' : (user.actif ? 'Actif' : 'Inactif') }}
                </span>
              </td>
              <td class="text-right space-x-1 whitespace-nowrap">
                <button @click="openDetailsModal(user)" class="p-2 text-[var(--success)] hover:bg-[var(--success)]/10 rounded-lg transition-colors" title="Détails">
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
                <button @click="openEditModal(user)" class="p-2 text-[var(--primary)] hover:bg-[var(--bg)] rounded-lg transition-colors" title="Modifier">
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button @click="archiveUser(user._id)" :disabled="!!user.archivedAt" class="p-2 text-[var(--danger)] hover:bg-[var(--danger)]/10 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed" title="Archiver">
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4"/></svg>
                </button>
                <button @click="deactivateUser(user._id)" :disabled="!!user.archivedAt" :class="user.actif ? 'text-[var(--warn)]' : 'text-[var(--success)]'" class="p-2 hover:bg-[var(--bg)] rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed" :title="user.actif ? 'Désactiver' : 'Activer'">
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10"/></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Details -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-[var(--border)] transform transition-all duration-300 scale-100">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-[var(--text)]">Détails Utilisateur</h2>
          <button @click="showDetailsModal = false" class="text-[var(--soft)] hover:text-[var(--text)] hover:bg-[var(--bg)] p-2 rounded-lg transition-all duration-200 text-2xl leading-none flex items-center justify-center w-8 h-8">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div v-if="profileLoading" class="py-8 text-center text-[var(--soft)]">
          Chargement du profil détaillé...
        </div>

        <div v-else-if="selectedUser" class="space-y-6">
          <div class="flex flex-col items-center mb-6">
            <div class="w-24 h-24 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg">
              {{ selectedUser.name.charAt(0).toUpperCase() }}
            </div>
            <h3 class="text-xl font-bold text-[var(--text)]">{{ selectedUser.name }}</h3>
            <span :class="selectedUser.actif ? 'bg-[var(--success)]/10 text-[var(--success)]' : 'bg-[var(--danger)]/10 text-[var(--danger)]'" class="text-sm font-medium px-3 py-1 rounded-full inline-flex items-center gap-2 mt-2">
              <span class="w-2 h-2 rounded-full" :class="selectedUser.actif ? 'bg-[var(--success)]' : 'bg-[var(--danger)]'"></span>
              {{ selectedUser.actif ? 'Compte Actif' : 'Compte Inactif' }}
            </span>
          </div>

          <div class="space-y-4 bg-[var(--bg)] p-6 rounded-xl">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-[var(--soft)] uppercase tracking-wider">Email</label>
              <p class="text-[var(--text)] font-medium text-sm">{{ selectedUser.email }}</p>
            </div>
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-[var(--soft)] uppercase tracking-wider">Rôle</label>
              <span :class="{
                'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400': selectedUser.role === 'admin',
                'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400': selectedUser.role === 'gerant',
                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400': selectedUser.role === 'agent',
              }" class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                {{ selectedUser.role }}
              </span>
            </div>
            <div v-if="selectedUser.stats" class="pt-2 border-t border-[var(--border)]">
              <label class="block text-xs font-bold text-[var(--soft)] uppercase tracking-wider mb-3">Indicateurs</label>
              <div class="grid grid-cols-2 gap-2">
                <div class="p-2 bg-white rounded-lg text-xs text-[var(--soft)]">
                  Fermes
                  <div class="text-sm font-bold text-[var(--text)]">{{ selectedUser.stats.farmsAssignedCount }}</div>
                </div>
                <div class="p-2 bg-white rounded-lg text-xs text-[var(--soft)]">
                  Campagnes
                  <div class="text-sm font-bold text-[var(--text)]">{{ selectedUser.stats.campaignsAssignedCount }}</div>
                </div>
                <div class="p-2 bg-white rounded-lg text-xs text-[var(--soft)]">
                  Campagnes actives
                  <div class="text-sm font-bold text-[var(--text)]">{{ selectedUser.stats.activeAssignedCampaignsCount }}</div>
                </div>
                <div class="p-2 bg-white rounded-lg text-xs text-[var(--soft)]">
                  Tâches assignées
                  <div class="text-sm font-bold text-[var(--text)]">{{ selectedUser.stats.eventsAssignedCount }}</div>
                </div>
              </div>
            </div>
            <div v-if="selectedUser.role === 'gerant' && selectedUser.campaignsAssignees?.length" class="pt-2 border-t border-[var(--border)]">
              <label class="block text-xs font-bold text-[var(--soft)] uppercase tracking-wider mb-3">Campagnes Assignées</label>
              <div class="space-y-2">
                <div v-for="campId in selectedUser.campaignsAssignees" :key="campId" class="flex items-center gap-3 p-2 bg-white rounded-lg">
                  <span class="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></span>
                  <span class="text-sm text-[var(--text)]">{{ getCampaignName(campId) }}</span>
                </div>
              </div>
            </div>
            <div v-if="(selectedUser.role === 'gerant' || selectedUser.role === 'agent') && selectedUser.farms?.length" class="pt-2 border-t border-[var(--border)]">
              <label class="block text-xs font-bold text-[var(--soft)] uppercase tracking-wider mb-3">Fermes Assignées</label>
              <div class="space-y-2">
                <div v-for="farmId in selectedUser.farms" :key="farmId" class="flex items-center gap-3 p-2 bg-white rounded-lg">
                  <span class="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></span>
                  <span class="text-sm text-[var(--text)]">{{ getFarmName(farmId) }}</span>
                </div>
              </div>
            </div>
            <div v-if="selectedUser.role === 'agent' && selectedUser.campaignsAssignees?.length" class="pt-2 border-t border-[var(--border)]">
              <label class="block text-xs font-bold text-[var(--soft)] uppercase tracking-wider mb-3">Campagne de Travail</label>
              <div class="p-2 bg-white rounded-lg">
                <span class="text-sm text-[var(--text)]">{{ getCampaignName(selectedUser.campaignsAssignees[0]) }}</span>
              </div>
            </div>
            <div v-if="selectedUser.lifecycle?.length" class="pt-2 border-t border-[var(--border)]">
              <label class="block text-xs font-bold text-[var(--soft)] uppercase tracking-wider mb-3">Historique RH récent</label>
              <div class="space-y-2">
                <div v-for="event in selectedUser.lifecycle" :key="event._id" class="p-2 bg-white rounded-lg">
                  <div class="text-xs font-bold text-[var(--text)]">{{ event.action }}</div>
                  <div class="text-[11px] text-[var(--soft)]">
                    {{ new Date(event.createdAt).toLocaleString('fr-FR') }}
                    · {{ event.actor?.name || 'Système' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8">
          <button @click="showDetailsModal = false" class="w-full px-6 py-3 bg-[var(--bg)] hover:bg-[var(--border)] text-[var(--text)] rounded-xl font-medium transition-all duration-200 border border-[var(--border)]">
            Fermer
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Edit -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-[var(--border)] transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-[var(--text)]">Modifier Utilisateur</h2>
          <button @click="showEditModal = false" class="text-[var(--soft)] hover:text-[var(--text)] hover:bg-[var(--bg)] p-2 rounded-lg transition-all duration-200 text-2xl leading-none flex items-center justify-center w-8 h-8">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="updateUser" class="space-y-6">
          <div class="flex gap-6 mb-6 border-b border-[var(--border)]">
            <button 
              type="button" 
              @click="editTab = 'info'" 
              :class="editTab === 'info' ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--primary)]/5' : 'border-transparent text-[var(--soft)] hover:text-[var(--text)]'"
              class="pb-3 px-4 border-b-2 font-medium text-sm transition-all duration-200 rounded-t-lg"
            >
              Informations
            </button>
            <button 
              type="button" 
              @click="editTab = 'password'" 
              :class="editTab === 'password' ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--primary)]/5' : 'border-transparent text-[var(--soft)] hover:text-[var(--text)]'"
              class="pb-3 px-4 border-b-2 font-medium text-sm transition-all duration-200 rounded-t-lg"
            >
              Sécurité
            </button>
          </div>

          <div v-if="editTab === 'info'" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-[var(--text)] mb-2">Nom Complet</label>
              <input v-model="editingUser.name" type="text" class="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] outline-none transition-all duration-200" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-[var(--text)] mb-2">Email</label>
              <input v-model="editingUser.email" type="email" class="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] outline-none transition-all duration-200" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-[var(--text)] mb-2">Rôle</label>
              <select v-model="editingUser.role" class="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] outline-none transition-all duration-200">
                <option value="admin">Administrateur</option>
                <option value="gerant">Gérant de ferme</option>
                <option value="agent">Agent de terrain</option>
              </select>
            </div>
            <div v-if="editingUser.role === 'gerant' || editingUser.role === 'agent'">
              <label class="block text-sm font-medium text-[var(--text)] mb-2">Ferme(s) Assignée(s)</label>
              <select v-model="editingUser.farms" multiple class="w-full px-4 py-3 border border-[var(--border)] rounded-xl h-24 focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] outline-none transition-all duration-200">
                <option v-for="farm in farms" :key="farm._id" :value="farm._id">
                  {{ farm.name }}
                </option>
              </select>
              <p class="text-xs text-[var(--soft)] mt-2">Maintenez Ctrl pour sélectionner plusieurs fermes (Gérant uniquement)</p>
            </div>
            <div v-if="editingUser.role === 'gerant' || editingUser.role === 'agent'">
              <label class="block text-sm font-medium text-[var(--text)] mb-2">Campagne(s) Assignée(s)</label>
              <select v-model="editingUser.campaignsAssignees" multiple class="w-full px-4 py-3 border border-[var(--border)] rounded-xl h-24 focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] outline-none transition-all duration-200">
                <option v-for="campaign in campaigns" :key="campaign._id" :value="campaign._id">
                  {{ campaign.name }}
                </option>
              </select>
            </div>
          </div>

          <div v-if="editTab === 'password'" class="space-y-5">
            <div class="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl text-amber-800 dark:text-amber-200 text-sm mb-4 border border-amber-200 dark:border-amber-800">
              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
                <span>Modifier le mot de passe de l'utilisateur.</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-[var(--text)] mb-2">Nouveau mot de passe</label>
              <input v-model="newPassword" type="password" class="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] outline-none transition-all duration-200" placeholder="Min. 6 caractères" />
            </div>
          </div>

          <div class="flex gap-3 mt-8 pt-6 border-t border-[var(--border)]">
            <button type="button" @click="showEditModal = false" class="flex-1 px-6 py-3 border border-[var(--border)] text-[var(--text)] rounded-xl font-medium hover:bg-[var(--bg)] transition-all duration-200">
              Annuler
            </button>
            <button type="submit" :disabled="isSaving" class="flex-1 px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <span v-if="isSaving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Inviter -->
    <div v-if="showNewModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-10 max-w-md w-full shadow-2xl border border-[var(--border)] transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-[var(--text)]">Inviter Utilisateur</h2>
          <button @click="showNewModal = false" class="text-[var(--soft)] hover:text-[var(--text)] hover:bg-[var(--bg)] p-2 rounded-lg transition-all duration-200 text-2xl leading-none flex items-center justify-center w-8 h-8">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <form @submit.prevent="submitUser" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-[var(--text)] mb-2">Nom</label>
            <input
              v-model="newUser.name"
              type="text"
              class="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] outline-none transition-all duration-200"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-[var(--text)] mb-2">Email</label>
            <input
              v-model="newUser.email"
              type="email"
              class="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] outline-none transition-all duration-200"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-[var(--text)] mb-2">Mot de passe</label>
            <input
              v-model="newUser.password"
              type="password"
              class="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] outline-none transition-all duration-200"
              required
              minlength="6"
              placeholder="Minimum 6 caractères"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-[var(--text)] mb-2">Rôle</label>
            <select v-model="newUser.role" class="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] outline-none transition-all duration-200">
              <option value="admin">Admin</option>
              <option value="gerant">Gérant</option>
              <option value="agent">Agent</option>
            </select>
          </div>

          <div v-if="newUser.role === 'gerant' || newUser.role === 'agent'">
            <label class="block text-sm font-medium text-[var(--text)] mb-2">
              {{ newUser.role === 'gerant' ? 'Ferme(s) à gérer' : 'Ferme de travail' }}
            </label>
            <select
              v-model="newUser.farms"
              :multiple="newUser.role === 'gerant'"
              class="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] outline-none transition-all duration-200"
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
            <label class="block text-sm font-medium text-[var(--text)] mb-2">
              {{ newUser.role === 'gerant' ? 'Campagne(s) Assignée(s) (Optionnel)' : 'Campagne de travail' }}
            </label>
            <select
              v-model="newUser.campaignsAssignees"
              :multiple="newUser.role === 'gerant'"
              class="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] outline-none transition-all duration-200"
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
          <div class="flex gap-3 pt-6 border-t border-[var(--border)]">
            <button
              type="button"
              @click="showNewModal = false"
              class="flex-1 px-6 py-3 border border-[var(--border)] text-[var(--text)] rounded-xl font-medium hover:bg-[var(--bg)] transition-all duration-200"
            >
              Annuler
            </button>
            <button type="submit" class="flex-1 px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              <span class="text-white">Inviter</span>
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
const profileLoading = ref(false)
const editTab = ref('info')
const newPassword = ref('')
const isSaving = ref(false)
const statusFilter = ref('actifs')

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
    const query = {}
    if (statusFilter.value === 'actifs') query.actif = true
    if (statusFilter.value === 'inactifs') query.actif = false
    if (statusFilter.value === 'archives') {
      query.archived = true
      query.includeArchived = true
    }
    const response = await userService.getAll(query)
    users.value = response.data.users
  } catch (error) {
    console.error('Error:', error)
  }
}

const changeStatusFilter = async (nextFilter) => {
  statusFilter.value = nextFilter
  await fetchUsers()
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

const openDetailsModal = async (user) => {
  selectedUser.value = user
  showDetailsModal.value = true
  profileLoading.value = true

  try {
    const response = await userService.getProfile(user._id)
    selectedUser.value = response.data.user
  } catch (error) {
    console.error('Error fetching user profile:', error)
    ui.error('Impossible de charger les détails complets')
  } finally {
    profileLoading.value = false
  }
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

const archiveUser = async (userId) => {
  const confirm = await ui.confirm({
    title: 'Archiver l\'utilisateur',
    message: 'Le compte sera désactivé et conservé dans les archives. Continuer ?',
    confirmText: 'Archiver',
    type: 'danger'
  })

  if (confirm) {
    try {
      await userService.archive(userId, 'Départ de l\'entreprise')
      await fetchUsers()
      ui.success('Utilisateur archivé avec succès')
    } catch (error) {
      console.error('Error archiving user:', error)
      ui.error('Erreur lors de l\'archivage')
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
      // S'assurer que c'est un tableau
      if (!Array.isArray(userData.farms)) {
        userData.farms = [userData.farms].filter(id => id)
      } else {
        userData.farms = userData.farms.filter(id => id)
      }
      if (!Array.isArray(userData.campaignsAssignees)) {
        userData.campaignsAssignees = [userData.campaignsAssignees].filter(id => id)
      } else {
        userData.campaignsAssignees = userData.campaignsAssignees.filter(id => id)
      }
    } else if (userData.role === 'agent') {
      // S'assurer que les données sont des tableaux
      if (!Array.isArray(userData.farms)) {
        userData.farms = userData.farms ? [userData.farms] : []
      }
      if (!Array.isArray(userData.campaignsAssignees)) {
        userData.campaignsAssignees = userData.campaignsAssignees ? [userData.campaignsAssignees] : []
      }
      
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

/* Espacement du modal */
.bg-white.rounded-2xl {
  padding: 2.5rem !important; /* 40px */
  margin: 1rem !important;
}

/* Espacement entre les éléments */
.space-y-5 > * + * {
  margin-top: 1.25rem !important; /* 20px */
}

.space-y-6 > * + * {
  margin-top: 1.5rem !important; /* 24px */
}

/* Champs de formulaire */
input[type="text"],
input[type="email"],
input[type="password"],
select {
  padding: 0.75rem 1rem !important; /* 12px 16px */
  border-radius: 0.75rem !important; /* 12px */
  border: 1px solid var(--border) !important;
  background: var(--card) !important;
  color: var(--text) !important;
  font-size: 0.875rem !important; /* 14px */
  transition: all 0.2s ease !important;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="password"]:focus,
select:focus {
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

/* Header du modal */
.flex.justify-between.items-center.mb-6 {
  margin-bottom: 1.5rem !important; /* 24px */
}

/* Footer du modal */
.flex.gap-3.pt-6 {
  padding-top: 1.5rem !important; /* 24px */
  margin-top: 1.5rem !important; /* 24px */
  border-top: 1px solid var(--border) !important;
}

/* Tabs */
.flex.gap-6.border-b {
  border-bottom: 1px solid var(--border) !important;
  margin-bottom: 1.5rem !important; /* 24px */
}

/* Avatar dans le modal détails */
.w-24.h-24.bg-gradient-to-br {
  width: 6rem !important; /* 96px */
  height: 6rem !important; /* 96px */
  font-size: 2rem !important; /* 32px */
  margin-bottom: 1rem !important; /* 16px */
}

/* Badges de statut */
.px-3.py-1.rounded-full {
  padding: 0.5rem 0.75rem !important; /* 8px 12px */
  font-size: 0.75rem !important; /* 12px */
}

/* Contenu des détails */
.space-y-4.bg-\[var\(--bg\)\].p-6.rounded-xl {
  padding: 1.5rem !important; /* 24px */
  border-radius: 0.75rem !important; /* 12px */
}

/* Items dans les listes */
.flex.items-center.gap-3.p-2.bg-white.rounded-lg {
  padding: 0.5rem !important; /* 8px */
  border-radius: 0.5rem !important; /* 8px */
  margin-bottom: 0.5rem !important; /* 8px */
}

/* Responsive */
@media (max-width: 640px) {
  .bg-white.rounded-2xl {
    margin: 0.5rem !important;
    padding: 1.5rem !important; /* 24px */
  }
  
  button {
    padding: 0.625rem 1rem !important; /* 10px 16px */
    font-size: 0.8125rem !important; /* 13px */
  }
}
</style>
