<template>
  <div class="animals-view space-y-6 p-6">
    <!-- Holographic Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="page-title text-3xl font-bold mb-1">Gestion Animaux</h1>
        <p class="text-cyan-300/70 text-sm flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          {{ totalAnimals }} animaux dans {{ activeCampaigns.length }} campagne(s) active(s)
        </p>
      </div>
      <button 
        @click="showAddModal = true"
        class="cyber-button px-6 py-3 rounded-lg flex items-center gap-2 text-sm font-medium text-white"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Ajouter animal
      </button>
    </div>

    <!-- Glassmorphism Filters Panel -->
    <div class="filters-panel p-5 rounded-xl space-y-4">
      <div class="flex items-center gap-2 mb-3">
        <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span class="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Filtres actifs</span>
      </div>
      <div class="grid grid-cols-4 gap-4">
        <div class="input-group">
          <input 
            v-model="filters.search" 
            placeholder="Rechercher par ID, lot..." 
            class="cyber-input w-full px-3 py-2.5 rounded-lg text-sm"
          />
        </div>
        <select v-model="filters.type" class="cyber-select px-3 py-2.5 rounded-lg text-sm">
          <option value="">Tous départements</option>
          <option value="Volaille">Volaille</option>
          <option value="Bétail">Bétail</option>
          <option value="Pisciculture">Pisciculture</option>
        </select>
        <select v-model="filters.campaign" class="cyber-select px-3 py-2.5 rounded-lg text-sm">
          <option value="">Toutes campagnes</option>
          <option v-for="campaign in campaigns" :key="campaign._id" :value="campaign._id">
            {{ campaign.name }}
          </option>
        </select>
        <select v-model="filters.healthStatus" class="cyber-select px-3 py-2.5 rounded-lg text-sm">
          <option value="">Tous statuts santé</option>
          <option value="Sain">Sain</option>
          <option value="Malade">Malade</option>
          <option value="Suspect">Suspect</option>
          <option value="Décédé">Décédé</option>
        </select>
      </div>
      <button 
        @click="resetFilters"
        class="text-cyan-400 hover:text-cyan-300 text-xs font-medium flex items-center gap-1 transition-all duration-300"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Réinitialiser filtres
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="admin.loading" class="flex justify-center items-center py-12">
      <div class="cyber-loader">
        <div class="loader-ring"></div>
        <div class="loader-ring"></div>
        <div class="loader-ring"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="admin.error" class="error-alert px-4 py-3 rounded-lg">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ admin.error }}</span>
      </div>
    </div>

    <!-- Cyber Table -->
    <div v-else class="table-container rounded-xl overflow-hidden">
      <div v-if="filteredAnimals.length > 0" class="overflow-x-auto">
        <table class="w-full">
          <thead class="table-header">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Campagne</th>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Type</th>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Poids</th>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Santé</th>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Vaccins</th>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Date Naissance</th>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="table-body divide-y divide-slate-700/50">
            <tr v-for="animal in paginatedAnimals" :key="animal._id" class="table-row">
              <td class="px-6 py-4">
                <span class="text-cyan-400 font-mono font-semibold">{{ animal.idNumber }}</span>
              </td>
              <td class="px-6 py-4 text-sm text-slate-300">{{ animal.campaign?.name || 'N/A' }}</td>
              <td class="px-6 py-4">
                <span class="type-badge px-2.5 py-1 rounded-full text-xs font-medium" :class="getTypeClass(animal.type)">
                  {{ animal.type }}
                </span>
              </td>
              <td class="px-6 py-4 text-slate-300">{{ animal.weight || 'N/A' }} kg</td>
              <td class="px-6 py-4">
                <span class="health-badge px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1" :class="getHealthClass(animal.healthStatus)">
                  <span class="status-dot w-1.5 h-1.5 rounded-full" :class="getHealthDotClass(animal.healthStatus)"></span>
                  {{ animal.healthStatus }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm">
                <div class="flex items-center gap-2">
                  <div class="vaccine-progress w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div class="h-full rounded-full" :style="{ width: ((animal.vaccinations?.length || 0) / 4 * 100) + '%', backgroundColor: getVaccineColor(animal.vaccinations?.length || 0) }"></div>
                  </div>
                  <span class="text-slate-400 text-xs">{{ animal.vaccinations?.length || 0 }}/4</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-slate-400">
                {{ animal.dateOfBirth ? new Date(animal.dateOfBirth).toLocaleDateString('fr-FR') : 'N/A' }}
              </td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <button 
                    @click="openDetailsModal(animal)"
                    class="action-btn view-btn p-2 rounded-lg text-sm"
                    title="Voir Détails"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button 
                    @click="openEditModal(animal)"
                    class="action-btn edit-btn p-2 rounded-lg text-sm"
                    title="Modifier"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    @click="deleteAnimal(animal._id)"
                    class="action-btn delete-btn p-2 rounded-lg text-sm"
                    title="Supprimer"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="p-12 text-center">
        <div class="empty-state-icon mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-slate-200">Aucun animal</h3>
        <p class="mt-1 text-slate-400 text-sm">Aucun animal ne correspond aux filtres selectionnés</p>
      </div>

      <!-- Pagination -->
      <div v-if="filteredAnimals.length > 0" class="pagination-container flex justify-between items-center p-4 border-t border-slate-700/50">
        <div class="text-sm text-slate-400">
          Affichage <span class="text-cyan-400 font-semibold">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> à <span class="text-cyan-400 font-semibold">{{ Math.min(currentPage * itemsPerPage, filteredAnimals.length) }}</span> sur <span class="text-cyan-400 font-semibold">{{ filteredAnimals.length }}</span>
        </div>
        <div class="flex gap-2">
          <button 
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="page-btn px-3 py-1.5 rounded-lg disabled:opacity-30 text-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7-7-7" />
            </svg>
          </button>
          <button 
            v-for="page in totalPages" 
            :key="page"
            @click="currentPage = page"
            :class="{ 'active': currentPage === page }"
            class="page-btn px-3 py-1.5 rounded-lg text-sm min-w-[2rem]"
          >
            {{ page }}
          </button>
          <button 
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="page-btn px-3 py-1.5 rounded-lg disabled:opacity-30 text-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Détails Animal - Cyber Style -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDetailsModal && selectedAnimal" class="fixed inset-0 flex items-center justify-center z-50" @click="closeDetailsModal">
          <div class="modal-backdrop absolute inset-0" @click="closeDetailsModal"></div>
          <div class="cyber-modal p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto relative" @click.stop>
            <div class="flex justify-between items-center mb-6">
              <div class="flex items-center gap-3">
                <div class="modal-icon w-10 h-10 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-xl font-bold text-white">Détails de l'Animal</h2>
                  <p class="text-slate-400 text-sm">{{ selectedAnimal.idNumber }}</p>
                </div>
              </div>
              <button 
                @click="closeDetailsModal"
                class="modal-close-btn w-8 h-8 rounded-lg flex items-center justify-center"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="grid grid-cols-2 gap-6">
              <!-- Colonne 1 -->
              <div class="space-y-4">
                <div class="detail-field">
                  <label class="block text-xs font-medium text-cyan-400 uppercase tracking-wider mb-1">ID Animal</label>
                  <p class="text-white font-mono text-lg">{{ selectedAnimal.idNumber }}</p>
                </div>
                <div class="detail-field">
                  <label class="block text-xs font-medium text-cyan-400 uppercase tracking-wider mb-1">Type</label>
                  <span class="type-badge px-2.5 py-1 rounded-full text-xs font-medium" :class="getTypeClass(selectedAnimal.type)">
                    {{ selectedAnimal.type }}
                  </span>
                </div>
                <div class="detail-field">
                  <label class="block text-xs font-medium text-cyan-400 uppercase tracking-wider mb-1">Race/Variété</label>
                  <p class="text-slate-200">{{ selectedAnimal.breed || 'N/A' }}</p>
                </div>
                <div class="detail-field">
                  <label class="block text-xs font-medium text-cyan-400 uppercase tracking-wider mb-1">Poids</label>
                  <p class="text-slate-200">{{ selectedAnimal.weight || 'N/A' }} kg</p>
                </div>
              </div>

              <!-- Colonne 2 -->
              <div class="space-y-4">
                <div class="detail-field">
                  <label class="block text-xs font-medium text-cyan-400 uppercase tracking-wider mb-1">Campagne</label>
                  <p class="text-slate-200">{{ selectedAnimal.campaign?.name || 'N/A' }}</p>
                </div>
                <div class="detail-field">
                  <label class="block text-xs font-medium text-cyan-400 uppercase tracking-wider mb-1">Statut sanitaire</label>
                  <span class="health-badge px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1" :class="getHealthClass(selectedAnimal.healthStatus)">
                    <span class="status-dot w-1.5 h-1.5 rounded-full" :class="getHealthDotClass(selectedAnimal.healthStatus)"></span>
                    {{ selectedAnimal.healthStatus }}
                  </span>
                </div>
                <div class="detail-field">
                  <label class="block text-xs font-medium text-cyan-400 uppercase tracking-wider mb-1">Date de naissance</label>
                  <p class="text-slate-200">{{ selectedAnimal.dateOfBirth ? new Date(selectedAnimal.dateOfBirth).toLocaleDateString('fr-FR') : 'N/A' }}</p>
                </div>
                <div class="detail-field">
                  <label class="block text-xs font-medium text-cyan-400 uppercase tracking-wider mb-1">Vaccinations</label>
                  <div class="flex items-center gap-2">
                    <div class="vaccine-progress flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div class="h-full rounded-full" :style="{ width: ((selectedAnimal.vaccinations?.length || 0) / 4 * 100) + '%', backgroundColor: getVaccineColor(selectedAnimal.vaccinations?.length || 0) }"></div>
                    </div>
                    <span class="text-slate-400 text-sm">{{ selectedAnimal.vaccinations?.length || 0 }} vaccin(s)</span>
                  </div>
                </div>
              </div>

              <!-- Notes pleine largeur -->
              <div class="col-span-2" v-if="selectedAnimal.notes">
                <div class="detail-field p-4 bg-slate-800/50 rounded-lg">
                  <label class="block text-xs font-medium text-cyan-400 uppercase tracking-wider mb-2">Notes</label>
                  <p class="text-slate-300 text-sm leading-relaxed">{{ selectedAnimal.notes }}</p>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-6 border-t border-slate-700/50 mt-6">
              <button 
                @click="closeDetailsModal"
                class="cyber-btn-secondary px-4 py-2 rounded-lg text-sm font-medium"
              >
                Fermer
              </button>
              <button 
                @click="openEditModal(selectedAnimal)"
                class="cyber-btn-primary px-4 py-2 rounded-lg text-sm font-medium text-white"
              >
                Modifier
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Modal Modifier Animal - Cyber Style -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showEditModal && selectedAnimal" class="fixed inset-0 flex items-center justify-center z-50">
          <div class="modal-backdrop absolute inset-0" @click="closeEditModal"></div>
          <div class="cyber-modal p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto relative" @click.stop>
            <div class="flex justify-between items-center mb-6">
              <div class="flex items-center gap-3">
                <div class="modal-icon w-10 h-10 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-xl font-bold text-white">Modifier Animal</h2>
                  <p class="text-slate-400 text-sm">{{ selectedAnimal.idNumber }}</p>
                </div>
              </div>
              <button 
                @click="closeEditModal"
                class="modal-close-btn w-8 h-8 rounded-lg flex items-center justify-center"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form @submit.prevent="submitEditAnimal" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <!-- ID Animal (non modifiable) -->
                <div>
                  <label class="block text-xs font-medium text-cyan-400 uppercase tracking-wider mb-2">ID Animal</label>
                  <input 
                    :value="editForm.idNumber" 
                    disabled
                    class="w-full px-3 py-2.5 rounded-lg bg-slate-800/50 text-slate-400 border border-slate-700 cursor-not-allowed"
                  />
                </div>

                <!-- Type (non modifiable) -->
                <div>
                  <label class="block text-xs font-medium text-cyan-400 uppercase tracking-wider mb-2">Type</label>
                  <input 
                    :value="editForm.type" 
                    disabled
                    class="w-full px-3 py-2.5 rounded-lg bg-slate-800/50 text-slate-400 border border-slate-700 cursor-not-allowed"
                  />
                </div>

                <!-- Poids -->
                <div>
                  <label class="block text-xs font-medium text-cyan-400 uppercase tracking-wider mb-2">Poids (kg)</label>
                  <input 
                    v-model.number="editForm.weight" 
                    type="number"
                    step="0.01"
                    min="0"
                    class="cyber-input w-full px-3 py-2.5 rounded-lg"
                  />
                </div>

                <!-- Statut sanitaire -->
                <div>
                  <label class="block text-xs font-medium text-cyan-400 uppercase tracking-wider mb-2">Statut sanitaire</label>
                  <select 
                    v-model="editForm.healthStatus"
                    class="cyber-select w-full px-3 py-2.5 rounded-lg"
                  >
                    <option value="Sain">Sain</option>
                    <option value="Suspect">Suspect</option>
                    <option value="Malade">Malade</option>
                    <option value="Décédé">Décédé</option>
                  </select>
                </div>

                <!-- Race/Variété -->
                <div class="col-span-2">
                  <label class="block text-xs font-medium text-cyan-400 uppercase tracking-wider mb-2">Race/Variété</label>
                  <input 
                    v-model="editForm.breed" 
                    type="text"
                    class="cyber-input w-full px-3 py-2.5 rounded-lg"
                  />
                </div>

                <!-- Notes -->
                <div class="col-span-2">
                  <label class="block text-xs font-medium text-cyan-400 uppercase tracking-wider mb-2">Notes</label>
                  <textarea 
                    v-model="editForm.notes" 
                    rows="3"
                    class="cyber-input w-full px-3 py-2.5 rounded-lg resize-none"
                  />
                </div>
              </div>

              <div class="flex justify-end gap-3 pt-6 border-t border-slate-700/50 mt-6">
                <button 
                  type="button"
                  @click="closeEditModal"
                  class="cyber-btn-secondary px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  :disabled="isSubmitting"
                  class="cyber-btn-primary px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                >
                  <span v-if="isSubmitting" class="flex items-center gap-2">
                    <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mise à jour...
                  </span>
                  <span v-else>Mettre à jour</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Modal Ajouter Animal - Cyber Style -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showAddModal" class="fixed inset-0 flex items-center justify-center z-50">
          <div class="modal-backdrop absolute inset-0" @click="closeAddModal"></div>
          <div class="cyber-modal p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto relative" @click.stop>
            <div class="flex justify-between items-center mb-6">
              <div class="flex items-center gap-3">
                <div class="modal-icon w-10 h-10 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-xl font-bold text-white">Ajouter Animal</h2>
                  <p class="text-slate-400 text-sm">Nouvel animal dans le système</p>
                </div>
              </div>
              <button 
                @click="closeAddModal"
                class="modal-close-btn w-8 h-8 rounded-lg flex items-center justify-center"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form @submit.prevent="submitAddAnimal" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <!-- ID Animal -->
                <div>
                  <label class="block text-xs font-medium text-cyan-400 uppercase tracking-wider mb-2">ID Animal *</label>
                  <input 
                    v-model="animalForm.idNumber" 
                    type="text"
                    required
                    placeholder="VOL-001"
                    class="cyber-input w-full px-3 py-2.5 rounded-lg"
                  />
                </div>

                <!-- Type d'animal -->
                <div>
                  <label class="block text-xs font-medium text-cyan-400 uppercase tracking-wider mb-2">Type d'animal *</label>
                  <select 
                    v-model="animalForm.type" 
                    required
                    class="cyber-select w-full px-3 py-2.5 rounded-lg"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="Volaille">Volaille</option>
                    <option value="Bétail">Bétail</option>
                    <option value="Pisciculture">Pisciculture</option>
                  </select>
                </div>

                <!-- Ferme -->
                <div>
                  <label class="block text-xs font-medium text-cyan-400 uppercase tracking-wider mb-2">Ferme *</label>
                  <select 
                    v-model="animalForm.farm" 
                    required
                    @change="onFarmChange"
                    class="cyber-select w-full px-3 py-2.5 rounded-lg"
                  >
                    <option value="">Sélectionner une ferme...</option>
                    <option v-for="farm in farms" :key="farm._id" :value="farm._id">
                      {{ farm.name }}
                    </option>
                  </select>
                </div>

                <!-- Campagne -->
                <div>
                  <label class="block text-xs font-medium text-cyan-400 uppercase tracking-wider mb-2">Campagne *</label>
                  <select 
                    v-model="animalForm.campaign" 
                    required
                    :disabled="!animalForm.farm"
                    class="cyber-select w-full px-3 py-2.5 rounded-lg disabled:opacity-50"
                  >
                    <option value="">Sélectionner une campagne...</option>
                    <option v-for="campaign in filteredCampaigns" :key="campaign._id" :value="campaign._id">
                      {{ campaign.name }} ({{ campaign.animalType }})
                    </option>
                  </select>
                </div>

                <!-- Poids -->
                <div>
                  <label class="block text-xs font-medium text-cyan-400 uppercase tracking-wider mb-2">Poids (kg) *</label>
                  <input 
                    v-model.number="animalForm.weight" 
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="1.35"
                    class="cyber-input w-full px-3 py-2.5 rounded-lg"
                  />
                </div>

                <!-- Date de naissance -->
                <div>
                  <label class="block text-xs font-medium text-cyan-400 uppercase tracking-wider mb-2">Date de naissance *</label>
                  <input 
                    v-model="animalForm.dateOfBirth" 
                    type="date"
                    required
                    class="cyber-input w-full px-3 py-2.5 rounded-lg"
                  />
                </div>

                <!-- Statut sanitaire -->
                <div>
                  <label class="block text-xs font-medium text-cyan-400 uppercase tracking-wider mb-2">Statut sanitaire</label>
                  <select 
                    v-model="animalForm.healthStatus"
                    class="cyber-select w-full px-3 py-2.5 rounded-lg"
                  >
                    <option value="Sain">Sain</option>
                    <option value="Suspect">Suspect</option>
                    <option value="Malade">Malade</option>
                    <option value="Décédé">Décédé</option>
                  </select>
                </div>

                <!-- Race/Variété -->
                <div class="col-span-2">
                  <label class="block text-xs font-medium text-cyan-400 uppercase tracking-wider mb-2">Race/Variété</label>
                  <input 
                    v-model="animalForm.breed" 
                    type="text"
                    placeholder="Ex: Sussex, Tilapia Rouge..."
                    class="cyber-input w-full px-3 py-2.5 rounded-lg"
                  />
                </div>

                <!-- Notes -->
                <div class="col-span-2">
                  <label class="block text-xs font-medium text-cyan-400 uppercase tracking-wider mb-2">Notes</label>
                  <textarea 
                    v-model="animalForm.notes" 
                    placeholder="Notes additionnelles..."
                    rows="3"
                    class="cyber-input w-full px-3 py-2.5 rounded-lg resize-none"
                  />
                </div>
              </div>

              <div class="flex justify-end gap-3 pt-6 border-t border-slate-700/50 mt-6">
                <button 
                  type="button"
                  @click="closeAddModal"
                  class="cyber-btn-secondary px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  :disabled="isSubmitting"
                  class="cyber-btn-primary px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                >
                  <span v-if="isSubmitting" class="flex items-center gap-2">
                    <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Ajout en cours...
                  </span>
                  <span v-else>Ajouter</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
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
  if (!animalForm.farm) {
    return admin.campaigns
  }
  return admin.campaigns.filter(campaign => {
    const campaignFarmId = campaign.farm?._id || campaign.farm
    return campaignFarmId.toString() === animalForm.farm.toString()
  })
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

// Helper functions for styling
const getTypeClass = (type) => {
  const classes = {
    'Volaille': 'type-volaille',
    'Bétail': 'type-betail',
    'Pisciculture': 'type-pisciculture'
  }
  return classes[type] || 'type-default'
}

const getHealthClass = (status) => {
  const classes = {
    'Sain': 'health-healthy',
    'Malade': 'health-sick',
    'Suspect': 'health-suspect',
    'Décédé': 'health-deceased'
  }
  return classes[status] || 'health-default'
}

const getHealthDotClass = (status) => {
  const classes = {
    'Sain': 'dot-healthy',
    'Malade': 'dot-sick',
    'Suspect': 'dot-suspect',
    'Décédé': 'dot-deceased'
  }
  return classes[status] || 'dot-default'
}

const getVaccineColor = (count) => {
  if (count === 0) return '#64748b'
  if (count === 1) return '#ef4444'
  if (count === 2) return '#f59e0b'
  if (count === 3) return '#3b82f6'
  return '#22c55e'
}

// Methods
const onFarmChange = () => {
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
    await fetchFarms()
    await admin.fetchCampaigns()
    await admin.fetchAnimals()
  } catch (error) {
    console.error('Erreur lors du chargement initial:', error)
  }
})
</script>

