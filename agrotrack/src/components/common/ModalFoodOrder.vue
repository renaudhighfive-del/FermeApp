<template>
  <div class="modal-overlay" :class="{open:open}" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">
          <svg width="20" height="20" fill="none" stroke="var(--primary)" stroke-width="1.5" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/></svg>
          Commander de l'aliment
        </div>
        <button class="modal-close" @click="$emit('close')">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div class="form-group">
        <label class="form-label">Nom de l'aliment <span class="badge-required">*</span></label>
        <input class="form-input" v-model="form.name" placeholder="Ex: Aliment démarrage poulet"/>
      </div>

      <div class="grid-2" style="gap:12px">
        <div class="form-group">
          <label class="form-label">Quantité (kg) <span class="badge-required">*</span></label>
          <input class="form-input" type="number" step="1" v-model="form.quantity" placeholder="Ex: 100"/>
        </div>
        <div class="form-group">
          <label class="form-label">Prix unitaire (FCFA/kg) <span class="badge-required">*</span></label>
          <input class="form-input" type="number" step="1" v-model="form.unitPrice" placeholder="Ex: 450"/>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Fournisseur</label>
        <input class="form-input" v-model="form.supplier" placeholder="Ex: Fournisseur Elevage SA"/>
      </div>

      <div class="alert-card alert-info mb-20">
        <div class="alert-content">
          <div class="alert-title">Total estimé: {{ formatCurrency(totalCost) }}</div>
          <div class="alert-desc">Cette commande créera automatiquement une dépense dans la finance.</div>
        </div>
      </div>

      <!-- Erreur -->
      <div v-if="error" class="alert-card alert-danger mb-20">
        <div class="alert-content">
          <div class="alert-desc">{{ error }}</div>
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn btn-outline" @click="$emit('close')">Annuler</button>
        <button class="btn btn-primary" @click="submit" :disabled="submitting || !form.name || !form.quantity || !form.unitPrice">
          <span v-if="submitting">Enregistrement...</span>
          <span v-else>Valider la commande</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { productService, transactionService } from '@/services/api'
import { formatCurrency } from '@/utils/formatters'

const props = defineProps({
  open: Boolean,
  campaign: Object
})
const emit = defineEmits(['close', 'success'])

const submitting = ref(false)
const error = ref(null)

const form = ref({
  name: '',
  quantity: '',
  unitPrice: '',
  supplier: ''
})

const totalCost = computed(() => {
  const q = parseFloat(form.value.quantity) || 0
  const p = parseFloat(form.value.unitPrice) || 0
  return q * p
})

async function submit() {
  error.value = null
  
  if (!form.value.name || !form.value.quantity || !form.value.unitPrice) {
    error.value = "Veuillez remplir les champs obligatoires"
    return
  }

  submitting.value = true
  try {
    const farmId = props.campaign.farm._id || props.campaign.farm
    const campaignId = props.campaign._id || props.campaign.id
    const amount = totalCost.value

    // 1. Créer ou mettre à jour le produit en stock (Product)
    // On cherche d'abord si un produit avec le même nom existe déjà dans cette ferme
    const existingRes = await productService.getAll({ name: form.value.name, farm: farmId })
    const products = existingRes.data.products || existingRes.data || []
    
    if (products.length > 0) {
      const p = products[0]
      await productService.update(p._id, { 
        quantity: p.quantity + parseFloat(form.value.quantity),
        unitPrice: parseFloat(form.value.unitPrice),
        supplier: form.value.supplier
      })
    } else {
      await productService.create({
        farm: farmId,
        name: form.value.name,
        category: 'Aliment',
        quantity: parseFloat(form.value.quantity),
        unitPrice: parseFloat(form.value.unitPrice),
        supplier: form.value.supplier
      })
    }

    // 2. Créer la transaction financière (Dépense)
    await transactionService.create({
      farm: farmId,
      campaign: campaignId,
      type: 'Dépense',
      category: 'Aliment',
      amount: amount,
      description: `Commande d'aliment: ${form.value.name} (${form.value.quantity} kg)`,
      date: new Date()
    })

    emit('success')
    emit('close')
  } catch (err) {
    console.error('Erreur commande:', err)
    error.value = err.response?.data?.error || "Erreur lors de l'enregistrement de la commande"
  } finally {
    submitting.value = false
  }
}
</script>
