<template>
    <div id="stock-page" class="stock-container">
        <!-- Hero Section -->
        <div class="hero-section">
            <div class="hero-content">
                <div class="hero-text">
                    <h1 class="hero-title holographic-text">Gestion Stock Global</h1>
                    <p class="hero-subtitle">{{ products.length }} produit(s) • {{ stocksAlerts.length }} alerte(s) • Controle temps reel</p>
                </div>
            </div>
            <div class="hero-actions">
                <button @click="showAddModal = true" class="cyber-button glow">
                    <span class="btn-icon">
                        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M12 5v14M5 12h14"/>
                        </svg>
                    </span>
                    <span class="btn-label">Ajouter Produit</span>
                </button>
            </div>
        </div>

        <!-- KPI Stats Row -->
        <div class="stats-row">
            <div class="stat-card glass-card" :class="{ pulse: products.length > 0 }">
                <div class="stat-icon primary">
                    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                </div>
                <div class="stat-content">
                    <div class="stat-value">{{ products.length }}</div>
                    <div class="stat-label">References Produits</div>
                    <div class="stat-trend positive">
                        <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M5 15l7-7 7 7"/>
                        </svg>
                        Actif
                    </div>
                </div>
            </div>

            <div class="stat-card glass-card" :class="{ danger: stocksAlerts.length > 0 }">
                <div class="stat-icon danger">
                    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                </div>
                <div class="stat-content">
                    <div class="stat-value" :class="{ 'text-danger': stocksAlerts.length > 0 }">{{ stocksAlerts.length }}</div>
                    <div class="stat-label">Alertes Stock Faible</div>
                    <div class="stat-trend" :class="stocksAlerts.length > 0 ? 'negative' : 'positive'">
                        <svg v-if="stocksAlerts.length > 0" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M19 9l-7 7-7-7"/>
                        </svg>
                        <svg v-else width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M5 15l7-7 7 7"/>
                        </svg>
                        {{ stocksAlerts.length > 0 ? 'Attention requise' : 'Stock optimal' }}
                    </div>
                </div>
            </div>

            <div class="stat-card glass-card">
                <div class="stat-icon success">
                    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                </div>
                <div class="stat-content">
                    <div class="stat-value">{{ (totalStockValue / 1000000).toFixed(1) }}M</div>
                    <div class="stat-label">Valeur Totale</div>
                    <div class="stat-trend neutral">FCFA</div>
                </div>
            </div>

            <div class="stat-card glass-card">
                <div class="stat-icon warning">
                    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <line x1="3" y1="9" x2="21" y2="9"/>
                        <line x1="9" y1="21" x2="9" y2="9"/>
                    </svg>
                </div>
                <div class="stat-content">
                    <div class="stat-value">{{ categories.length }}</div>
                    <div class="stat-label">Categories</div>
                    <div class="stat-trend neutral">Types divers</div>
                </div>
            </div>
        </div>

        <!-- Filters Panel -->
        <div class="filters-panel glass-card">
            <div class="filters-row">
                <div class="filter-group search-group">
                    <span class="filter-icon">
                        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.35-4.35"/>
                        </svg>
                    </span>
                    <input 
                        v-model="filters.search" 
                        type="text"
                        placeholder="Rechercher un produit..."
                        class="cyber-input"
                    />
                </div>
                <div class="filter-group">
                    <select v-model="filters.category" class="cyber-select">
                        <option value="">Toutes categories</option>
                        <option value="Aliment">Aliment</option>
                        <option value="Medicament">Medicament</option>
                        <option value="Equipement">Equipement</option>
                        <option value="Autre">Autre</option>
                    </select>
                </div>
                <button @click="resetFilters" class="cyber-button secondary">
                    <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                        <path d="M3 3v5h5"/>
                    </svg>
                    Reinitialiser
                </button>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="admin.loading" class="loading-state">
            <div class="spinner-lg"></div>
            <p>Chargement du stock...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="admin.error" class="error-alert glass-card">
            <span class="error-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
            </span>
            <span>{{ admin.error }}</span>
        </div>

        <!-- Data Table -->
        <div v-else class="table-card glass-card">
            <div v-if="filteredProducts.length > 0" class="table-container">
                <table class="cyber-table">
                    <thead>
                        <tr>
                            <th>Produit</th>
                            <th>Categorie</th>
                            <th class="text-center">Quantite</th>
                            <th class="text-center">Seuil</th>
                            <th>Fournisseur</th>
                            <th class="text-right">Valeur</th>
                            <th class="text-center">Statut</th>
                            <th class="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(product, index) in filteredProducts" :key="product._id" class="table-row" :style="{ animationDelay: `${index * 0.05}s` }">
                            <td>
                                <div class="product-cell">
                                    <div class="product-avatar" :class="getCategoryClass(product.category)">
                                        {{ product.name.charAt(0).toUpperCase() }}
                                    </div>
                                    <span class="product-name">{{ product.name }}</span>
                                </div>
                            </td>
                            <td>
                                <span class="category-badge" :class="getCategoryClass(product.category)">
                                    {{ product.category }}
                                </span>
                            </td>
                            <td class="text-center">
                                <span class="quantity-value" :class="{ 'text-danger': isLowStock(product) }">
                                    {{ product.quantity }}
                                </span>
                            </td>
                            <td class="text-center">
                                <span class="seuil-value">{{ product.reorderLevel }}</span>
                            </td>
                            <td>
                                <span class="supplier-text">{{ product.supplier || 'N/A' }}</span>
                            </td>
                            <td class="text-right">
                                <span class="value-badge">{{ (product.totalValue / 1000).toFixed(0) }}K FCFA</span>
                            </td>
                            <td class="text-center">
                                <span class="status-badge" :class="isLowStock(product) ? 'danger' : 'success'">
                                    <span class="status-dot"></span>
                                    {{ isLowStock(product) ? 'Stock faible' : 'Normal' }}
                                </span>
                            </td>
                            <td class="text-center">
                                <div class="action-buttons">
                                    <button @click="openDetailsModal(product)" class="action-btn view" title="Voir details">
                                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    </button>
                                    <button @click="openEditModal(product)" class="action-btn edit" title="Modifier">
                                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                        </svg>
                                    </button>
                                    <button @click="openOrderModal(product)" class="action-btn order" title="Commander">
                                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                                            <line x1="3" y1="6" x2="21" y2="6"/>
                                            <path d="M16 10a4 4 0 0 1-8 0"/>
                                        </svg>
                                    </button>
                                    <button @click="deleteProduct(product._id)" class="action-btn delete" title="Supprimer">
                                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                            <polyline points="3 6 5 6 21 6"/>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else class="empty-state">
                <div class="empty-icon">
                    <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        <path d="M20 13V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7m16 0v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5m16 0h-2.586a1 1 0 0 0-.707.293l-2.414 2.414a1 1 0 0 1-.707.293h-3.172a1 1 0 0 1-.707-.293l-2.414-2.414A1 1 0 0 0 6.586 13H4"/>
                    </svg>
                </div>
                <h3>Aucun produit trouve</h3>
                <p>Aucun produit ne correspond aux filtres selectionnes</p>
            </div>
        </div>

        <!-- Modal: Add Product -->
        <Teleport to="body">
            <div v-if="showAddModal" class="modal-overlay" @click.self="closeAddModal">
                <div class="modal-container glass-card">
                    <div class="modal-header">
                        <h2 class="modal-title">
                            <span class="title-icon add"></span>
                            Ajouter un Produit
                        </h2>
                        <button @click="closeAddModal" class="modal-close">
                            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                    <form @submit.prevent="submitAddProduct" class="modal-form">
                        <div class="form-grid">
                            <div class="form-group">
                                <label class="form-label">Nom *</label>
                                <input v-model="addForm.name" type="text" required class="form-input" placeholder="Nom du produit" />
                            </div>
                            <div class="form-group">
                                <label class="form-label">Categorie *</label>
                                <select v-model="addForm.category" required class="form-select">
                                    <option value="">Selectionner</option>
                                    <option value="Aliment">Aliment</option>
                                    <option value="Medicament">Medicament</option>
                                    <option value="Equipement">Equipement</option>
                                    <option value="Autre">Autre</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Quantite *</label>
                                <input v-model.number="addForm.quantity" type="number" required min="0" class="form-input" placeholder="0" />
                            </div>
                            <div class="form-group">
                                <label class="form-label">Seuil alerte *</label>
                                <input v-model.number="addForm.reorderLevel" type="number" required min="0" class="form-input" placeholder="10" />
                            </div>
                            <div class="form-group">
                                <label class="form-label">Prix unitaire (FCFA) *</label>
                                <input v-model.number="addForm.unitPrice" type="number" required min="0" step="0.01" class="form-input" placeholder="0.00" />
                            </div>
                            <div class="form-group">
                                <label class="form-label">Fournisseur</label>
                                <input v-model="addForm.supplier" type="text" class="form-input" placeholder="Nom du fournisseur" />
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" @click="closeAddModal" class="cyber-button secondary">Annuler</button>
                            <button type="submit" :disabled="isSubmitting" class="cyber-button glow">
                                <span v-if="isSubmitting" class="spinner-sm"></span>
                                <span>{{ isSubmitting ? 'Ajout...' : 'Ajouter' }}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>

        <!-- Modal: Product Details -->
        <Teleport to="body">
            <div v-if="showDetailsModal && selectedProduct" class="modal-overlay" @click.self="closeDetailsModal">
                <div class="modal-container glass-card">
                    <div class="modal-header">
                        <h2 class="modal-title">
                            <span class="title-icon view"></span>
                            Details Produit
                        </h2>
                        <button @click="closeDetailsModal" class="modal-close">
                            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                    <div class="details-grid">
                        <div class="detail-item">
                            <label class="detail-label">Nom</label>
                            <p class="detail-value">{{ selectedProduct.name }}</p>
                        </div>
                        <div class="detail-item">
                            <label class="detail-label">SKU</label>
                            <p class="detail-value">{{ selectedProduct.sku || 'N/A' }}</p>
                        </div>
                        <div class="detail-item">
                            <label class="detail-label">Categorie</label>
                            <p class="detail-value">
                                <span class="category-badge" :class="getCategoryClass(selectedProduct.category)">
                                    {{ selectedProduct.category }}
                                </span>
                            </p>
                        </div>
                        <div class="detail-item">
                            <label class="detail-label">Fournisseur</label>
                            <p class="detail-value">{{ selectedProduct.supplier || 'N/A' }}</p>
                        </div>
                        <div class="detail-item">
                            <label class="detail-label">Quantite</label>
                            <p class="detail-value" :class="{ 'text-danger': isLowStock(selectedProduct) }">
                                {{ selectedProduct.quantity }}
                            </p>
                        </div>
                        <div class="detail-item">
                            <label class="detail-label">Seuil d'alerte</label>
                            <p class="detail-value">{{ selectedProduct.reorderLevel }}</p>
                        </div>
                        <div class="detail-item">
                            <label class="detail-label">Prix unitaire</label>
                            <p class="detail-value">{{ selectedProduct.unitPrice.toLocaleString() }} FCFA</p>
                        </div>
                        <div class="detail-item">
                            <label class="detail-label">Valeur totale</label>
                            <p class="detail-value highlight">{{ (selectedProduct.totalValue / 1000).toFixed(0) }}K FCFA</p>
                        </div>
                        <div v-if="selectedProduct.expiryDate" class="detail-item full-width">
                            <label class="detail-label">Date d'expiration</label>
                            <p class="detail-value">{{ new Date(selectedProduct.expiryDate).toLocaleDateString('fr-FR') }}</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button @click="closeDetailsModal" class="cyber-button secondary">Fermer</button>
                        <button @click="openEditModal(selectedProduct)" class="cyber-button glow">Modifier</button>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- Modal: Edit Product -->
        <Teleport to="body">
            <div v-if="showEditModal && selectedProduct" class="modal-overlay" @click.self="closeEditModal">
                <div class="modal-container glass-card">
                    <div class="modal-header">
                        <h2 class="modal-title">
                            <span class="title-icon edit"></span>
                            Modifier Produit
                        </h2>
                        <button @click="closeEditModal" class="modal-close">
                            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                    <form @submit.prevent="submitEditProduct" class="modal-form">
                        <div class="form-grid">
                            <div class="form-group">
                                <label class="form-label">Nom *</label>
                                <input v-model="editForm.name" type="text" required class="form-input" />
                            </div>
                            <div class="form-group">
                                <label class="form-label">Quantite *</label>
                                <input v-model.number="editForm.quantity" type="number" required min="0" class="form-input" />
                            </div>
                            <div class="form-group">
                                <label class="form-label">Seuil alerte *</label>
                                <input v-model.number="editForm.reorderLevel" type="number" required min="0" class="form-input" />
                            </div>
                            <div class="form-group">
                                <label class="form-label">Prix unitaire *</label>
                                <input v-model.number="editForm.unitPrice" type="number" required min="0" step="0.01" class="form-input" />
                            </div>
                            <div class="form-group full-width">
                                <label class="form-label">Fournisseur</label>
                                <input v-model="editForm.supplier" type="text" class="form-input" />
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" @click="closeEditModal" class="cyber-button secondary">Annuler</button>
                            <button type="submit" :disabled="isSubmitting" class="cyber-button glow">
                                <span v-if="isSubmitting" class="spinner-sm"></span>
                                <span>{{ isSubmitting ? 'Mise a jour...' : 'Mettre a jour' }}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>

        <!-- Modal: Order Product -->
        <Teleport to="body">
            <div v-if="showOrderModal && selectedProduct" class="modal-overlay" @click.self="closeOrderModal">
                <div class="modal-container glass-card narrow">
                    <div class="modal-header">
                        <h2 class="modal-title">
                            <span class="title-icon order"></span>
                            Commander {{ selectedProduct.name }}
                        </h2>
                        <button @click="closeOrderModal" class="modal-close">
                            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                    <form @submit.prevent="submitOrder" class="modal-form">
                        <div class="form-group">
                            <label class="form-label">Quantite a commander *</label>
                            <input v-model.number="orderForm.quantity" type="number" required min="1" class="form-input" placeholder="0" />
                        </div>
                        <div class="order-summary">
                            <div class="summary-row">
                                <span>Prix unitaire:</span>
                                <span>{{ selectedProduct.unitPrice.toLocaleString() }} FCFA</span>
                            </div>
                            <div class="summary-row total">
                                <span>Montant total:</span>
                                <span>{{ (selectedProduct.unitPrice * (orderForm.quantity || 0)).toLocaleString() }} FCFA</span>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" @click="closeOrderModal" class="cyber-button secondary">Annuler</button>
                            <button type="submit" :disabled="isSubmitting" class="cyber-button glow">
                                <span v-if="isSubmitting" class="spinner-sm"></span>
                                <span>{{ isSubmitting ? 'Commande...' : 'Confirmer' }}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>
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

