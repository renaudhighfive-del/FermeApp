<template>
    <div class="campaigns-container">
        <!-- Hero Section with Holographic Title -->
        <section class="hero-section">
            <div class="hero-content">
                <div class="hero-badge">
                    <span class="pulse-dot"></span>
                    Live Management
                </div>
                <h1 class="hero-title">
                    <span class="title-prefix">Digital Twin</span>
                    <span class="title-main holographic-text">Campaign OS</span>
                </h1>
                <p class="hero-subtitle">
                    Gérez vos campagnes d'élevage avec une précision futuriste
                </p>
            </div>
            <div class="hero-actions">
                <button @click="openCreateModal" class="cyber-button primary glow">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M12 4v16m8-8H4"/>
                    </svg>
                    <span>Nouvelle Campagne</span>
                    <div class="button-glow"></div>
                </button>
            </div>
        </section>

        <!-- Floating Stats Cards -->
        <section class="stats-grid">
            <div class="stat-card" style="--delay: 0.1s">
                <div class="stat-icon primary">
                    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                </div>
                <div class="stat-content">
                    <div class="stat-value">{{ admin.campaigns.length }}</div>
                    <div class="stat-label">Campagnes actives</div>
                </div>
                <div class="stat-trend up">+12%</div>
            </div>

            <div class="stat-card" style="--delay: 0.2s">
                <div class="stat-icon success">
                    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7"/>
                    </svg>
                </div>
                <div class="stat-content">
                    <div class="stat-value">{{ completedCampaigns }}</div>
                    <div class="stat-label">Terminees</div>
                </div>
                <div class="stat-trend up">+8%</div>
            </div>

            <div class="stat-card" style="--delay: 0.3s">
                <div class="stat-icon warning">
                    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <div class="stat-content">
                    <div class="stat-value">{{ inProgressCampaigns }}</div>
                    <div class="stat-label">En cours</div>
                </div>
                <div class="stat-trend stable">-</div>
            </div>

            <div class="stat-card" style="--delay: 0.4s">
                <div class="stat-icon danger">
                    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                </div>
                <div class="stat-content">
                    <div class="stat-value">{{ highMortalityCampaigns }}</div>
                    <div class="stat-label">Alertes mortalite</div>
                </div>
                <div class="stat-trend down">-3%</div>
            </div>
        </section>

        <!-- Glass Filter Panel -->
        <section class="filter-panel glass-card" style="--delay: 0.5s">
            <div class="filter-grid">
                <div class="filter-group">
                    <label class="filter-label">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                        Recherche
                    </label>
                    <div class="cyber-input-wrapper">
                        <input
                            v-model="filters.search"
                            placeholder="Nom de campagne..."
                            class="cyber-input"
                        />
                        <div class="input-glow"></div>
                    </div>
                </div>

                <div class="filter-group">
                    <label class="filter-label">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Statut
                    </label>
                    <div class="cyber-input-wrapper">
                        <select v-model="filters.status" class="cyber-input">
                            <option value="">Tous les statuts</option>
                            <option value="En cours">En cours</option>
                            <option value="Terminee">Terminee</option>
                            <option value="Preparation">Preparation</option>
                        </select>
                    </div>
                </div>

                <div class="filter-group">
                    <label class="filter-label">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
                        </svg>
                        Type d'animal
                    </label>
                    <div class="cyber-input-wrapper">
                        <select v-model="filters.animalType" class="cyber-input">
                            <option value="">Tous les types</option>
                            <option value="Volaille">Volaille</option>
                            <option value="Betail">Betail</option>
                            <option value="Pisciculture">Pisciculture</option>
                        </select>
                    </div>
                </div>

                <div class="filter-actions">
                    <button @click="resetFilters" class="cyber-button ghost magnetic">
                        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                        </svg>
                        Reinitialiser
                    </button>
                </div>
            </div>
        </section>

        <!-- Loading State with Cyber Spinner -->
        <div v-if="admin.loading" class="loading-state">
            <div class="cyber-spinner-large">
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
            </div>
            <p class="loading-text">Chargement des donnees campagnes...</p>
            <div class="loading-progress">
                <div class="progress-bar"></div>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="admin.error" class="error-state glass-card">
            <div class="error-icon">
                <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            </div>
            <h3 class="error-title">Erreur de chargement</h3>
            <p class="error-message">{{ admin.error }}</p>
            <button @click="admin.fetchCampaigns({ limit: 100 })" class="cyber-button">
                Reessayer
            </button>
        </div>

        <!-- Campaign Cards Grid -->
        <section v-else-if="filteredCampaigns.length > 0" class="campaigns-grid">
            <div
                v-for="(campaign, index) in filteredCampaigns"
                :key="campaign._id"
                class="campaign-card glass-card"
                :class="{ 'alert': isHighMortality(campaign) }"
                :style="`--delay: ${0.1 + index * 0.05}s`"
                @click="openDetailsModal(campaign)"
            >
                <!-- Card Header -->
                <div class="card-header">
                    <div class="campaign-type-badge" :class="campaign.animalType.toLowerCase()">
                        {{ getAnimalEmoji(campaign.animalType) }}
                    </div>
                    <div class="campaign-status" :class="getStatusClass(campaign.status)">
                        <span class="status-dot"></span>
                        {{ campaign.status }}
                    </div>
                </div>

                <!-- Card Body -->
                <div class="card-body">
                    <h3 class="campaign-name">{{ campaign.name }}</h3>
                    <div class="campaign-metrics">
                        <div class="metric">
                            <span class="metric-label">Animaux</span>
                            <span class="metric-value font-mono">{{ campaign.currentAnimalCount }}/{{ campaign.initialAnimalCount }}</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Budget</span>
                            <span class="metric-value font-mono">{{ formatCurrency(campaign.budget) }}</span>
                        </div>
                    </div>

                    <!-- Progress Bar -->
                    <div class="progress-section">
                        <div class="progress-info">
                            <span>Progression</span>
                            <span class="font-mono">{{ getProgressPercentage(campaign) }}%</span>
                        </div>
                        <div class="progress-track">
                            <div
                                class="progress-fill"
                                :class="getProgressClass(campaign)"
                                :style="`width: ${getProgressPercentage(campaign)}%`"
                            ></div>
                        </div>
                    </div>

                    <!-- Mortality Warning -->
                    <div v-if="isHighMortality(campaign)" class="mortality-alert">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                        </svg>
                        <span>Mortalite elevee: {{ campaign.mortality }}%</span>
                    </div>
                </div>

                <!-- Card Footer -->
                <div class="card-footer">
                    <div class="campaign-date">
                        <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        {{ formatDate(campaign.startDate) }}
                    </div>
                    <div class="card-actions">
                        <button
                            @click.stop="openEditModal(campaign)"
                            class="action-btn primary"
                            title="Modifier"
                        >
                            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                        <button
                            @click.stop="deleteCampaign(campaign._id)"
                            class="action-btn danger"
                            title="Supprimer"
                        >
                            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Empty State -->
        <section v-else class="empty-state glass-card">
            <div class="empty-illustration">
                <div class="empty-orbit">
                    <div class="orbit-ring ring-1"></div>
                    <div class="orbit-ring ring-2"></div>
                    <div class="orbit-core">
                        <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                        </svg>
                    </div>
                </div>
            </div>
            <h3 class="empty-title">Aucune campagne trouvee</h3>
            <p class="empty-subtitle">
                {{ filters.search || filters.status || filters.animalType
                    ? 'Ajustez vos filtres pour voir plus de resultats'
                    : 'Creez votre premiere campagne pour commencer a gerer votre elevage'
                }}
            </p>
            <button @click="openCreateModal" class="cyber-button primary glow">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M12 4v16m8-8H4"/>
                </svg>
                Creer une campagne
            </button>
        </section>

        <!-- Create/Edit Modal -->
        <Transition name="modal">
            <div v-if="showModal" class="modal-overlay">
                <div class="modal-backdrop" @click="closeModal"></div>
                <div class="modal-panel glass-card premium">
                    <div class="modal-header-premium">
                        <div class="modal-title-section">
                            <div class="modal-icon" :class="isEditing ? 'edit' : 'create'">
                                <svg v-if="isEditing" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                                <svg v-else width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path d="M12 4v16m8-8H4"/>
                                </svg>
                            </div>
                            <div>
                                <h2 class="modal-title">{{ isEditing ? 'Modifier Campagne' : 'Nouvelle Campagne' }}</h2>
                                <p class="modal-subtitle">{{ isEditing ? 'Mettre a jour les parametres' : 'Configurez votre nouvelle campagne' }}</p>
                            </div>
                        </div>
                        <button @click="closeModal" class="modal-close magnetic">
                            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    <form @submit.prevent="submitForm" class="modal-form">
                        <div class="form-section">
                            <h4 class="section-title">Informations generales</h4>
                            <div class="form-grid">
                                <div class="form-field full-width">
                                    <label class="field-label">Nom de la campagne *</label>
                                    <div class="cyber-input-wrapper">
                                        <input v-model="form.name" type="text" required class="cyber-input" placeholder="Ex: Volaille ete 2024"/>
                                        <div class="input-glow"></div>
                                    </div>
                                </div>

                                <div class="form-field">
                                    <label class="field-label">Type d'animal *</label>
                                    <div class="type-selector">
                                        <button
                                            v-for="type in animalTypes"
                                            :key="type.value"
                                            type="button"
                                            class="type-option"
                                            :class="{ active: form.animalType === type.value }"
                                            @click="form.animalType = type.value"
                                        >
                                            <span class="type-emoji">{{ type.emoji }}</span>
                                            <span class="type-name">{{ type.label }}</span>
                                        </button>
                                    </div>
                                </div>

                                <div class="form-field">
                                    <label class="field-label">Nombre initial *</label>
                                    <div class="cyber-input-wrapper">
                                        <input v-model.number="form.initialAnimalCount" type="number" min="1" required class="cyber-input"/>
                                        <div class="input-glow"></div>
                                    </div>
                                </div>

                                <div v-if="isEditing" class="form-field">
                                    <label class="field-label">Nombre actuel *</label>
                                    <div class="cyber-input-wrapper">
                                        <input v-model.number="form.currentAnimalCount" type="number" min="0" required class="cyber-input"/>
                                        <div class="input-glow"></div>
                                    </div>
                                </div>

                                <div class="form-field">
                                    <label class="field-label">Budget (FCFA) *</label>
                                    <div class="cyber-input-wrapper with-prefix">
                                        <span class="input-prefix">F</span>
                                        <input v-model.number="form.budget" type="number" min="0" required class="cyber-input with-prefix" placeholder="5000000"/>
                                        <div class="input-glow"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-if="isEditing" class="form-section">
                            <h4 class="section-title">Statut & Performance</h4>
                            <div class="form-grid">
                                <div class="form-field">
                                    <label class="field-label">Statut actuel</label>
                                    <div class="status-selector">
                                        <button
                                            v-for="status in statusOptions"
                                            :key="status.value"
                                            type="button"
                                            class="status-option"
                                            :class="[status.class, { active: form.status === status.value }]"
                                            @click="form.status = status.value"
                                        >
                                            <span class="status-dot-sm" :class="status.class"></span>
                                            {{ status.label }}
                                        </button>
                                    </div>
                                </div>

                                <div class="form-field">
                                    <label class="field-label">Taux de mortalite (%)</label>
                                    <div class="mortality-input">
                                        <div class="cyber-input-wrapper">
                                            <input v-model.number="form.mortality" type="number" min="0" max="100" class="cyber-input"/>
                                            <div class="input-glow"></div>
                                        </div>
                                        <div class="mortality-indicator" :class="getMortalityClass(form.mortality)">
                                            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="modal-actions-premium">
                            <button type="button" @click="closeModal" class="cyber-button ghost">Annuler</button>
                            <button type="submit" :disabled="isSubmitting" class="cyber-button primary glow submit">
                                <span v-if="isSubmitting" class="btn-spinner"></span>
                                <span>{{ isEditing ? 'Mettre a jour' : 'Creer la campagne' }}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Transition>

        <!-- Details Modal -->
        <Transition name="modal">
            <div v-if="showDetailsModal && selectedCampaign" class="modal-overlay">
                <div class="modal-backdrop" @click="closeDetailsModal"></div>
                <div class="modal-panel glass-card premium wide">
                    <div class="modal-header-premium">
                        <div class="modal-title-section">
                            <div class="modal-icon info">
                                <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <div>
                                <h2 class="modal-title">Details de la Campagne</h2>
                                <p class="modal-subtitle">Vue complete des metriques</p>
                            </div>
                        </div>
                        <button @click="closeDetailsModal" class="modal-close magnetic">
                            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    <div class="details-content">
                        <div class="details-grid">
                            <div class="detail-card">
                                <div class="detail-header">
                                    <span class="detail-emoji">📋</span>
                                    <span class="detail-label-sm">Nom</span>
                                </div>
                                <p class="detail-value-lg">{{ selectedCampaign.name }}</p>
                            </div>

                            <div class="detail-card">
                                <div class="detail-header">
                                    <span class="detail-emoji">🐾</span>
                                    <span class="detail-label-sm">Type</span>
                                </div>
                                <p class="detail-value-lg">{{ selectedCampaign.animalType }}</p>
                            </div>

                            <div class="detail-card">
                                <div class="detail-header">
                                    <span class="detail-emoji">📊</span>
                                    <span class="detail-label-sm">Statut</span>
                                </div>
                                <div class="detail-status" :class="getStatusClass(selectedCampaign.status)">
                                    <span class="status-dot"></span>
                                    {{ selectedCampaign.status }}
                                </div>
                            </div>

                            <div class="detail-card">
                                <div class="detail-header">
                                    <span class="detail-emoji">💰</span>
                                    <span class="detail-label-sm">Budget</span>
                                </div>
                                <p class="detail-value-lg font-mono">{{ formatCurrency(selectedCampaign.budget) }}</p>
                            </div>

                            <div class="detail-card">
                                <div class="detail-header">
                                    <span class="detail-emoji">🐄</span>
                                    <span class="detail-label-sm">Animaux</span>
                                </div>
                                <p class="detail-value-lg font-mono">
                                    {{ selectedCampaign.currentAnimalCount }}/{{ selectedCampaign.initialAnimalCount }}
                                </p>
                                <div class="detail-mini-progress">
                                    <div class="mini-bar" :style="`width: ${getProgressPercentage(selectedCampaign)}%`"></div>
                                </div>
                            </div>

                            <div class="detail-card" :class="{ alert: selectedCampaign.mortality > 5 }">
                                <div class="detail-header">
                                    <span class="detail-emoji">⚠️</span>
                                    <span class="detail-label-sm">Mortalite</span>
                                </div>
                                <p class="detail-value-lg font-mono" :class="getMortalityClass(selectedCampaign.mortality)">
                                    {{ selectedCampaign.mortality }}%
                                </p>
                            </div>

                            <div class="detail-card full-width">
                                <div class="detail-header">
                                    <span class="detail-emoji">📅</span>
                                    <span class="detail-label-sm">Calendrier</span>
                                </div>
                                <div class="timeline">
                                    <div class="timeline-item">
                                        <span class="timeline-label">Demarrage</span>
                                        <span class="timeline-value">{{ formatDate(selectedCampaign.startDate) }}</span>
                                    </div>
                                    <div v-if="selectedCampaign.endDate" class="timeline-item">
                                        <span class="timeline-label">Fin</span>
                                        <span class="timeline-value">{{ formatDate(selectedCampaign.endDate) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="modal-actions-premium">
                        <button @click="closeDetailsModal" class="cyber-button ghost">Fermer</button>
                        <button @click="editFromDetails(selectedCampaign)" class="cyber-button primary">
                            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            Modifier
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
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

const completedCampaigns = computed(() => 
  admin.campaigns.filter(c => c.status === 'Terminee').length
)

const inProgressCampaigns = computed(() => 
  admin.campaigns.filter(c => c.status === 'En cours').length
)

const highMortalityCampaigns = computed(() => 
  admin.campaigns.filter(c => c.mortality > 5).length
)

// Constants
const animalTypes = [
  { value: 'Volaille', label: 'Volaille', emoji: '🐔' },
  { value: 'Betail', label: 'Bétail', emoji: '🐄' },
  { value: 'Pisciculture', label: 'Pisciculture', emoji: '🐟' }
]

const statusOptions = [
  { value: 'Préparation', label: 'Préparation', class: 'prep' },
  { value: 'En cours', label: 'En cours', class: 'active' },
  { value: 'Terminee', label: 'Terminée', class: 'done' }
]

// Helper methods
const isHighMortality = (campaign) => campaign.mortality > 5

const getAnimalEmoji = (type) => {
  const emojis = { Volaille: '🐔', Betail: '🐄', Pisciculture: '🐟' }
  return emojis[type] || '🐾'
}

const getStatusClass = (status) => {
  const classes = { 'Préparation': 'prep', 'En cours': 'active', 'Terminee': 'done' }
  return classes[status] || 'prep'
}

const getProgressPercentage = (campaign) => {
  if (!campaign.initialAnimalCount || campaign.initialAnimalCount === 0) return 0
  return Math.round((campaign.currentAnimalCount / campaign.initialAnimalCount) * 100)
}

const getProgressClass = (campaign) => {
  const pct = getProgressPercentage(campaign)
  if (pct < 30) return 'low'
  if (pct < 70) return 'medium'
  return 'high'
}

const getMortalityClass = (mortality) => {
  if (mortality <= 3) return 'good'
  if (mortality <= 5) return 'warning'
  return 'danger'
}

const formatCurrency = (value) => {
  if (!value) return '0 FCFA'
  return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

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

<style scoped>
/* ===== CSS VARIABLES ===== */
.campaigns-container {
  --color-primary: #0ea5e9;
  --color-primary-dark: #0284c7;
  --color-secondary: #6366f1;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  
  --border-color: rgba(148, 163, 184, 0.2);
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  
  padding: 1.5rem;
  max-width: 1600px;
  margin: 0 auto;
}

@media (prefers-color-scheme: dark) {
  .campaigns-container {
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --bg-tertiary: #334155;
    --text-primary: #f8fafc;
    --text-secondary: #cbd5e1;
    --text-muted: #64748b;
    --border-color: rgba(148, 163, 184, 0.1);
  }
}

/* ===== HERO SECTION ===== */
.hero-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
  flex-wrap: wrap;
}

.hero-content {
  flex: 1;
  min-width: 300px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(99, 102, 241, 0.1));
  border: 1px solid var(--border-color);
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: var(--color-success);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.hero-title {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.1;
}

.title-prefix {
  display: block;
  font-size: 0.6em;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.25rem;
}

.holographic-text {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary), #8b5cf6, var(--color-primary));
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: holographic 8s ease infinite;
}

@keyframes holographic {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.hero-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin: 0;
}

/* ===== BUTTONS ===== */
.cyber-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  position: relative;
  overflow: hidden;
}

