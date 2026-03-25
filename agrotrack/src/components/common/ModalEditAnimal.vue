<template>
  <div class="modal-overlay" :class="{open:open}" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">
          <svg width="20" height="20" fill="none" stroke="var(--primary)" stroke-width="1.5" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Modifier l'animal
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
          <button class="btn btn-primary" @click="update" :disabled="loading">
            <span v-if="loading">Mise à jour...</span>
            <span v-else>Enregistrer les modifications</span>
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
  animal: Object
})
const emit = defineEmits(['close', 'updated'])

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

// Pré-remplir le formulaire quand la modal s'ouvre
watch(
  () => props.open,
  (newVal) => {
    if (newVal && props.animal) {
      form.value = {
        idNumber: props.animal.idNumber || '',
        type: props.animal.type || '',
        breed: props.animal.breed || '',
        weight: props.animal.weight || '',
        location: props.animal.location || '',
        birthDate: props.animal.dateOfBirth ? props.animal.dateOfBirth.split('T')[0] : '',
        healthStatus: props.animal.healthStatus || 'Sain'
      }
    }
  },
  { immediate: true }
)

async function update() {
  error.value = null

  // Validation
  if (!form.value.idNumber || !form.value.type) {
    error.value = 'Remplissez les champs obligatoires (ID et Type)'
    return
  }

  loading.value = true

  try {
    const animalData = {
      idNumber: form.value.idNumber,
      type: form.value.type,
      breed: form.value.breed,
      dateOfBirth: form.value.birthDate,
      weight: form.value.weight ? parseFloat(form.value.weight) : null,
      location: form.value.location,
      healthStatus: form.value.healthStatus
    }

    const response = await animalService.update(props.animal._id || props.animal.id, animalData)
    emit('updated', response.data)
    emit('close')
  } catch (err) {
    console.error('Erreur lors de la modification:', err)
    error.value = err.response?.data?.error || 'Erreur lors de la modification de l\'animal'
  } finally {
    loading.value = false
  }
}
</script>
