<template>
  <div class="modal-overlay" :class="{open:open}" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">
          <svg width="20" height="20" fill="none" stroke="var(--primary)" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          Distribuer de l'aliment
        </div>
        <button class="modal-close" @click="$emit('close')">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div v-if="loadingStock" class="text-center p-20">
        <p class="text-soft">Chargement du stock...</p>
      </div>

      <div v-else-if="availableStock.length === 0" class="alert-card alert-warning mb-20">
        <div class="alert-content">
          <div class="alert-title">Aucun stock d'aliment</div>
          <div class="alert-desc">Vous devez d'abord commander de l'aliment pour pouvoir en distribuer.</div>
        </div>
      </div>

      <div v-else>
        <!-- Sélection de l'aliment -->
        <div class="form-group">
          <label class="form-label">Type d'aliment <span class="badge-required">*</span></label>
          <select class="form-input" v-model="form.productId" @change="updateSelectedStock">
            <option value="">-- Sélectionner un aliment en stock --</option>
            <option v-for="item in availableStock" :key="item._id" :value="item._id">
              {{ item.name }} (Disponible: {{ item.quantity }} kg)
            </option>
          </select>
        </div>

        <!-- Quantité à distribuer -->
        <div class="form-group">
          <label class="form-label">Quantité à distribuer (kg) <span class="badge-required">*</span></label>
          <div style="position: relative;">
            <input class="form-input" type="number" step="0.1" v-model="form.quantity" placeholder="Ex: 25.5"/>
            <div v-if="selectedStock" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); font-size: 11px; color: var(--soft);">
              Max: {{ selectedStock.quantity }} kg
            </div>
          </div>
        </div>

        <!-- Note/Observation -->
        <div class="form-group">
          <label class="form-label">Notes / Observations</label>
          <textarea class="form-input" v-model="form.notes" rows="2" placeholder="Ex: Distribution matin, Lot A..."></textarea>
        </div>

        <!-- Erreur -->
        <div v-if="error" class="alert-card alert-danger mb-20">
          <div class="alert-content">
            <div class="alert-desc">{{ error }}</div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn btn-outline" @click="$emit('close')">Annuler</button>
          <button class="btn btn-primary" @click="submit" :disabled="submitting || !form.productId || !form.quantity">
            <span v-if="submitting">Enregistrement...</span>
            <span v-else>Valider la distribution</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { productService, campaignService } from '@/services/api'

const props = defineProps({
  open: Boolean,
  campaign: Object
})
const emit = defineEmits(['close', 'success'])

const loadingStock = ref(false)
const submitting = ref(false)
const error = ref(null)
const availableStock = ref([])
const selectedStock = ref(null)

const form = ref({
  productId: '',
  quantity: '',
  notes: ''
})

onMounted(async () => {
  if (props.open) {
    await fetchStock()
  }
})

async function fetchStock() {
  loadingStock.value = true
  try {
    // On récupère les produits de catégorie 'Aliment' pour la ferme de la campagne
    const res = await productService.getAll({ 
      category: 'Aliment', 
      farm: props.campaign.farm._id || props.campaign.farm,
      limit: 100 
    })
    availableStock.value = res.data.products || res.data || []
  } catch (err) {
    console.error('Erreur chargement stock:', err)
    error.value = "Impossible de charger le stock d'aliments"
  } finally {
    loadingStock.value = false
  }
}

function updateSelectedStock() {
  selectedStock.value = availableStock.value.find(s => s._id === form.productId)
}

async function submit() {
  error.value = null
  
  if (!form.value.productId || !form.value.quantity) {
    error.value = "Veuillez remplir les champs obligatoires"
    return
  }

  const qty = parseFloat(form.value.quantity)
  if (qty <= 0) {
    error.value = "La quantité doit être supérieure à 0"
    return
  }

  if (selectedStock.value && qty > selectedStock.value.quantity) {
    error.value = `Stock insuffisant (Max: ${selectedStock.value.quantity} kg)`
    return
  }

  submitting.value = true
  try {
    // 1. Déduire du stock (Product)
    const newQty = selectedStock.value.quantity - qty
    await productService.update(selectedStock.value._id, { quantity: newQty })

    // 2. Mettre à jour la campagne (feedConsumed)
    // Note: Dans une version plus complexe, on créerait une entrée Distribution
    // Ici on simplifie en mettant à jour directement la campagne
    const updatedCampaign = {
      feedConsumed: (props.campaign.feedConsumed || 0) + qty
    }
    await campaignService.update(props.campaign._id || props.campaign.id, updatedCampaign)

    emit('success')
    emit('close')
  } catch (err) {
    console.error('Erreur distribution:', err)
    error.value = err.response?.data?.error || "Erreur lors de l'enregistrement de la distribution"
  } finally {
    submitting.value = false
  }
}
</script>