const addForm = reactive({
    name: '',
    category: '',
    quantity: 0,
    reorderLevel: 10,
    unitPrice: 0,
    supplier: ''
})

// Category class mapping
const getCategoryClass = (category) => {
    const map = {
        'Aliment': 'food',
        'Medicament': 'medical',
        'Equipement': 'equipment',
        'Autre': 'other'
    }
    return map[category] || 'other'
}

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
        ui.success('Produit mis a jour avec succes')
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
        let farmId = sessionStorage.getItem('currentFarm')
        if (!farmId) {
            farmId = '507f1f77bcf86cd799439011'
        }
        const payload = {
            ...addForm,
            farm: farmId
        }
        await admin.addProduct(payload)
        closeAddModal()
        await admin.fetchProducts({})
        ui.success('Produit ajoute avec succes !')
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
        ui.success('Commande confirmee ! Quantite mise a jour.')
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
        message: 'Etes-vous sur de vouloir supprimer ce produit du stock ? Toutes les donnees associees seront perdues.',
        confirmText: 'Supprimer',
        type: 'danger',
    })

    if (confirm) {
        try {
            await admin.deleteProduct(productId)
            ui.success('Produit supprime du stock')
        } catch (error) {
            console.error('Erreur:', error)
            ui.error('Erreur de suppression')
        }
    }
}