.cyber-button.primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: white;
}

.cyber-button.ghost {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.cyber-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.cyber-button.glow:hover:not(:disabled) {
  box-shadow: 0 0 20px rgba(14, 165, 233, 0.3);
}

.button-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.cyber-button:hover .button-glow {
  transform: translateX(100%);
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===== GLASS CARD ===== */
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
}

@media (prefers-color-scheme: dark) {
  .glass-card {
    background: rgba(30, 41, 59, 0.8);
  }
}

/* ===== STATS GRID ===== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  animation: fadeInUp 0.6s ease-out both;
  animation-delay: var(--delay);
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.stat-icon.primary { background: rgba(14, 165, 233, 0.1); color: var(--color-primary); }
.stat-icon.success { background: rgba(16, 185, 129, 0.1); color: var(--color-success); }
.stat-icon.warning { background: rgba(245, 158, 11, 0.1); color: var(--color-warning); }
.stat-icon.danger { background: rgba(239, 68, 68, 0.1); color: var(--color-danger); }

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.stat-trend {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.stat-trend.up { background: rgba(16, 185, 129, 0.1); color: var(--color-success); }
.stat-trend.down { background: rgba(239, 68, 68, 0.1); color: var(--color-danger); }
.stat-trend.stable { background: var(--bg-tertiary); color: var(--text-muted); }

/* ===== FILTER PANEL ===== */
.filter-panel {
  padding: 1.25rem;
  margin-bottom: 2rem;
  animation: fadeInUp 0.6s ease-out both;
  animation-delay: var(--delay);
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
}

.cyber-input-wrapper {
  position: relative;
}

.cyber-input {
  width: 80%;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  color: var(--text-primary);
  transition: all 0.3s;
}

.cyber-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.input-glow {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--color-primary);
  transition: all 0.3s;
  transform: translateX(-50%);
}