<style scoped>
/* ===== DIGITAL TWIN THEME VARIABLES ===== */
.animals-view {
  --color-primary: #06b6d4;
  --color-secondary: #3b82f6;
  --color-accent: #f59e0b;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-bg-dark: #0f172a;
  --color-bg-panel: rgba(15, 23, 42, 0.7);
  --color-border: rgba(6, 182, 212, 0.3);
  --shadow-glow: 0 0 20px rgba(6, 182, 212, 0.3);
  --shadow-glow-strong: 0 0 30px rgba(6, 182, 212, 0.5);
}

/* ===== HOLOGRAPHIC TITLE ===== */
.page-title {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(6, 182, 212, 0.5);
  position: relative;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #06b6d4, transparent);
}

/* ===== CYBER BUTTONS ===== */
.cyber-button {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  border: 1px solid rgba(6, 182, 212, 0.5);
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.cyber-button:hover {
  box-shadow: 0 0 25px rgba(6, 182, 212, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.cyber-btn-primary {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  border: 1px solid rgba(6, 182, 212, 0.5);
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
  transition: all 0.3s ease;
}

.cyber-btn-primary:hover {
  box-shadow: 0 0 25px rgba(6, 182, 212, 0.5);
}

.cyber-btn-secondary {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #94a3b8;
  transition: all 0.3s ease;
}

.cyber-btn-secondary:hover {
  background: rgba(51, 65, 85, 0.8);
  border-color: rgba(148, 163, 184, 0.5);
  color: #e2e8f0;
}

/* ===== GLASSMORPHISM PANELS ===== */
.filters-panel {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.4) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--color-border);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), var(--shadow-glow);
}