// Init
onMounted(async () => {
    try {
        await admin.fetchProducts({})
    } catch (error) {
        console.error('Error fetching products:', error)
    }
})
</script>

<style scoped>
.stock-container {
    --primary: #0ea5e9;
    --primary-dark: #0284c7;
    --accent: #8b5cf6;
    --success: #10b981;
    --warn: #f59e0b;
    --danger: #ef4444;
    --food: #f59e0b;
    --medical: #ef4444;
    --equipment: #0ea5e9;
    --other: #8b5cf6;
    --bg-primary: #ffffff;
    --bg-secondary: #f8fafc;
    --bg-tertiary: #f1f5f9;
    --text-primary: #0f172a;
    --text-secondary: #475569;
    --text-tertiary: #94a3b8;
    --glass-bg: rgba(255, 255, 255, 0.7);
    --glass-border: rgba(148, 163, 184, 0.2);
    --glass-blur: blur(12px);
    --glass-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --glass-shadow-hover: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    --gradient-hologram: linear-gradient(135deg, #0ea5e9, #8b5cf6, #ec4899, #0ea5e9);
    --glow-primary: 0 0 20px rgba(14, 165, 233, 0.4);
    --glow-danger: 0 0 20px rgba(239, 68, 68, 0.4);
    --glow-success: 0 0 20px rgba(16, 185, 129, 0.4);
    --gap-xs: 4px;
    --gap-sm: 8px;
    --gap-md: 12px;
    --gap-lg: 16px;
    --gap-xl: 24px;
    --gap-2xl: 32px;
    --radius-sm: 6px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-xl: 16px;
    --radius-full: 9999px;
    --transition-base: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (prefers-color-scheme: dark) {
    .stock-container {
        --bg-primary: #0f172a;
        --bg-secondary: #1e293b;
        --bg-tertiary: #334155;
        --text-primary: #f8fafc;
        --text-secondary: #cbd5e1;
        --text-tertiary: #64748b;
        --glass-bg: rgba(30, 41, 59, 0.8);
        --glass-border: rgba(148, 163, 184, 0.1);
    }
}

.stock-container {
    padding: var(--gap-xl);
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
    animation: fadeInUp 0.6s ease-out;
    min-height: 100vh;
}

/* Hero Section */
.hero-section {
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);
    padding-bottom: var(--gap-lg);
    border-bottom: 1px solid var(--glass-border);
}

@media (min-width: 768px) {
    .hero-section {
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
    }
}

.hero-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
}