.cyber-input:focus + .input-glow {
  width: 100%;
}

/* ===== LOADING STATE ===== */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
}

.cyber-spinner-large {
  position: relative;
  width: 60px;
  height: 60px;
}

.spinner-ring {
  position: absolute;
  inset: 0;
  border: 3px solid transparent;
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-ring:nth-child(2) {
  inset: 8px;
  border-top-color: var(--color-secondary);
  animation-duration: 1.5s;
}

.spinner-ring:nth-child(3) {
  inset: 16px;
  border-top-color: var(--color-success);
  animation-duration: 2s;
}

.loading-text {
  margin-top: 1.5rem;
  color: var(--text-secondary);
}

.loading-progress {
  width: 200px;
  height: 4px;
  background: var(--bg-tertiary);
  border-radius: 2px;
  margin-top: 1rem;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  width: 30%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  animation: progress 2s ease-in-out infinite;
}

@keyframes progress {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(300%); }
}

/* ===== ERROR STATE ===== */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem;
}

.error-icon {
  color: var(--color-danger);
  margin-bottom: 1rem;
}

.error-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.error-message {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  max-width: 400px;
}

/* ===== CAMPAIGNS GRID ===== */
.campaigns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
}

.campaign-card {
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.5s ease-out both;
  animation-delay: var(--delay);
}

