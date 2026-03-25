<!-- AdminTableTemplate pour A3, A5, A6, A7, A8, A9 -->
<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-[var(--text)]">{{ title }}</h1>
        <p class="text-[var(--soft)] text-sm sm:base">{{ subtitle }}</p>
      </div>
      <button
        v-if="canCreate"
        @click="showNewModal = true"
        class="btn btn-primary"
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
                    class="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider"
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
              <td class="text-right space-x-1 whitespace-nowrap">
                <button
                  @click="edit(item)"
                  class="p-2 text-[var(--primary)] hover:bg-[var(--bg)] rounded-lg transition-colors"
                  title="Modifier"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button
                  @click="deleteItem(item._id)"
                  class="p-2 text-[var(--danger)] hover:bg-[var(--danger)]/10 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
                  </svg>
                </button>
              </td>
            </tr>
            <tr v-if="items.length === 0">
              <td :colspan="columns.length + 1" class="text-center py-12 text-[var(--soft)] italic">
                Aucune donnée trouvée
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.pages > 1" class="flex justify-center items-center gap-2 mt-8">
      <button 
        @click="currentPage--" 
        :disabled="currentPage === 1"
        class="btn btn-ghost p-2 disabled:opacity-50"
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      
      <div class="flex gap-1">
        <button
          v-for="p in pagination.pages"
          :key="p"
          @click="currentPage = p"
          :class="currentPage === p ? 'btn-primary' : 'btn-ghost'"
          class="w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-all"
        >
          {{ p }}
        </button>
      </div>

      <button 
        @click="currentPage++" 
        :disabled="currentPage === pagination.pages"
        class="btn btn-ghost p-2 disabled:opacity-50"
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
    </div>

    <!-- Modal Form (Uses GlobalOverlay for consistent modals, but keeping this for local use if needed) -->
    <div v-if="showNewModal" class="fixed inset-0 z-[1100] flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="showNewModal = false"></div>
      <div class="card max-w-lg w-full relative z-10 animate-fadeIn">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-[var(--text)]">{{ modalTitle }}</h2>
          <button @click="showNewModal = false" class="text-[var(--soft)] hover:text-[var(--text)]">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <slot name="modal-form"></slot>
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
    'En cours': 'bg-[var(--success)]/10 text-[var(--success)]',
    'Terminée': 'bg-[var(--soft)]/10 text-[var(--soft)]',
    'Préparation': 'bg-[var(--warn)]/10 text-[var(--warn)]',
    
    // Santé Animale
    'Sain': 'bg-[var(--success)]/10 text-[var(--success)]',
    'Malade': 'bg-[var(--danger)]/10 text-[var(--danger)]',
    'Décédé': 'bg-[var(--soft)]/10 text-[var(--soft)]',
    
    // Ventes / Finance
    'Confirmée': 'bg-[var(--success)]/10 text-[var(--success)]',
    'En attente': 'bg-[var(--warn)]/10 text-[var(--warn)]',
    'Annulée': 'bg-[var(--danger)]/10 text-[var(--danger)]',
    
    // Tâches
    'À faire': 'bg-[var(--warn)]/10 text-[var(--warn)]',
    'Fait': 'bg-[var(--success)]/10 text-[var(--success)]',
    'Urgent': 'bg-[var(--danger)]/10 text-[var(--danger)]',
  }
  return classes[value] || 'bg-[var(--bg)] text-[var(--soft)]'
}
</script>