.hero-title {
    font-size: 32px;
    font-weight: 800;
    margin: 0;
    letter-spacing: -0.02em;
}

.holographic-text {
    background: var(--gradient-hologram);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: holographic 4s ease infinite;
}

@keyframes holographic {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
}

.hero-subtitle {
    font-size: 14px;
    color: var(--text-tertiary);
    font-weight: 500;
    margin: 0;
}

.hero-actions {
    display: flex;
    gap: var(--gap-sm);
}

/* Buttons */
.cyber-button {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-sm);
    padding: var(--gap-sm) var(--gap-md);
    font-size: 13px;
    font-weight: 600;
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: var(--transition-base);
    border: 1px solid transparent;
    background: var(--glass-bg);
    color: var(--text-secondary);
    backdrop-filter: var(--glass-blur);
}

.cyber-button:hover:not(:disabled) {
    border-color: var(--primary);
    color: var(--primary);
    box-shadow: var(--glow-primary);
    transform: translateY(-1px);
}

.cyber-button.glow {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
}

.cyber-button.glow:hover:not(:disabled) {
    background: var(--primary-dark);
    box-shadow: var(--glow-primary);
}

.cyber-button.secondary:hover:not(:disabled) {
    border-color: var(--text-tertiary);
    color: var(--text-primary);
}

