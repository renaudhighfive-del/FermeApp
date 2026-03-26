<!-- AdminTableTemplate pour A3, A5, A6, A7, A8, A9 -->
<template>
  <div class="floating-island glass-card enhanced-floating-island">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-[var(--text)] holographic-text">{{ title }}</h1>
        <p class="text-[var(--text-secondary)] text-sm sm:base mt-2">{{ subtitle }}</p>
      </div>
      <button
        v-if="canCreate"
        @click="showNewModal = true"
        class="cyber-button magnetic-field"
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        <span>Nouveau</span>
      </button>
    </div>

    <!-- Table Container -->
    <div class="table-container">
      <div class="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th
                v-for="col in columns"
                :key="col.key"
                :class="{ 'hide-mobile': col.hideMobile }"
              >
                {{ col.label }}
              </th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item._id">
              <td 
                v-for="col in columns" 
                :key="col.key"
                :class="{ 'hide-mobile': col.hideMobile }"
              >
                <template v-if="col.type === 'badge'">
                  <span
                    :class="getBadgeClass(item[col.key])"
                    class="digital-badge"
                  >
                    {{ item[col.key] }}
                  </span>
                </template>
                <template v-else-if="col.type === 'currency'">
                  <span class="font-mono font-medium">{{ item[col.key]?.toLocaleString() || 0 }} F</span>
                </template>
                <template v-else-if="col.type === 'date'">
                  {{ formatDate(item[col.key]) }}
                </template>
                <template v-else>
                  {{ item[col.key] }}
                </template>
              </td>
              <td class="text-right space-x-2 whitespace-nowrap actions-cell">
                <button
                  @click="edit(item)"
                  class="action-btn magnetic-field"
                  title="Modifier"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button
                  @click="deleteItem(item._id)"
                  class="action-btn danger magnetic-field"
                  title="Supprimer"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
                  </svg>
                </button>
              </td>
            </tr>
    <div v-if="items.length === 0" class="empty-state">
              <div class="empty-icon">
                <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24">
                  <rect x="4" y="4" width="16" height="16" rx="2"/>
                  <line x1="8" y1="9" x2="16" y2="9"/>
                  <line x1="8" y1="13" x2="12" y2="13"/>
                </svg>
              </div>
              <p class="empty-text">Aucune donnée trouvée</p>
            </div>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.pages > 1" class="floating-island glass-card pagination-island">
      <div class="flex justify-center items-center gap-3">
        <button 
          @click="currentPage--" 
          :disabled="currentPage === 1"
          class="pagination-btn magnetic-field"
          :class="{ disabled: currentPage === 1 }"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        
        <div class="flex gap-2">
          <button
            v-for="p in pagination.pages"
            :key="p"
            @click="currentPage = p"
            class="page-btn magnetic-field"
            :class="{ active: currentPage === p }"
          >
            {{ p }}
          </button>
        </div>

        <button 
          @click="currentPage++" 
          :disabled="currentPage === pagination.pages"
          class="pagination-btn magnetic-field"
          :class="{ disabled: currentPage === pagination.pages }"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Premium Modal Form -->
    <div v-if="showNewModal" class="premium-modal-overlay" @click.self="showNewModal = false">
      <div class="premium-modal-container">
        <div class="premium-modal-header">
          <div class="premium-modal-icon modal-icon-info">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="premium-modal-title-section">
            <h2 class="premium-modal-title">{{ modalTitle }}</h2>
            <p class="premium-modal-subtitle">Remplissez les informations ci-dessous</p>
          </div>
          <button @click="showNewModal = false" class="premium-modal-close magnetic-field">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="premium-modal-body">
          <slot name="modal-form"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()

const props = defineProps({
  title: String,
  subtitle: String,
  columns: Array,
  data: Array,
  canCreate: { type: Boolean, default: true },
  onEdit: Function,
  onDelete: Function,
  modalTitle: String,
})

const showNewModal = ref(false)
const currentPage = ref(1)
const itemsPerPage = 10

const items = computed(() => props.data || [])
const pagination = computed(() => {
  const total = items.value.length
  const totalPages = Math.ceil(total / itemsPerPage)
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  return {
    pages,
    total,
  }
})

const edit = (item) => {
  props.onEdit?.(item)
}

const deleteItem = async (id) => {
  const confirm = await ui.confirm({
    title: 'Suppression',
    message: 'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.',
    confirmText: 'Supprimer',
    type: 'danger'
  })

  if (confirm) {
    props.onDelete?.(id)
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const getBadgeClass = (value) => {
  const classes = {
    // Statuts Campagnes
    'En cours': 'digital-badge-success',
    'Terminée': 'digital-badge-secondary',
    'Préparation': 'digital-badge-warning',
    
    // Santé Animale
    'Sain': 'digital-badge-success',
    'Malade': 'digital-badge-danger',
    'Décédé': 'digital-badge-secondary',
    
    // Ventes / Finance
    'Confirmée': 'digital-badge-success',
    'En attente': 'digital-badge-warning',
    'Annulée': 'digital-badge-danger',
    
    // Tâches
    'À faire': 'digital-badge-warning',
    'Fait': 'digital-badge-success',
    'Urgent': 'digital-badge-danger',
  }
  return classes[value] || 'digital-badge'
}
</script>

<style scoped>
/* Floating Island Container */
.floating-island {
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: var(--border-thin) solid var(--glass-border);
    border-radius: var(--radius-xl);
    padding: var(--gap-xl);
    box-shadow: var(--glass-shadow);
    animation: fadeInUp 0.6s ease-out;
    transition: var(--transition-base);
}

.floating-island:hover {
    box-shadow: var(--shadow-xl);
}

.enhanced-floating-island {
    margin-bottom: var(--gap-xl);
}

/* Holographic Title */
.holographic-text {
    background: var(--gradient-hologram);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: holographic 3s ease infinite;
}

/* Cyber Button */
.cyber-button {
    background: var(--gradient-primary);
    color: var(--text-inverse);
    border: none;
    border-radius: var(--radius-md);
    padding: 12px 24px;
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: var(--transition-base);
    position: relative;
    overflow: hidden;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: inline-flex;
    align-items: center;
    gap: var(--gap-sm);
    box-shadow: var(--shadow-md);
}

.cyber-button:hover {
    box-shadow: var(--glow-primary);
    transform: translateY(-2px);
}

/* Digital Badge */
.digital-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xs);
    padding: 6px 12px;
    border-radius: var(--radius-full);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border: var(--border-thin) solid transparent;
    transition: var(--transition-base);
    position: relative;
    overflow: hidden;
    animation: fadeIn 0.3s ease-out;
}