.table-container {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.4) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--color-border);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* ===== CYBER INPUTS ===== */
.cyber-input {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(6, 182, 212, 0.3);
  color: #e2e8f0;
  transition: all 0.3s ease;
}

.cyber-input:focus {
  outline: none;
  border-color: #06b6d4;
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
}

.cyber-input::placeholder {
  color: #64748b;
}

.cyber-select {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(6, 182, 212, 0.3);
  color: #e2e8f0;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2306b6d4'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.5em;
  padding-right: 2.5rem;
}

.cyber-select:focus {
  outline: none;
  border-color: #06b6d4;
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
}

/* ===== TABLE STYLES ===== */
.table-header {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
  border-bottom: 1px solid rgba(6, 182, 212, 0.3);
  color: #06b6d4;
}

.table-row {
  transition: all 0.3s ease;
}

.table-row:hover {
  background: rgba(6, 182, 212, 0.1);
  transform: scale(1.002);
}

/* ===== TYPE BADGES ===== */
.type-badge {
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.type-volaille {
  background: rgba(139, 92, 246, 0.2);
  border-color: rgba(139, 92, 246, 0.5);
  color: #a78bfa;
}

.type-betail {
  background: rgba(245, 158, 11, 0.2);
  border-color: rgba(245, 158, 11, 0.5);
  color: #fbbf24;
}

.type-pisciculture {
  background: rgba(6, 182, 212, 0.2);
  border-color: rgba(6, 182, 212, 0.5);
  color: #22d3ee;
}

.type-default {
  background: rgba(100, 116, 139, 0.2);
  border-color: rgba(100, 116, 139, 0.5);
  color: #94a3b8;
}

/* ===== HEALTH BADGES ===== */
.health-badge {
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.health-healthy {
  background: rgba(34, 197, 94, 0.15);
  border-color: rgba(34, 197, 94, 0.5);
  color: #4ade80;
}

.health-sick {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.5);
  color: #f87171;
}

.health-suspect {
  background: rgba(245, 158, 11, 0.15);
  border-color: rgba(245, 158, 11, 0.5);
  color: #fbbf24;
}

.health-deceased {
  background: rgba(100, 116, 139, 0.15);
  border-color: rgba(100, 116, 139, 0.5);
  color: #94a3b8;
}

.status-dot {
  box-shadow: 0 0 8px currentColor;
}

.dot-healthy { background-color: #4ade80; }
.dot-sick { background-color: #f87171; }
.dot-suspect { background-color: #fbbf24; }
.dot-deceased { background-color: #94a3b8; }

/* ===== ACTION BUTTONS ===== */
.action-btn {
  transition: all 0.3s ease;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid transparent;
}

.view-btn {
  color: #22c55e;
  border-color: rgba(34, 197, 94, 0.3);
}

.view-btn:hover {
  background: rgba(34, 197, 94, 0.2);
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
}

.edit-btn {
  color: #06b6d4;
  border-color: rgba(6, 182, 212, 0.3);
}

.edit-btn:hover {
  background: rgba(6, 182, 212, 0.2);
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
}

.delete-btn {
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.3);
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
}

/* ===== PAGINATION ===== */
.pagination-container {
  background: rgba(15, 23, 42, 0.4);
}

.page-btn {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(6, 182, 212, 0.3);
  color: #94a3b8;
  transition: all 0.3s ease;
}

.page-btn:hover {
  background: rgba(6, 182, 212, 0.2);
  border-color: rgba(6, 182, 212, 0.5);
  color: #e2e8f0;
}

.page-btn.active {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  border-color: rgba(6, 182, 212, 0.8);
  color: white;
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.4);
}

/* ===== MODAL STYLES ===== */
.modal-backdrop {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.cyber-modal {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border: 1px solid rgba(6, 182, 212, 0.4);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(6, 182, 212, 0.2);
}

.modal-icon {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%);
  border: 1px solid rgba(6, 182, 212, 0.4);
}

.modal-close-btn {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #94a3b8;
  transition: all 0.3s ease;
}

.modal-close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.5);
  color: #f87171;
}

/* ===== DETAIL FIELDS ===== */
.detail-field {
  transition: all 0.3s ease;
}

/* ===== LOADER ===== */
.cyber-loader {
  position: relative;
  width: 60px;
  height: 60px;
}

.loader-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top-color: #06b6d4;
  border-radius: 50%;
  animation: spin 1.2s linear infinite;
}