.cyber-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-icon {
    display: flex;
    align-items: center;
}

/* Stats Row */
.stats-row {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: var(--gap-md);
}

@media (min-width: 640px) {
    .stats-row { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
    .stats-row { grid-template-columns: repeat(4, 1fr); }
}

.stat-card {
    display: flex;
    align-items: center;
    gap: var(--gap-md);
    padding: var(--gap-lg);
    border-radius: var(--radius-xl);
    transition: var(--transition-base);
    animation: fadeInUp 0.5s ease-out;
    animation-fill-mode: both;
}

.stat-card:nth-child(1) { animation-delay: 0.1s; }
.stat-card:nth-child(2) { animation-delay: 0.2s; }
.stat-card:nth-child(3) { animation-delay: 0.3s; }
.stat-card:nth-child(4) { animation-delay: 0.4s; }

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--glass-shadow-hover);
}

.stat-card.pulse {
    animation: fadeInUp 0.5s ease-out, pulse 2s ease-in-out infinite 1s;
}

@keyframes pulse {
    0%, 100% { box-shadow: var(--glass-shadow); }
    50% { box-shadow: var(--glow-primary); }
}

.stat-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.stat-icon.primary { background: rgba(14, 165, 233, 0.1); color: var(--primary); }
.stat-icon.danger { background: rgba(239, 68, 68, 0.1); color: var(--danger); }
.stat-icon.success { background: rgba(16, 185, 129, 0.1); color: var(--success); }
.stat-icon.warning { background: rgba(245, 158, 11, 0.1); color: var(--warn); }