.campaign-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: rgba(14, 165, 233, 0.3);
}

.campaign-card.alert {
  border-left: 4px solid var(--color-danger);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.campaign-type-badge {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-size: 1.25rem;
}

.campaign-type-badge.volaille { background: rgba(245, 158, 11, 0.1); }
.campaign-type-badge.betail { background: rgba(16, 185, 129, 0.1); }
.campaign-type-badge.pisciculture { background: rgba(14, 165, 233, 0.1); }

.campaign-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
}

.campaign-status.prep { background: rgba(99, 102, 241, 0.1); color: var(--color-secondary); }
.campaign-status.active { background: rgba(14, 165, 233, 0.1); color: var(--color-primary); }
.campaign-status.done { background: rgba(16, 185, 129, 0.1); color: var(--color-success); }

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.campaign-status.prep .status-dot { animation: pulse 2s infinite; }

.campaign-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
}

.campaign-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.metric {
  display: flex;
  flex-direction: column;
}

.metric-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
}

.metric-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
}

.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

/* ===== PROGRESS BAR ===== */
.progress-section {
  margin-bottom: 1rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.progress-track {
  height: 8px;
  background: var(--bg-tertiary);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.progress-fill.low { background: var(--color-danger); }
.progress-fill.medium { background: var(--color-warning); }
.progress-fill.high { background: var(--color-success); }

.mortality-alert {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-danger);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
}

/* ===== CARD FOOTER ===== */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  margin-top: auto;
}

