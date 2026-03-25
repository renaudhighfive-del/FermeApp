<template>
  <div class="modal-overlay" :class="{open:open}" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">
          <svg width="20" height="20" fill="none" stroke="var(--primary)" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/></svg>
          Ajouter un animal
        </div>
        <button class="modal-close" @click="$emit('close')">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <!-- Contenu du formulaire -->
      <div>
        <!-- ID Animal -->
        <div class="form-group">
          <label class="form-label">ID Animal <span class="badge-required">*</span></label>
          <input class="form-input" v-model="form.idNumber" placeholder="Ex: VOL001"/>
        </div>

        <!-- Type -->
        <div class="form-group">
          <label class="form-label">Type <span class="badge-required">*</span></label>
          <select class="form-input" v-model="form.type">
            <option value="">-- Sélectionner un type --</option>
            <option value="Volaille">Volaille</option>
            <option value="Bétail">Bétail</option>
            <option value="Pisciculture">Pisciculture</option>
          </select>
        </div>

        <!-- Race -->
        <div class="form-group">
          <label class="form-label">Race</label>
          <input class="form-input" v-model="form.breed" placeholder="Ex: Rhode Island"/>
        </div>

        <!-- Poids et Lot -->
        <div class="grid-2" style="gap:12px">
          <div class="form-group">
            <label class="form-label">Poids (kg)</label>
            <input class="form-input" type="number" step="0.01" v-model="form.weight" placeholder="Ex: 2.5"/>
          </div>
          <div class="form-group">
            <label class="form-label">Lot</label>
            <input class="form-input" v-model="form.location" placeholder="Ex: Lot A"/>
          </div>
        </div>

        <!-- Date de naissance -->
        <div class="form-group">
          <label class="form-label">Date de naissance</label>
          <input class="form-input" type="date" v-model="form.birthDate"/>
        </div>

        <!-- Statut santé -->
        <div class="form-group">
          <label class="form-label">Statut santé</label>
          <select class="form-input" v-model="form.healthStatus">
            <option value="Sain">Sain</option>
            <option value="Suspect">Suspect</option>
            <option value="Malade">Malade</option>
          </select>
        </div>

        <!-- Erreur -->
        <div v-if="error" class="alert-card alert-danger">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div class="alert-content">
            <div class="alert-desc">{{ error }}</div>
          </div>
        </div>

        <!-- Actions -->
        <div class="modal-actions">
          <button class="btn btn-outline" @click="$emit('close')">Annuler</button>
          <button class="btn btn-primary" @click="create" :disabled="loading">
            <span v-if="loading">Ajout...</span>
            <span v-else>Ajouter</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { animalService } from '@/services/api'

const props = defineProps({
  open: Boolean,
  campaign: Object
})
const emit = defineEmits(['close', 'created'])

const loading = ref(false)
const error = ref(null)

const form = ref({
  idNumber: '',
  type: '',
  breed: '',
  weight: '',
  location: '',
  birthDate: '',
  healthStatus: 'Sain'
})

// Générer un ID unique quand la modal s'ouvre
watch(
  () => props.open,
  (newVal) => {
    if (newVal && props.campaign) {
      // Générer un ID basé sur le type d'animal et un numéro séquentiel unique
      const animalType = props.campaign.animalType === 'Volaille' ? 'VOL' :
                        props.campaign.animalType === 'Bétail' ? 'BET' : 'PIS'
      
      // Utiliser un UUID simple pour l'unicité
      const uniqueId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
      form.value.idNumber = `${animalType}-${uniqueId.toUpperCase()}`
    }
  }
)

async function create() {
  error.value = null

  // Validation
  if (!form.value.idNumber || !form.value.type) {
    error.value = 'Remplissez les champs obligatoires (ID et Type)'
    return
  }

  loading.value = true

  try {
    const animalData = {
      campaign: props.campaign._id || props.campaign.id,
      idNumber: form.value.idNumber,
      type: form.value.type,
      breed: form.value.breed,
      dateOfBirth: form.value.birthDate,
      weight: form.value.weight ? parseFloat(form.value.weight) : null,
      location: form.value.location
    }

    const response = await animalService.create(animalData)
    emit('created', response.data)
    emit('close')

    // Reset form
    form.value = {
      idNumber: '',
      type: '',
      breed: '',
      weight: '',
      location: '',
      birthDate: '',
      healthStatus: 'Sain'
    }
  } catch (err) {
    console.error('Erreur complète lors de l\'ajout:', err)
    error.value = err.response?.data?.error || 'Erreur lors de l\'ajout de l\'animal'
  } finally {
    loading.value = false
  }
}
</script>