.stat-value {
    font-size: 24px;
    font-weight: 800;
    color: var(--text-primary);
    line-height: 1.2;
}

.stat-value.text-danger { color: var(--danger); }

.stat-label {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-tertiary);
    margin-top: 2px;
}

.stat-trend {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 600;
    margin-top: var(--gap-xs);
}

.stat-trend.positive { color: var(--success); }
.stat-trend.negative { color: var(--danger); }
.stat-trend.neutral { color: var(--text-tertiary); }

/* Glass Card */
.glass-card {
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-xl);
    box-shadow: var(--glass-shadow);
    transition: var(--transition-base);
}

.glass-card:hover { box-shadow: var(--glass-shadow-hover); }

/* Filters Panel */
.filters-panel {
    padding: var(--gap-md) var(--gap-lg);
}

.filters-row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-md);
    align-items: center;
}

.filter-group {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
}

.filter-group.search-group {
    flex: 1;
    min-width: 200px;
    position: relative;
}

.filter-icon {
    position: absolute;
    left: var(--gap-md);
    color: var(--text-tertiary);
    pointer-events: none;
}

.cyber-input,
.cyber-select {
    padding: var(--gap-sm) var(--gap-md);
    font-size: 14px;
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    background: var(--bg-primary);
    color: var(--text-primary);
    transition: var(--transition-base);
}

.cyber-input {
    padding-left: calc(var(--gap-md) + 20px);
    width: 100%;
}

.cyber-input:focus,
.cyber-select:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