.digital-badge-success {
    background: var(--success-light);
    color: var(--success);
    border-color: var(--success);
}

.digital-badge-danger {
    background: var(--danger-light);
    color: var(--danger);
    border-color: var(--danger);
}

.digital-badge-warning {
    background: var(--warning-light);
    color: var(--warning);
    border-color: var(--warning);
}

.digital-badge-secondary {
    background: var(--bg-tertiary);
    color: var(--text-secondary);
    border-color: var(--glass-border);
}

/* Action Buttons */
.actions-cell {
    padding: var(--gap-md);
}

.action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: var(--glass-bg);
    border: var(--border-thin) solid var(--glass-border);
    color: var(--primary);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition-base);
}

.action-btn:hover {
    background: var(--primary);
    color: var(--text-inverse);
    border-color: var(--primary);
    box-shadow: var(--glow-primary);
}

.action-btn.danger {
    color: var(--danger);
}

.action-btn.danger:hover {
    background: var(--danger);
    color: var(--text-inverse);
    border-color: var(--danger);
    box-shadow: var(--glow-danger);
}

/* Empty State */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--gap-2xl);
    text-align: center;
}

.empty-icon {
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--glass-bg);
    border-radius: var(--radius-lg);
    color: var(--text-tertiary);
    margin-bottom: var(--gap-md);
}

.empty-text {
    font-size: 14px;
    color: var(--text-secondary);
    font-style: italic;
}

/* Pagination Island */
.pagination-island {
    padding: var(--gap-md) var(--gap-lg);
    margin-top: var(--gap-xl);
}

.pagination-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: transparent;
    border: var(--border-thin) solid var(--glass-border);
    color: var(--text-secondary);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition-base);
}

.pagination-btn:hover:not(.disabled) {
    background: var(--glass-bg);
    color: var(--text-primary);
    border-color: var(--accent);
}

.pagination-btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.page-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    height: 40px;
    padding: 0 var(--gap-md);
    background: transparent;
    border: var(--border-thin) solid var(--glass-border);
    color: var(--text-secondary);
    font-size: 14px;
    font-weight: 500;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition-base);
}

.page-btn:hover {
    background: var(--glass-bg);
    color: var(--text-primary);
}

.page-btn.active {
    background: var(--gradient-primary);
    color: var(--text-inverse);
    border-color: var(--primary);
    box-shadow: var(--glow-primary);
}

/* Premium Modal */
.premium-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-modal);
    padding: var(--gap-lg);
    animation: fadeIn 0.2s ease-out;
}

.premium-modal-container {
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: var(--border-thin) solid var(--glass-border);
    border-radius: var(--radius-xl);
    max-width: 500px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    animation: scaleIn 0.3s ease-out;
    box-shadow: var(--shadow-2xl);
}

.premium-modal-header {
    display: flex;
    align-items: flex-start;
    gap: var(--gap-lg);
    padding: var(--gap-xl);
    border-bottom: var(--border-thin) solid var(--glass-border);
}

.premium-modal-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.modal-icon-info {
    background: var(--info-light);
    color: var(--info);
}

.premium-modal-title-section {
    flex: 1;
}

.premium-modal-title {
    font-family: var(--font-heading);
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 var(--gap-xs) 0;
}

.premium-modal-subtitle {
    font-size: 14px;
    color: var(--text-secondary);
    margin: 0;
}

.premium-modal-close {
    background: transparent;
    border: none;
    color: var(--text-tertiary);
    padding: var(--gap-sm);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: var(--transition-base);
    flex-shrink: 0;
}

.premium-modal-close:hover {
    color: var(--text-primary);
    background: var(--glass-bg);
}

.premium-modal-body {
    padding: var(--gap-xl);
}

/* Magnetic Field Effect */
.magnetic-field {
    transition: var(--transition-slow);
}

.magnetic-field:hover {
    transform: scale(1.02);
}

/* Animations */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

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

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes holographic {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

/* Responsive Design */
@media (max-width: 640px) {
    .floating-island {
        padding: var(--gap-lg);
    }
    
    .cyber-button {
        width: 100%;
        justify-content: center;
    }
    
    .pagination-island {
        padding: var(--gap-sm);
    }
    
    .page-btn {
        min-width: 36px;
        height: 36px;
        font-size: 12px;
    }
    
    .pagination-btn {
        width: 36px;
        height: 36px;
    }
}
</style>
