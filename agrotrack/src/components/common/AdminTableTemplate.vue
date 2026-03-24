<!-- AdminTableTemplate pour A3, A5, A6, A7, A8, A9 -->
<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">{{ title }}</h1>
        <p class="text-slate-600">{{ subtitle }}</p>
      </div>
      <button
        v-if="canCreate"
        @click="showNewModal = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <span>+</span> Nouveau
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-100 border-b border-slate-200">
            <tr>
              <th
                v-for="col in columns"
                :key="col.key"
                class="px-6 py-3 text-left text-sm font-semibold text-slate-700"
              >
                {{ col.label }}
              </th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="item in items" :key="item._id" class="hover:bg-slate-50">
              <td v-for="col in columns" :key="col.key" class="px-6 py-4 text-sm">
                <template v-if="col.type === 'badge'">
                  <span
                    :class="getBadgeClass(item[col.key])"
                    class="px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {{ item[col.key] }}
                  </span>
                </template>
                <template v-else-if="col.type === 'currency'">
                  {{ item[col.key]?.toLocaleString() || 0 }} F
                </template>
                <template v-else>
                  {{ item[col.key] }}
                </template>
              </td>
              <td class="px-6 py-4 text-sm space-x-2">
                <button
                  @click="edit(item)"
                  class="text-blue-600 hover:text-blue-800"
                >
                  Éditer
                </button>
                <button
                  @click="deleteItem(item._id)"
                  class="text-red-600 hover:text-red-800"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination" class="mt-6 flex justify-center gap-2">
      <button
        v-for="p in pagination.pages"
        :key="p"
        @click="currentPage = p"
        :class="{
          'bg-blue-600 text-white': currentPage === p,
          'bg-white text-slate-700 border border-slate-300': currentPage !== p,
        }"
        class="px-3 py-1 rounded"
      >
        {{ p }}
      </button>
    </div>

    <!-- Modal -->
    <div v-if="showNewModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 class="text-xl font-bold mb-4">{{ modalTitle }}</h2>
        <slot name="modal-form"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

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
  if (confirm('Êtes-vous sûr?')) {
    props.onDelete?.(id)
  }
}

const getBadgeClass = (value) => {
  const classes = {
    'En cours': 'bg-green-100 text-green-800',
    'Terminée': 'bg-gray-100 text-gray-800',
    'Préparation': 'bg-yellow-100 text-yellow-800',
    'Sain': 'bg-green-100 text-green-800',
    'Malade': 'bg-red-100 text-red-800',
    'Décédé': 'bg-gray-100 text-gray-800',
    'Confirmée': 'bg-green-100 text-green-800',
    'En attente': 'bg-yellow-100 text-yellow-800',
  }
  return classes[value] || 'bg-slate-100 text-slate-800'
}
</script>