/* Loading & Error States */
.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--gap-lg);
    padding: var(--gap-2xl);
    color: var(--text-secondary);
}

.spinner-lg {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(14, 165, 233, 0.2);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.spinner-sm {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    display: inline-block;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.error-alert {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
    padding: var(--gap-md) var(--gap-lg);
    color: var(--danger);
    background: rgba(239, 68, 68, 0.1);
}

.error-icon {
    display: flex;
}

/* Table */
.table-card {
    overflow: hidden;
}

.table-container {
    overflow-x: auto;
}

.cyber-table {
    width: 100%;
    border-collapse: collapse;
}

.cyber-table th {
    text-align: left;
    padding: var(--gap-md) var(--gap-lg);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-tertiary);
    border-bottom: 1px solid var(--glass-border);
    background: rgba(148, 163, 184, 0.05);
}

.cyber-table td {
    padding: var(--gap-md) var(--gap-lg);
    font-size: 14px;
    color: var(--text-primary);
    border-bottom: 1px solid var(--glass-border);
}

.cyber-table tbody tr {
    transition: var(--transition-base);
    animation: fadeInUp 0.4s ease-out;
    animation-fill-mode: both;
}

.cyber-table tbody tr:hover { background: rgba(148, 163, 184, 0.05); }

.text-center { text-align: center; }
.text-right { text-align: right; }

/* Product Cell */
.product-cell {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
}

.product-avatar {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
}

.product-avatar.food { background: rgba(245, 158, 11, 0.15); color: var(--food); }
.product-avatar.medical { background: rgba(239, 68, 68, 0.15); color: var(--medical); }
.product-avatar.equipment { background: rgba(14, 165, 233, 0.15); color: var(--equipment); }
.product-avatar.other { background: rgba(139, 92, 246, 0.15); color: var(--other); }

.product-name { font-weight: 600; }

/* Category Badge */
.category-badge {
    display: inline-flex;
    padding: var(--gap-xs) var(--gap-sm);
    border-radius: var(--radius-full);
    font-size: 12px;
    font-weight: 600;
}

.category-badge.food { background: rgba(245, 158, 11, 0.1); color: var(--food); }
.category-badge.medical { background: rgba(239, 68, 68, 0.1); color: var(--medical); }
.category-badge.equipment { background: rgba(14, 165, 233, 0.1); color: var(--equipment); }
.category-badge.other { background: rgba(139, 92, 246, 0.1); color: var(--other); }

/* Values */
.quantity-value {
    font-weight: 700;
    font-size: 15px;
}

.quantity-value.text-danger { color: var(--danger); }

.seuil-value {
    color: var(--text-tertiary);
    font-size: 13px;
}

.supplier-text {
    color: var(--text-secondary);
    font-size: 13px;
}

.value-badge {
    font-weight: 700;
    color: var(--success);
    font-size: 13px;
}

/* Status Badge */
.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: var(--gap-xs) var(--gap-sm);
    border-radius: var(--radius-full);
    font-size: 12px;
    font-weight: 600;
}

.status-badge.success {
    background: rgba(16, 185, 129, 0.1);
    color: var(--success);
}

.status-badge.danger {
    background: rgba(239, 68, 68, 0.1);
    color: var(--danger);
}

.status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    animation: blink 2s ease-in-out infinite;
}

.status-badge.danger .status-dot {
    box-shadow: 0 0 8px currentColor;
}

@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
}

/* Action Buttons */
.action-buttons {
    display: flex;
    gap: var(--gap-xs);
    justify-content: center;
}

.action-btn {
    width: 28px;
    height: 28px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    transition: var(--transition-base);
    background: transparent;
}

.action-btn.view { color: var(--success); }
.action-btn.view:hover { background: rgba(16, 185, 129, 0.1); }

.action-btn.edit { color: var(--primary); }
.action-btn.edit:hover { background: rgba(14, 165, 233, 0.1); }