.loader-ring:nth-child(1) {
  width: 100%;
  height: 100%;
}

.loader-ring:nth-child(2) {
  width: 70%;
  height: 70%;
  top: 15%;
  left: 15%;
  border-top-color: #3b82f6;
  animation-duration: 0.9s;
  animation-direction: reverse;
}

.loader-ring:nth-child(3) {
  width: 40%;
  height: 40%;
  top: 30%;
  left: 30%;
  border-top-color: #8b5cf6;
  animation-duration: 0.6s;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* ===== ERROR ALERT ===== */
.error-alert {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #f87171;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* ===== EMPTY STATE ===== */
.empty-state-icon {
  background: linear-gradient(135deg, rgba(100, 116, 139, 0.2) 0%, rgba(71, 85, 105, 0.2) 100%);
  border: 2px solid rgba(100, 116, 139, 0.3);
}

/* ===== VACCINE PROGRESS ===== */
.vaccine-progress {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(100, 116, 139, 0.2);
}

/* ===== MODAL TRANSITIONS ===== */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .cyber-modal,
.modal-leave-to .cyber-modal {
  transform: scale(0.95) translateY(-10px);
  opacity: 0;
}

.modal-enter-to .cyber-modal,
.modal-leave-from .cyber-modal {
  transform: scale(1) translateY(0);
  opacity: 1;
}
</style>