.campaign-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.primary { background: rgba(14, 165, 233, 0.1); color: var(--color-primary); }
.action-btn.primary:hover { background: var(--color-primary); color: white; }

.action-btn.danger { background: rgba(239, 68, 68, 0.1); color: var(--color-danger); }
.action-btn.danger:hover { background: var(--color-danger); color: white; }

/* ===== EMPTY STATE ===== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  text-align: center;
}

.empty-illustration {
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 2rem;
}

.empty-orbit {
  position: relative;
  width: 100%;
  height: 100%;
}

.orbit-ring {
  position: absolute;
  border: 2px dashed var(--border-color);
  border-radius: 50%;
}

.orbit-ring.ring-1 {
  inset: 0;
  animation: orbit 10s linear infinite;
}

.orbit-ring.ring-2 {
  inset: 20px;
  animation: orbit 15s linear infinite reverse;
}

.orbit-core {
  position: absolute;
  inset: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border-radius: 50%;
  color: var(--text-muted);
}

@keyframes orbit {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.empty-subtitle {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  max-width: 300px;
}

/* ===== MODALS ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}

.modal-panel {
  position: relative;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 1;
}

.modal-panel.wide {
  max-width: 800px;
}

.modal-panel.premium {
  border: 1px solid rgba(14, 165, 233, 0.2);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header-premium {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-title-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.modal-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
}

.modal-icon.create { background: rgba(16, 185, 129, 0.1); color: var(--color-success); }
.modal-icon.edit { background: rgba(245, 158, 11, 0.1); color: var(--color-warning); }
.modal-icon.info { background: rgba(14, 165, 233, 0.1); color: var(--color-primary); }

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.modal-subtitle {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all 0.2s;
}

.modal-close:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.modal-form {
  padding: 1.5rem;
}

.form-section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field.full-width {
  grid-column: 1 / -1;
}

.field-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
}

.type-selector {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.type-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
}

.type-option:hover {
  border-color: var(--border-color);
}

.type-option.active {
  border-color: var(--color-primary);
  background: rgba(14, 165, 233, 0.1);
}

.type-emoji {
  font-size: 1.5rem;
}

.type-name {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.status-selector {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.status-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
  border: 2px solid transparent;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.status-option:hover {
  border-color: var(--border-color);
}

.status-option.active {
  border-color: var(--color-primary);
}

.status-dot-sm {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-dot-sm.prep { background: var(--color-secondary); }
.status-dot-sm.active { background: var(--color-primary); }
.status-dot-sm.done { background: var(--color-success); }

.with-prefix {
  position: relative;
}

.input-prefix {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-weight: 600;
}

.cyber-input.with-prefix {
  padding-left: 2.5rem;
}

.mortality-input {
  display: flex;
  gap: 0.5rem;
}

.mortality-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  border-radius: var(--radius-md);
}

.mortality-indicator.good { background: rgba(16, 185, 129, 0.1); color: var(--color-success); }
.mortality-indicator.warning { background: rgba(245, 158, 11, 0.1); color: var(--color-warning); }
.mortality-indicator.danger { background: rgba(239, 68, 68, 0.1); color: var(--color-danger); }

.modal-actions-premium {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  background: var(--bg-secondary);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
}

/* ===== DETAILS CONTENT ===== */
.details-content {
  padding: 1.5rem;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.detail-card {
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.detail-card.full-width {
  grid-column: 1 / -1;
}

.detail-card.alert {
  border-color: var(--color-danger);
  background: rgba(239, 68, 68, 0.05);
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.detail-emoji {
  font-size: 1.25rem;
}

.detail-label-sm {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
}

.detail-value-lg {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.detail-value-lg.good { color: var(--color-success); }
.detail-value-lg.warning { color: var(--color-warning); }
.detail-value-lg.danger { color: var(--color-danger); }

.detail-status {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
}

.detail-mini-progress {
  height: 4px;
  background: var(--bg-tertiary);
  border-radius: 2px;
  margin-top: 0.5rem;
  overflow: hidden;
}

.mini-bar {
  height: 100%;
  background: var(--color-primary);
  border-radius: 2px;
}

.timeline {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.timeline-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.timeline-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.timeline-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
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

.modal-enter-from .modal-panel,
.modal-leave-to .modal-panel {
  transform: scale(0.95);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
  }
  
  .hero-title {
    font-size: 1.75rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .campaigns-grid {
    grid-template-columns: 1fr;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-panel {
    max-width: 100%;
    margin: 0.5rem;
  }
}

@media (max-width: 480px) {
  .campaigns-container {
    padding: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-grid {
    grid-template-columns: 1fr;
  }
}

/* ===== REDUCED MOTION ===== */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
