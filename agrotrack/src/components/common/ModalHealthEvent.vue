<template>
  <div class="modal-overlay" :class="{open:open}" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">
          <svg width="20" height="20" fill="none" stroke="var(--primary)" stroke-width="1.5" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
          Enregistrer événement santé
        </div>
        <button class="modal-close" @click="$emit('close')">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div v-if="campaign">
        <!-- Animal -->
        <div class="form-group">
          <label class="form-label">Animal <span class="badge-required">*</span></label>
          <select class="form-input" v-model="form.animalId">
            <option value="">-- Sélectionner un animal --</option>
            <option v-for="animal in animals" :key="animal._id || animal.id" :value="animal._id || animal.id">
              {{ animal.idNumber || animal._id }} - {{ animal.type }}
            </option>
          </select>
        </div>

        <!-- Type d'événement -->
        <div class="form-group">
          <label class="form-label">Type d'événement <span class="badge-required">*</span></label>
          <select class="form-input" v-model="form.type">
            <option value="">-- Sélectionner un type --</option>
            <option value="Vaccination">Vaccination</option>
            <option value="Traitement">Traitement</option>
            <option value="Diagnostic">Diagnostic</option>
            <option value="Observation">Observation</option>
          </select>
        </div>

        <!-- Date -->
        <div class="form-group">
          <label class="form-label">Date <span class="badge-required">*</span></label>
          <input class="form-input" type="date" v-model="form.date"/>
        </div>

        <!-- Description -->
        <div class="form-group">
          <label class="form-label">Description <span class="badge-required">*</span></label>
          <textarea class="form-input" v-model="form.description" rows="3" placeholder="Détails de l'événement..."></textarea>
        </div>

        <!-- Statut (pour certains types) -->
        <div class="form-group" v-if="form.type === 'Vaccination' || form.type === 'Traitement'">
          <label class="form-label">Statut</label>
          <select class="form-input" v-model="form.status">
            <option value="Programmé">Programmé</option>
            <option value="En attente">En attente</option>
            <option value="Complété">Complété</option>
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
            <span v-if="loading">Enregistrement...</span>
            <span v-else>Enregistrer</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { healthService, animalService } from '@/services/api'

const props = defineProps({
  open: Boolean,
  campaign: Object
})
const emit = defineEmits(['close', 'created'])

const loading = ref(false)
const error = ref(null)
const animals = ref([])

const form = ref({
  animalId: '',
  type: '',
  date: '',
  description: '',
  status: 'Terminé'
})

// Charger les animaux quand la campagne change
watch(
  () => props.campaign,
  async (newCampaign) => {
    if (newCampaign) {
      await loadAnimals()
      // Pré-remplir la date avec aujourd'hui
      form.value.date = new Date().toISOString().split('T')[0]
    }
  },
  { immediate: true }
)

async function loadAnimals() {
  try {
    if (props.campaign) {
      const res = await animalService.getAll({
        campaign: props.campaign._id || props.campaign.id,
        limit: 1000
      })
      animals.value = res.data.animals || res.data || []
    }
  } catch (err) {
    console.error('Erreur lors du chargement des animaux:', err)
    animals.value = []
  }
}

async function create() {
  error.value = null

  // Validation
  if (!form.value.animalId || !form.value.type || !form.value.date || !form.value.description) {
    error.value = 'Remplissez tous les champs obligatoires'
    return
  }

  loading.value = true

  try {
    const eventData = {
      animal: form.value.animalId,
      campaign: props.campaign._id || props.campaign.id,
      type: form.value.type,
      description: form.value.description,
      date: form.value.date,
      status: form.value.status || 'Complété'
    }

    const response = await healthService.create(eventData)
    emit('created', response.data)
    emit('close')

    // Reset form
    form.value = {
      animalId: '',
      type: '',
      date: '',
      description: '',
      status: 'Complété'
    }
  } catch (err) {
    error.value = err.response?.data?.error || 'Erreur lors de l\'enregistrement de l\'événement'
  } finally {
    loading.value = false
  }
}
</script>