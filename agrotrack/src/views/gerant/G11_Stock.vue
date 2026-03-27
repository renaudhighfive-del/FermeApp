<template>
  <div class="space-y-6 p-6">
  
    <div v-if="showAddModal" class="modal-overlay" @click.self="closeAddModal">
      <div class="modal">
        <div class="modal-header">
          <div class="btn btn-primary">Ajouter un produit</div>
          <button class="modal-close" @click="closeAddModal">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <form @submit.prevent="submitAddProduct" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fermes *</label>
              <select v-model="addForm.farm" required class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="" disabled>Sélectionner une ferme</option>
                <option v-for="farm in gerant.farms" :key="farm._id || farm.id" :value="farm._id || farm.id">{{ farm.name || farm.nom || 'Ferme ' + (farm._id || farm.id) }}</option>
              </select>
            </div>
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
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
              <input v-model="addForm.supplier" type="text" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" @click="closeAddModal" class="btn btn-outlined">Annuler</button>
            <button type="submit" :disabled="isSubmitting" class="btn btn-primary">
              {{ isSubmitting ? 'Ajout en cours...' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Header -->
    <div class="flex justify-between items-center gap-5">
      <div>
        <h1 class="text-3xl font-bold">Gestion du Stock</h1>
        <p class="text-slate-600">{{ products.length }} produit(s) - {{ lowStockAlerts }} alerte(s)</p>
      </div>
      <button @click="showAddModal = true" class="btn btn-primary flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Ajouter produit
      </button>
    </div>

    <!-- KPIs -->
    <div class="stats-grid">
      <div class="card">
        <div class="text-sm text-gray-500 mb-2">Stock total</div>
        <div class="text-4xl font-bold">{{ products.length }}</div>
        <div class="text-xs text-gray-500">références produits</div>
      </div>
      <div class="card">
        <div class="text-sm text-gray-500 mb-2">Alertes stock faible</div>
        <div class="text-4xl font-bold text-red-600">{{ lowStockAlerts }}</div>
        <div class="text-xs text-gray-500">produits sous seuil</div>
      </div>
      <div class="card">
        <div class="text-sm text-gray-500 mb-2">Valeur totale</div>
        <div class="text-4xl font-bold">{{ (totalStockValue / 1000000).toFixed(1) }}M</div>
        <div class="text-xs text-gray-500">FCFA</div>
      </div>
      <div class="card">
        <div class="text-sm text-gray-500 mb-2">Catégories</div>
        <div class="text-4xl font-bold">{{ categories.length }}</div>
        <div class="text-xs text-gray-500">catégories</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card filter-area">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label class="form-label">Rechercher</label>
          <input v-model="filters.search" placeholder="Rechercher un produit..." class="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label class="form-label">Campagne</label>
          <select v-model="filters.campaignId" class="w-full px-3 py-2 border rounded">
            <option value="">Toutes campagnes</option>
            <option v-for="campaign in gerant.campaigns" :key="campaign._id || campaign.id" :value="campaign._id || campaign.id">
              {{ campaign.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="form-label">Catégorie</label>
          <select v-model="filters.category" class="w-full px-3 py-2 border rounded">
            <option value="">Toutes catégories</option>
            <option value="Aliment">Aliment</option>
            <option value="Médicament">Médicament</option>
            <option value="Équipement">Équipement</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
      </div>
      <div class="mt-3">
        <button @click="resetFilters" class="text-blue-600 hover:text-blue-800 text-sm font-medium">Réinitialiser filtres</button>
      </div>
    </div>

    <!-- States -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="text-slate-600"><div class="inline-block animate-spin mr-2">⟳</div>Chargement...</div>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{{ error }}</div>

    <!-- Table -->
    <div v-else class="table-container">
      <div v-if="filteredProducts.length > 0" class="overflow-x-auto">
        <table class="table">
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
              <td class="px-6 py-4 text-sm" :class="{ 'text-red-600 font-bold': isLowStock(product) }">{{ product.quantity }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ product.reorderLevel }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ product.supplier || 'N/A' }}</td>
              <td class="px-6 py-4 text-sm font-medium">{{ ((product.quantity || 0) * (product.unitPrice || 0) / 1000).toFixed(0) }}K FCFA</td>
              <td class="px-6 py-4">
                <span :class="['status-badge', getStockStatusClass(product)]">{{ getStockStatus(product) }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex gap-2 flex-wrap">
                  <button @click="openDetailsModal(product)" class="text-green-600 hover:text-green-800 text-sm font-medium">Voir</button>
                  <button @click="openEditModal(product)" class="text-blue-600 hover:text-blue-800 text-sm font-medium">Modifier</button>
                  <button @click="openOrderModal(product)" class="text-orange-600 hover:text-orange-800 text-sm font-medium">Commander</button>
                  <button @click="deleteProduct(product._id)" class="text-red-600 hover:text-red-800 text-sm font-medium">Supprimer</button>
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
    <div v-if="showDetailsModal && selectedProduct" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header">
          <h2>Détails Produit</h2>
          <button @click="closeDetailsModal" class="modal-close">×</button>
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
            <p class="text-gray-900 font-medium" :class="{ 'text-danger': isLowStock(selectedProduct), 'text-success': !isLowStock(selectedProduct) }">{{ selectedProduct.quantity }}</p>
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
            <p class="text-gray-900 font-bold">{{ ((selectedProduct.quantity || 0) * (selectedProduct.unitPrice || 0) / 1000).toFixed(0) }}K FCFA</p>
          </div>
          <div v-if="selectedProduct.expiryDate" class="col-span-2">
            <label class="block text-sm font-semibold text-gray-700 mb-1">Date d'expiration</label>
            <p class="text-gray-900">{{ new Date(selectedProduct.expiryDate).toLocaleDateString('fr-FR') }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeDetailsModal" class="btn btn-outlined">Fermer</button>
          <button @click="openEditModal(selectedProduct)" class="btn btn-primary">Modifier</button>
        </div>
      </div>
    </div>

    <!-- Modal Modifier Produit -->
    <div v-if="showEditModal && selectedProduct" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header">
          <h2>Modifier Produit</h2>
          <button @click="closeEditModal" class="modal-close">×</button>
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
          <div class="modal-footer">
            <button type="button" @click="closeEditModal" class="btn btn-outlined">Annuler</button>
            <button type="submit" :disabled="isSubmitting" class="btn btn-primary">{{ isSubmitting ? 'Mise à jour...' : 'Mettre à jour' }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Commander -->
    <div v-if="showOrderModal && selectedProduct" class="modal-overlay">
      <div class="modal-card" style="max-width: 600px;">
        <div class="modal-header">
          <h2>Commander {{ selectedProduct.name }}</h2>
          <button @click="closeOrderModal" class="modal-close">×</button>
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
          <div class="modal-footer">
            <button type="button" @click="closeOrderModal" class="btn btn-outlined">Annuler</button>
            <button type="submit" :disabled="isSubmitting" class="btn btn-primary">{{ isSubmitting ? 'Commande en cours...' : 'Confirmer commande' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useGerantStore } from '@/stores/gerant'
import { productService } from '@/services/api'

const ui = useUiStore()
const gerant = useGerantStore()

const products = ref([])
const loading = ref(false)
const error = ref(null)

const showDetailsModal = ref(false)
const showEditModal = ref(false)
const showOrderModal = ref(false)
const showAddModal = ref(false)
const selectedProduct = ref(null)
const isSubmitting = ref(false)

const filters = reactive({ search: '', campaignId: '', category: '' })

const editForm = reactive({ name: '', quantity: 0, reorderLevel: 0, unitPrice: 0, supplier: '' })
const orderForm = reactive({ quantity: 1 })
const addForm = reactive({ farm: '', name: '', category: '', quantity: 0, reorderLevel: 10, unitPrice: 0, supplier: '' })

const allowedFarmIds = computed(() => gerant.farms.map((f) => f._id || f.id))

const categories = computed(() => Array.from(new Set(products.value.map((p) => p.category))))
const lowStockAlerts = computed(() => products.value.filter((p) => isLowStock(p)).length)
const totalStockValue = computed(() => products.value.reduce((sum, p) => sum + (p.totalValue || (p.quantity || 0) * (p.unitPrice || 0)), 0))
const filteredProducts = computed(() => products.value.filter((product) => {
  const matchSearch = product.name?.toLowerCase().includes(filters.search.toLowerCase()) || false
  const matchCategory = !filters.category || product.category === filters.category
  const matchCampaign = !filters.campaignId || ((product.campaign && (product.campaign._id || product.campaign.id) === filters.campaignId) || (product.campaignId === filters.campaignId))
  return matchSearch && matchCategory && matchCampaign
}))

const isLowStock = (product) => {
  return (product.quantity || 0) <= (product.reorderLevel || 0)
}

const getStockStatus = (product) => {
  return isLowStock(product) ? 'Stock faible' : 'Normal'
}

const getStockStatusClass = (product) => {
  return isLowStock(product) ? 'status-badge-low' : 'status-badge-normal'
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
  addForm.farm = allowedFarmIds.value[0] || ''
  addForm.name = ''
  addForm.category = ''
  addForm.quantity = 0
  addForm.reorderLevel = 10
  addForm.unitPrice = 0
  addForm.supplier = ''
}

const fetchProducts = async () => {
  loading.value = true
  error.value = null
  try {
    if (!gerant.farms.length) {
      await gerant.fetchGerantFarms()
    }
    const farmIds = allowedFarmIds.value
    if (!farmIds.length) {
      products.value = []
      return
    }

    const allProducts = []
    for (const farmId of farmIds) {
      const response = await productService.getAll({ farm: farmId, limit: 1000 })
      const items = response.data.products || response.data || []
      allProducts.push(...items)
    }

    products.value = allProducts
    if (!addForm.farm) addForm.farm = farmIds[0]
  } catch (err) {
    console.error('Erreur fetchProducts:', err)
    error.value = err.response?.data?.error || err.message || 'Impossible de charger les produits'
  } finally {
    loading.value = false
  }
}

const submitAddProduct = async () => {
  try {
    isSubmitting.value = true

    if (!addForm.farm) {
      ui.error('Veuillez sélectionner une ferme')
      return
    }

    const payload = {
      farm: addForm.farm,
      name: addForm.name,
      category: addForm.category,
      quantity: addForm.quantity,
      reorderLevel: addForm.reorderLevel,
      unitPrice: addForm.unitPrice,
      supplier: addForm.supplier,
    }

    const response = await productService.create(payload)
    products.value.push(response.data)
    closeAddModal()
    ui.success('Produit ajouté avec succès !')
  } catch (err) {
    console.error('Erreur:', err)
    ui.error('Erreur: ' + (err.response?.data?.error || err.message || 'Impossible d\'ajouter le produit'))
  } finally {
    isSubmitting.value = false
  }
}

const submitEditProduct = async () => {
  if (!selectedProduct.value) return
  try {
    isSubmitting.value = true

    const payload = {
      name: editForm.name,
      quantity: editForm.quantity,
      reorderLevel: editForm.reorderLevel,
      unitPrice: editForm.unitPrice,
      supplier: editForm.supplier,
    }

    const response = await productService.update(selectedProduct.value._id, payload)
    const index = products.value.findIndex((p) => p._id === selectedProduct.value._id)
    if (index !== -1) products.value[index] = response.data

    closeEditModal()
    ui.success('Produit mis à jour avec succès')
  } catch (err) {
    console.error('Erreur:', err)
    ui.error('Erreur: ' + (err.response?.data?.error || err.message || 'Impossible de modifier le produit'))
  } finally {
    isSubmitting.value = false
  }
}

const submitOrder = async () => {
  if (!selectedProduct.value) return
  try {
    isSubmitting.value = true
    const newQuantity = (selectedProduct.value.quantity || 0) + (orderForm.quantity || 0)
    const response = await productService.update(selectedProduct.value._id, { quantity: newQuantity })
    const index = products.value.findIndex((p) => p._id === selectedProduct.value._id)
    if (index !== -1) products.value[index] = response.data
    closeOrderModal()
    ui.success('Commande confirmée! Quantité mise à jour.')
  } catch (err) {
    console.error('Erreur:', err)
    ui.error('Erreur: ' + (err.response?.data?.error || err.message || 'Impossible de confirmer la commande'))
  } finally {
    isSubmitting.value = false
  }
}

const deleteProduct = async (productId) => {
  const confirmed = await ui.confirm({
    title: 'Supprimer le produit',
    message: 'Êtes-vous sûr de vouloir supprimer ce produit du stock ? Toutes les données associées seront perdues.',
    confirmText: 'Supprimer',
    cancelText: 'Annuler',
    type: 'danger',
  })
  if (!confirmed) return

  try {
    await productService.delete(productId)
    products.value = products.value.filter((p) => p._id !== productId)
    ui.success('Produit supprimé du stock')
  } catch (err) {
    console.error('Erreur:', err)
    ui.error('Erreur de suppression')
  }
}

onMounted(async () => {
  if (!gerant.farms.length) {
    await gerant.fetchGerantFarms()
  }
  if (!gerant.campaigns.length) {
    await gerant.fetchGerantCampaigns()
  }
  await fetchProducts()
})
</script>

<style scoped>

.filter-area {
  border-left: 4px solid #60a5fa;
  padding-left: 0.75rem;
  background: #ffffff;
  border-radius: 0.6rem;
}
.filter-area select,
.filter-area input {
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid #d1d5db;
  border-radius: 0.45rem;
}
.filter-area select:focus,
.filter-area input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.18);
}

/* Table */
.table-wrap {
  overflow-x: auto;
}
.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}
.table th,
.table td {
  padding: 0.8rem 0.9rem;
}
.table thead th {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 2px solid #e5e7eb;
  background: #fafaf9;
}
.table tbody tr:hover {
  background: #f8fafc;
}

/* Modal - fond et contenu */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 11, 13, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}
.modal, .modal-card {
  width: min(100%, 840px);
  max-height: 92vh;
  overflow-y: auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 46px rgba(15, 23, 42, 0.3);
  animation: popIn 0.18s ease-out;
}
@keyframes popIn {
  from { transform: translateY(8px) scale(0.99); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.4rem 1.5rem 0.8rem;
  border-bottom: 1px solid #e5e7eb;
}
.modal-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #111827;
}
.modal-close {
  border: none;
  background: transparent;
  cursor: pointer;
  color: #6b7280;
}
.modal-close:hover {
  color: #111827;
}

.modal-footer {
  border-top: 1px solid #e5e7eb;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 0.7rem 1rem;
  border-radius: 0.55rem;
  font-weight: 600;
}
.btn-primary:hover {
  background: #1e40af;
}

.btn-outlined {
  background: #fff;
  border: 1px solid #cbd5e1;
  color: #334155;
  padding: 0.7rem 1rem;
  border-radius: 0.55rem;
}
.btn-outlined:hover {
  border-color: #94a3b8;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.75rem;
  border: 1px solid transparent;
}
.status-badge-normal {
  color: var(--success);
  background-color: rgba(45, 106, 79, 0.15);
  border-color: rgba(45, 106, 79, 0.3);
}
.status-badge-low {
  color: var(--danger);
  background-color: rgba(214, 40, 40, 0.14);
  border-color: rgba(214, 40, 40, 0.3);
}

.btn-primary {
  background: var(--primary);
  color: #fff;
  border: none;
  padding: 0.7rem 1rem;
  border-radius: 0.55rem;
  font-weight: 600;
}
.btn-primary:hover {
  background: #2a1d15; /* darker shade of --primary */
}
</style>