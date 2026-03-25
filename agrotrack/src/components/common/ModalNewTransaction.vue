<template>
  <div class="modal-overlay" :class="{ open: open }" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">
          <svg width="20" height="20" fill="none" stroke="var(--primary)" stroke-width="1.5" viewBox="0 0 24 24">
            <path d="M12 2v20M2 12h20" />
          </svg>
          {{ type === 'Revenu' ? 'Enregistrer un revenu' : 'Enregistrer une dépense' }}
        </div>
        <button class="modal-close" @click="$emit('close')">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div v-if="campaign">
        <div class="grid-2" style="gap:12px">
          <div class="form-group">
            <label class="form-label">Catégorie <span class="badge-required">*</span></label>
            <select class="form-input" v-model="form.category">
              <option value="">-- Sélectionner --</option>
              <option v-for="cat in filteredCategories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Montant (FCFA) <span class="badge-required">*</span></label>
            <input class="form-input" type="number" v-model="form.amount" placeholder="Ex: 5000" />
          </div>
        </div>

        <div class="grid-2" style="gap:12px">
          <div class="form-group">
            <label class="form-label">Date <span class="badge-required">*</span></label>
            <input class="form-input" type="date" v-model="form.date" />
          </div>
          <div class="form-group">
            <label class="form-label">Mode de paiement</label>
            <select class="form-input" v-model="form.paymentMethod">
              <option value="Espèces">Espèces</option>
              <option value="Virement">Virement</option>
              <option value="Chèque">Chèque</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Description <span class="badge-required">*</span></label>
          <textarea class="form-input" v-model="form.description" rows="2" placeholder="Détails de la transaction..."></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Référence (N° Facture/Reçu)</label>
          <input class="form-input" v-model="form.reference" placeholder="Ex: FAC-2024-001" />
        </div>

        <div v-if="error" class="alert-card alert-danger" style="margin-top:12px">
          <div class="alert-desc">{{ error }}</div>
        </div>

        <div class="modal-actions">
          <button class="btn btn-outline" @click="$emit('close')">Annuler</button>
          <button class="btn btn-primary" @click="submit" :disabled="loading">
            {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { transactionService } from '@/services/api'

const props = defineProps({
  open: Boolean,
  campaign: Object,
  type: {
    type: String,
    default: 'Dépense'
  }
})

const emit = defineEmits(['close', 'created'])

const form = ref({
  category: '',
  amount: '',
  date: new Date().toISOString().split('T')[0],
  description: '',
  reference: '',
  paymentMethod: 'Espèces'
})

const loading = ref(false)
const error = ref(null)

const categories = [
  "Aliment",
  "Médicament",
  "Équipement",
  "Vente",
  "Eau",
  "Électricité",
  "Main-d'œuvre",
  "Autre"
]

const filteredCategories = computed(() => {
  if (props.type === 'Revenu') return ['Vente', 'Autre']
  return categories.filter(c => c !== 'Vente')
})

watch(() => props.open, (newVal) => {
  if (newVal) {
    error.value = null
    form.value.category = props.type === 'Revenu' ? 'Vente' : ''
  }
})

async function submit() {
  if (!form.value.category || !form.value.amount || !form.value.description) {
    error.value = "Veuillez remplir tous les champs obligatoires."
    return
  }

  loading.value = true
  error.value = null

  try {
    const data = {
      ...form.value,
      type: props.type,
      campaign: props.campaign._id || props.campaign.id,
      farm: props.campaign.farm?._id || props.campaign.farm
    }

    const res = await transactionService.create(data)
    emit('created', res.data)
    emit('close')
    
    // Reset form
    form.value = {
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      reference: '',
      paymentMethod: 'Espèces'
    }
  } catch (err) {
    error.value = err.response?.data?.error || "Erreur lors de l'enregistrement."
  } finally {
    loading.value = false
  }
}
</script>
