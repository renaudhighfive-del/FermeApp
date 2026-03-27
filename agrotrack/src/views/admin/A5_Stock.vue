<template>
  <div class="space-y-6 p-6">
    <!-- Modal Ajouter Produit -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Ajouter un produit</h2>
          <button @click="closeAddModal" class="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>
        <form @submit.prevent="submitAddProduct" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input v-model="addForm.name" type="text" required class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
              <select v-model="addForm.category" required class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Sélectionner</option>
                <option value="Aliment">Aliment</option>
                <option value="Médicament">Médicament</option>
                <option value="Équipement">Équipement</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Quantité *</label>
              <input v-model.number="addForm.quantity" type="number" required min="0" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Seuil alerte *</label>
              <input v-model.number="addForm.reorderLevel" type="number" required min="0" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Prix unitaire (FCFA) *</label>
              <input v-model.number="addForm.unitPrice" type="number" required min="0" step="0.01" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
              <input v-model="addForm.supplier" type="text" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-6 border-t mt-6">
            <button type="button" @click="closeAddModal" class="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg">
              Annuler
            </button>
            <button type="submit" :disabled="isSubmitting" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg">
              {{ isSubmitting ? 'Ajout en cours...' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
      <div>
        <h1 class="text-3xl font-bold text-[var(--text)]">Gestion Stock Global</h1>
        <p class="text-[var(--soft)] mt-1">{{ products.length }} produit(s) - {{ stocksAlerts.length }} alerte(s)</p>
      </div>
      <div class="flex gap-3 w-full lg:w-auto">
        <button 
          @click="showAddModal = true"
          class="btn btn-primary flex items-center gap-2 w-full lg:w-auto"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          <span>Ajouter Produit</span>
        </button>
        <button 
          @click="exportToPDF"
          class="btn btn-outline flex items-center gap-2 w-full lg:w-auto"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          <span>Exporter PDF</span>
        </button>
      </div>
    </div>

    <!-- KPIs -->
    <div class="stats-grid">
      <div class="card p-6">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4M5 7l8 4m0 0l-8-4m8 4v10a2 2 0 0 0 2h-4a2 2 0 0 0-2-2v-10a2 2 0 0 0-2-2h4a2 2 0 0 0 2 2z"/>
            </svg>
          </div>
          <div>
            <div class="text-[var(--soft)] text-xs font-bold uppercase tracking-wider">Total Animaux</div>
            <div class="text-3xl font-bold text-[var(--text)]">{{ products.length }}</div>
            <div class="text-[var(--soft)] text-[10px] mt-1 font-bold">références produits</div>
          </div>
        </div>
      </div>
      <div class="card p-6">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a2 2 0 0 0 2-2h-4a2 2 0 0 0-2 2v-4a2 2 0 0 0-2-2h4a2 2 0 0 0 2 2z"/>
            </svg>
          </div>
          <div>
            <div class="text-[var(--soft)] text-xs font-bold uppercase tracking-wider">Campagnes Actives</div>
            <div class="text-3xl font-bold text-[var(--text)]">{{ categories.length }}</div>
            <div class="text-[var(--soft)] text-[10px] mt-1 font-bold">en cours</div>
          </div>
        </div>
      </div>
      <div class="card p-6">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <div>
            <div class="text-[var(--soft)] text-xs font-bold uppercase tracking-wider">Taux de Mortalité</div>
            <div class="text-3xl font-bold text-[var(--danger)]">{{ stocksAlerts.length }}</div>
            <div class="text-[var(--soft)] text-[10px] mt-1 font-bold">alertes actives</div>
          </div>
        </div>
      </div>
      <div class="card p-6">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 3 .895.002 2 2 2v2c0 1.657 1.343 3 3 3s3-1.343 3-3-3-3-3z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13"/>
            </svg>
          </div>
          <div>
            <div class="text-[var(--soft)] text-xs font-bold uppercase tracking-wider">Revenus du Mois</div>
            <div class="text-3xl font-bold text-[var(--text)]">{{ (totalStockValue / 1000000).toFixed(1) }}M</div>
            <div class="text-[var(--soft)] text-[10px] mt-1 font-bold">FCFA</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="search-wrap">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input 
            v-model="filters.search" 
            placeholder="Rechercher un produit..."
            class="search-input"
          />
        </div>
        <select v-model="filters.category" class="filter-select">
          <option value="">Toutes catégories</option>
          <option value="Aliment">Aliment</option>
          <option value="Médicament">Médicament</option>
          <option value="Équipement">Équipement</option>
          <option value="Autre">Autre</option>
        </select>
      </div>
      <div class="flex items-center justify-between">
        <button 
          @click="resetFilters"
          class="text-[var(--primary)] hover:text-[var(--text)] text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Réinitialiser filtres
        </button>
        <div class="text-[var(--soft)] text-sm">
          {{ filteredProducts.length }} résultat(s)
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="admin.loading" class="flex justify-center items-center py-12">
      <div class="text-slate-600">
        <div class="inline-block animate-spin mr-2">⟳</div>
        Chargement...
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="admin.error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      {{ admin.error }}
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="filteredProducts.length > 0" class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Produit</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Catégorie</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Quantité</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Seuil</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Fournisseur</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Valeur</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="product in filteredProducts" :key="product._id" class="hover:bg-gray-50">
              <td class="px-6 py-4 font-medium">{{ product.name }}</td>
              <td class="px-6 py-4 text-sm">{{ product.category }}</td>
              <td class="px-6 py-4 text-sm" :class="{ 'text-red-600 font-bold': isLowStock(product) }">
                {{ product.quantity }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ product.reorderLevel }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ product.supplier || 'N/A' }}</td>
              <td class="px-6 py-4 text-sm font-medium">{{ (product.totalValue / 1000).toFixed(0) }}K FCFA</td>
              <td class="px-6 py-4">
                <span 
                  :class="isLowStock(product) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'"
                  class="px-3 py-1 rounded-full text-sm font-medium inline-block"
                >
                  {{ isLowStock(product) ? 'Stock faible' : 'Normal' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex gap-2 flex-wrap">
                  <button 
                    @click="openDetailsModal(product)"
                    class="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    Voir
                  </button>
                  <button 
                    @click="openEditModal(product)"
                    class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Modifier
                  </button>
                  <button 
                    @click="openOrderModal(product)"
                    class="text-orange-600 hover:text-orange-800 text-sm font-medium"
                  >
                    Commander
                  </button>
                  <button 
                    @click="deleteProduct(product._id)"
                    class="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">Aucun produit</h3>
        <p class="mt-1 text-gray-500">Aucun produit ne correspond aux filtres</p>
      </div>
    </div>

    <!-- Modal Détails Produit -->
    <div v-if="showDetailsModal && selectedProduct" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl max-h-96 overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Détails Produit</h2>
          <button @click="closeDetailsModal" class="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Nom</label>
            <p class="text-gray-900 font-medium">{{ selectedProduct.name }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">SKU</label>
            <p class="text-gray-900">{{ selectedProduct.sku || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Catégorie</label>
            <p class="text-gray-900">{{ selectedProduct.category }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Fournisseur</label>
            <p class="text-gray-900">{{ selectedProduct.supplier || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Quantité</label>
            <p class="text-gray-900 font-medium" :class="{ 'text-red-600': isLowStock(selectedProduct) }">
              {{ selectedProduct.quantity }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Seuil d'alerte</label>
            <p class="text-gray-900">{{ selectedProduct.reorderLevel }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Prix unitaire</label>
            <p class="text-gray-900">{{ selectedProduct.unitPrice.toLocaleString() }} FCFA</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Valeur totale</label>
            <p class="text-gray-900 font-bold">{{ (selectedProduct.totalValue / 1000).toFixed(0) }}K FCFA</p>
          </div>
          <div v-if="selectedProduct.expiryDate" class="col-span-2">
            <label class="block text-sm font-semibold text-gray-700 mb-1">Date d'expiration</label>
            <p class="text-gray-900">{{ new Date(selectedProduct.expiryDate).toLocaleDateString('fr-FR') }}</p>
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-6 border-t mt-6">
          <button @click="closeDetailsModal" class="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg">
            Fermer
          </button>
          <button @click="openEditModal(selectedProduct)" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            Modifier
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Modifier Produit -->
    <div v-if="showEditModal && selectedProduct" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl max-h-96 overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Modifier Produit</h2>
          <button @click="closeEditModal" class="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>

        <form @submit.prevent="submitEditProduct" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input v-model="editForm.name" type="text" required class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Quantité *</label>
              <input v-model.number="editForm.quantity" type="number" required min="0" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Seuil alerte *</label>
              <input v-model.number="editForm.reorderLevel" type="number" required min="0" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Prix unitaire *</label>
              <input v-model.number="editForm.unitPrice" type="number" required min="0" step="0.01" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
              <input v-model="editForm.supplier" type="text" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-6 border-t mt-6">
            <button type="button" @click="closeEditModal" class="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg">
              Annuler
            </button>
            <button type="submit" :disabled="isSubmitting" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg">
              {{ isSubmitting ? 'Mise à jour...' : 'Mettre à jour' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Commander -->
    <div v-if="showOrderModal && selectedProduct" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Commander {{ selectedProduct.name }}</h2>
          <button @click="closeOrderModal" class="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>

        <form @submit.prevent="submitOrder" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Quantité à commander *</label>
            <input v-model.number="orderForm.quantity" type="number" required min="1" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">Prix unitaire:</span>
              <span class="font-medium">{{ selectedProduct.unitPrice.toLocaleString() }} FCFA</span>
            </div>
            <div class="flex justify-between text-lg font-bold">
              <span>Montant total:</span>
              <span>{{ (selectedProduct.unitPrice * (orderForm.quantity || 0)).toLocaleString() }} FCFA</span>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-6 border-t mt-6">
            <button type="button" @click="closeOrderModal" class="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg">
              Annuler
            </button>
            <button type="submit" :disabled="isSubmitting" class="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg">
              {{ isSubmitting ? 'Commande en cours...' : 'Confirmer commande' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { useUiStore } from '@/stores/ui'

const admin = useAdminStore()
const ui = useUiStore()
const showDetailsModal = ref(false)
const showEditModal = ref(false)
const showOrderModal = ref(false)
const showAddModal = ref(false)
const selectedProduct = ref(null)
const isSubmitting = ref(false)

// Filters
const filters = reactive({
  search: '',
  category: ''
})

// Forms
const editForm = reactive({
  name: '',
  quantity: 0,
  reorderLevel: 0,
  unitPrice: 0,
  supplier: ''
})

const orderForm = reactive({
  quantity: 1
})

// Formulaire d'ajout
const addForm = reactive({
  name: '',
  category: '',
  quantity: 0,
  reorderLevel: 10,
  unitPrice: 0,
  supplier: ''
})

// Computed
const products = computed(() => admin.products)

const categories = computed(() => {
  const cats = new Set(admin.products.map(p => p.category))
  return Array.from(cats)
})

const stocksAlerts = computed(() => 
  admin.products.filter(p => isLowStock(p))
)

const totalStockValue = computed(() =>
  admin.products.reduce((sum, p) => sum + (p.totalValue || 0), 0)
)

const filteredProducts = computed(() => {
  return admin.products.filter(product => {
    const matchSearch = product.name?.toLowerCase().includes(filters.search.toLowerCase()) || false
    const matchCategory = !filters.category || product.category === filters.category
    return matchSearch && matchCategory
  })
})

// Methods
const isLowStock = (product) => {
  return product.quantity <= product.reorderLevel
}

const resetFilters = () => {
  filters.search = ''
  filters.category = ''
}

const openDetailsModal = (product) => {
  selectedProduct.value = product
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedProduct.value = null
}

const openEditModal = (product) => {
  selectedProduct.value = product
  editForm.name = product.name
  editForm.quantity = product.quantity
  editForm.reorderLevel = product.reorderLevel
  editForm.unitPrice = product.unitPrice
  editForm.supplier = product.supplier || ''
  showDetailsModal.value = false
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedProduct.value = null
}

const submitEditProduct = async () => {
  try {
    isSubmitting.value = true
    await admin.updateProduct(selectedProduct.value._id, {
      name: editForm.name,
      quantity: editForm.quantity,
      reorderLevel: editForm.reorderLevel,
      unitPrice: editForm.unitPrice,
      supplier: editForm.supplier
    })
    closeEditModal()
    ui.success('Produit mis à jour avec succès')
  } catch (error) {
    console.error('Erreur:', error)
    ui.error('Erreur: ' + (error.message || 'Impossible de modifier le produit'))
  } finally {
    isSubmitting.value = false
  }
}

const openOrderModal = (product) => {
  selectedProduct.value = product
  orderForm.quantity = 1
  showOrderModal.value = true
}

const closeOrderModal = () => {
  showOrderModal.value = false
  selectedProduct.value = null
}

const closeAddModal = () => {
  showAddModal.value = false
  resetAddForm()
}

const resetAddForm = () => {
  addForm.name = ''
  addForm.category = ''
  addForm.quantity = 0
  addForm.reorderLevel = 10
  addForm.unitPrice = 0
  addForm.supplier = ''
}

const submitAddProduct = async () => {
  try {
    isSubmitting.value = true
    // Récupérer la ferme courante
    let farmId = sessionStorage.getItem('currentFarm')
    if (!farmId) {
      // fallback par défaut si jamais
      farmId = '507f1f77bcf86cd799439011'
    }
    const payload = {
      ...addForm,
      farm: farmId
    }
    await admin.addProduct(payload)
    closeAddModal()
    // Rafraîchir la liste
    await admin.fetchProducts({})
    ui.success('Produit ajouté avec succès !')
  } catch (error) {
    console.error('Erreur:', error)
    ui.error('Erreur: ' + (error.message || 'Impossible d\'ajouter le produit'))
  } finally {
    isSubmitting.value = false
  }
}

const submitOrder = async () => {
  try {
    isSubmitting.value = true
    const newQuantity = selectedProduct.value.quantity + orderForm.quantity
    await admin.updateProduct(selectedProduct.value._id, {
      quantity: newQuantity
    })
    closeOrderModal()
    ui.success('Commande confirmée! Quantité mise à jour.')
  } catch (error) {
    console.error('Erreur:', error)
    ui.error('Erreur: ' + (error.message || 'Impossible de confirmer la commande'))
  } finally {
    isSubmitting.value = false
  }
}

const deleteProduct = async (productId) => {
  const confirm = await ui.confirm({
    title: 'Supprimer le produit',
    message: 'Êtes-vous sûr de vouloir supprimer ce produit du stock ? Toutes les données associées seront perdues.',
    confirmText: 'Supprimer',
    type: 'danger',
  })

  if (confirm) {
    try {
      await admin.deleteProduct(productId)
      ui.success('Produit supprimé du stock')
    } catch (error) {
      console.error('Erreur:', error)
      ui.error('Erreur de suppression')
    }
  }
}

// Init
onMounted(async () => {
  // Fetch all products without farm filter to debug
  try {
    const result = await admin.fetchProducts({})
  } catch (error) {
    console.error('❌ Error fetching products:', error)
  }
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

/* Espacement des modaux */
.bg-white.rounded-lg.shadow-lg {
  padding: 2.5rem !important; /* 40px */
  margin: 1rem !important;
  border-radius: 0.75rem !important; /* 12px au lieu de 16px */
}

.bg-white.rounded-lg.shadow-lg.p-8 {
  padding: 2.5rem !important; /* 40px */
}

/* Espacement entre les éléments */
.space-y-4 > * + * {
  margin-top: 1rem !important; /* 16px */
}

.space-y-6 > * + * {
  margin-top: 1.5rem !important; /* 24px */
}

/* Champs de formulaire */
input[type="text"],
input[type="number"],
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
input[type="number"]:focus,
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

/* Bouton principal (submit) */
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

button[type="submit"]:disabled {
  background: #9ca3af !important;
  cursor: not-allowed !important;
  transform: none !important;
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

/* Boutons action (table) */
button:not([type]) {
  padding: 0.5rem 1rem !important; /* 8px 16px */
  border-radius: 0.5rem !important; /* 8px */
  font-size: 0.8125rem !important; /* 13px */
}

button:not([type]):hover {
  transform: translateY(-1px) !important;
}

/* Header des modaux */
.flex.justify-between.items-center.mb-6 {
  margin-bottom: 1.5rem !important; /* 24px */
}

/* Footer des modaux */
.flex.justify-end.gap-2.pt-6 {
  padding-top: 1.5rem !important; /* 24px */
  margin-top: 1.5rem !important; /* 24px */
  border-top: 1px solid var(--border) !important;
}

/* Grid des formulaires */
.grid.grid-cols-2.gap-4 {
  gap: 1rem !important; /* 16px */
}

/* Sections des modaux */
.grid.grid-cols-2.gap-6 {
  gap: 1.5rem !important; /* 24px */
}

/* Contenu des détails */
.bg-gray-50.p-4.rounded-lg {
  padding: 1.5rem !important; /* 24px */
  border-radius: 0.75rem !important; /* 12px */
}

/* Responsive */
@media (max-width: 640px) {
  .bg-white.rounded-lg.shadow-lg {
    margin: 0.5rem !important;
    padding: 1.5rem !important; /* 24px */
  }
  
  button {
    padding: 0.625rem 1rem !important; /* 10px 16px */
    font-size: 0.8125rem !important; /* 13px */
  }
  
  .grid.grid-cols-2 {
    grid-template-columns: 1fr !important;
  }
}
</style>