.action-btn.order { color: var(--warn); }
.action-btn.order:hover { background: rgba(245, 158, 11, 0.1); }

.action-btn.delete { color: var(--danger); }
.action-btn.delete:hover { background: rgba(239, 68, 68, 0.1); }

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
    color: var(--text-tertiary);
    margin-bottom: var(--gap-md);
}

.empty-state h3 {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 var(--gap-xs) 0;
}

.empty-state p {
    font-size: 14px;
    color: var(--text-tertiary);
    margin: 0;
}

/* Modal */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: var(--gap-lg);
    animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.modal-container {
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    animation: slideUp 0.3s ease-out;
}

.modal-container.narrow {
    max-width: 400px;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--gap-lg) var(--gap-xl);
    border-bottom: 1px solid var(--glass-border);
}

.modal-title {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
}

.title-icon {
    width: 8px;
    height: 8px;
    border-radius: var(--radius-full);
}

.title-icon.add { background: var(--success); box-shadow: 0 0 8px var(--success); }
.title-icon.view { background: var(--primary); box-shadow: 0 0 8px var(--primary); }
.title-icon.edit { background: var(--warn); box-shadow: 0 0 8px var(--warn); }
.title-icon.order { background: var(--accent); box-shadow: 0 0 8px var(--accent); }

.modal-close {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-md);
    border: none;
    background: transparent;
    color: var(--text-tertiary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition-base);
}

.modal-close:hover {
    background: rgba(239, 68, 68, 0.1);
    color: var(--danger);
}

.modal-form {
    padding: var(--gap-lg) var(--gap-xl);
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--gap-md);
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
}

.form-group.full-width {
    grid-column: 1 / -1;
}

.form-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.form-input,
.form-select {
    padding: var(--gap-sm) var(--gap-md);
    font-size: 14px;
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    background: var(--bg-primary);
    color: var(--text-primary);
    transition: var(--transition-base);
}

.form-input:focus,
.form-select:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--gap-sm);
    padding: var(--gap-lg) var(--gap-xl);
    border-top: 1px solid var(--glass-border);
}

/* Details Grid */
.details-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--gap-lg);
    padding: var(--gap-lg) var(--gap-xl);
}

.detail-item {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
}

.detail-item.full-width {
    grid-column: 1 / -1;
}

.detail-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-tertiary);
}

.detail-value {
    font-size: 14px;
    color: var(--text-primary);
    font-weight: 500;
}

.detail-value.highlight {
    font-size: 16px;
    font-weight: 700;
    color: var(--success);
}

.detail-value.text-danger { color: var(--danger); }

/* Order Summary */
.order-summary {
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    padding: var(--gap-md);
    margin-top: var(--gap-md);
}

.summary-row {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: var(--gap-xs);
}

.summary-row.total {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-primary);
    border-top: 1px solid var(--glass-border);
    padding-top: var(--gap-sm);
    margin-top: var(--gap-sm);
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

/* Responsive */
@media (max-width: 768px) {
    .stock-container { padding: var(--gap-md); }
    .hero-title { font-size: 24px; }
    .form-grid { grid-template-columns: 1fr; }
    .details-grid { grid-template-columns: 1fr; }
    .cyber-table th,
    .cyber-table td {
        padding: var(--gap-sm);
        font-size: 12px;
    }
    .product-avatar {
        width: 32px;
        height: 32px;
        font-size: 12px;
    }
    .action-buttons {
        flex-wrap: wrap;
    }
    .filters-row {
        flex-direction: column;
        align-items: stretch;
    }
    .filter-group.search-group {
        width: 100%;
    }
}

/* Print Styles */
@media print {
    .hero-actions,
    .filters-panel,
    .action-buttons,
    .modal-overlay { display: none !important; }
    .stock-container { background: white !important; }
    .glass-card {
        break-inside: avoid;
        box-shadow: none !important;
        border: 1px solid #e2e8f0 !important;
    }
}
</style>
