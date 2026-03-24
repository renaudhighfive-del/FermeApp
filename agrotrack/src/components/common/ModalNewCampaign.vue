<script setup>
import { ref, computed, watch } from 'vue'
import { useGerantStore } from '@/stores/gerant'

const props = defineProps({ open: Boolean })
const emit = defineEmits(['close', 'created'])

const gerantStore = useGerantStore()
const loading = ref(false)
const error = ref(null)
const selectedFarmError = ref(false)

const form = ref({
  farm: '',
  name: '',
  animalType: '',
  startDate: '',
  initialAnimalCount: '',
  budget: ''
})

const noFarmsAssigned = computed(() => gerantStore.farms.length === 0)

function selectFarm() {
  selectedFarmError.value = false
}

async function create() {
  error.value = null
  selectedFarmError.value = false

  // Validation
  if (!form.value.farm) {
    selectedFarmError.value = true
    return
  }
  if (!form.value.name || !form.value.animalType || !form.value.startDate || !form.value.initialAnimalCount || !form.value.budget) {
    error.value = 'Remplissez tous les champs obligatoires'
    return
  }

  loading.value = true

  try {
    const campaignData = {
      farm: form.value.farm,
      name: form.value.name,
      animalType: form.value.animalType,
      startDate: form.value.startDate,
      initialAnimalCount: parseInt(form.value.initialAnimalCount),
      budget: parseInt(form.value.budget)
    }

    await gerantStore.createCampaign(campaignData)
    emit('created', campaignData)
    emit('close')

    // Reset form
    form.value = {
      farm: '',
      name: '',
      animalType: '',
      startDate: '',
      initialAnimalCount: '',
      budget: ''
    }
  } catch (err) {
    error.value = err.response?.data?.error || 'Erreur lors de la création de la campagne'
  } finally {
    loading.value = false
  }
}

// Charger les fermes quand la modal s'ouvre
watch(
  () => props.open,
  async (newVal) => {
    if (newVal && gerantStore.farms.length === 0) {
      await gerantStore.fetchGerantFarms()
    }
  }
)
</script>
<template>
  <div class="modal-overlay" :class="{open:open}" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">
          <svg width="20" height="20" fill="none" stroke="var(--primary)" stroke-width="1.5" viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
          Nouvelle campagne
        </div>
        <button class="modal-close" @click="$emit('close')">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <!-- Alerte si pas de ferme assignée -->
      <div v-if="noFarmsAssigned" class="alert-card alert-warning">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <div class="alert-content">
          <div class="alert-title">Aucune ferme assignée</div>
          <div class="alert-desc">Veuillez contacter votre administrateur pour être assigné à une ferme avant de créer une campagne.</div>
        </div>
      </div>

      <div v-if="!noFarmsAssigned">
        <!-- Sélection de la ferme -->
        <div class="form-group">
          <label class="form-label">Ferme <span class="badge-required">*</span></label>
          <select class="form-input" v-model="form.farm" @change="selectFarm">
            <option value="">-- Sélectionner une ferme --</option>
            <option v-for="farm in gerantStore.farms" :key="farm._id || farm.id" :value="farm._id || farm.id">
              {{ farm.name }}
            </option>
          </select>
          <p v-if="selectedFarmError" class="form-error">Veuillez sélectionner une ferme</p>
        </div>

        <!-- Nom de la campagne -->
        <div class="form-group">
          <label class="form-label">Nom de la campagne <span class="badge-required">*</span></label>
          <input class="form-input" v-model="form.name" placeholder="Ex: Campagne Avril 2026"/>
        </div>

        <!-- Département -->
        <div class="form-group">
          <label class="form-label">Type d'animal <span class="badge-required">*</span></label>
          <div class="dept-btns">
            <div class="dept-btn" :class="{sel:form.animalType==='Volaille',vol:true}" @click="form.animalType='Volaille'">
              <svg width="24" height="24" fill="none" :stroke="form.animalType==='Volaille'?'var(--vol)':'var(--soft)'" stroke-width="1.5" viewBox="0 0 24 24"><path d="M5 3h14l-7 8-7-8zM5 3l7 18 7-18"/></svg>
              Volaille
            </div>
            <div class="dept-btn" :class="{sel:form.animalType==='Bétail',bet:true}" @click="form.animalType='Bétail'">
              <svg width="24" height="24" fill="none" :stroke="form.animalType==='Bétail'?'var(--bet)':'var(--soft)'" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="9" r="5"/><path d="M5 20a7 7 0 0 1 14 0"/><path d="M3 9h2m14 0h2"/></svg>
              Bétail
            </div>
            <div class="dept-btn" :class="{sel:form.animalType==='Pisciculture',pis:true}" @click="form.animalType='Pisciculture'">
              <svg width="24" height="24" fill="none" :stroke="form.animalType==='Pisciculture'?'var(--pis)':'var(--soft)'" stroke-width="1.5" viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
              Pisciculture
            </div>
          </div>
        </div>

        <!-- Date et objectif -->
        <div class="grid-2" style="gap:12px">
          <div class="form-group">
            <label class="form-label">Date de début <span class="badge-required">*</span></label>
            <input class="form-input" type="date" v-model="form.startDate"/>
          </div>
          <div class="form-group">
            <label class="form-label">Objectif (animaux) <span class="badge-required">*</span></label>
            <input class="form-input" type="number" v-model="form.initialAnimalCount" placeholder="Ex: 500"/>
          </div>
        </div>

        <!-- Budget -->
        <div class="form-group">
          <label class="form-label">Budget initial (FCFA) <span class="badge-required">*</span></label>
          <input class="form-input" type="number" v-model="form.budget" placeholder="Ex: 850000"/>
        </div>

        <div v-if="error" class="alert-card alert-danger">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          <div class="alert-content">
            <div class="alert-desc">{{ error }}</div>
          </div>
        </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-outline" @click="$emit('close')">Annuler</button>
        <button v-if="!noFarmsAssigned" class="btn btn-primary" @click="create" :disabled="loading">
          <span v-if="loading">Création en cours...</span>
          <span v-else>Créer la campagne</span>
        </button>
      </div>
  </div>
</template>



<style scoped>
.dept-btns { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
.dept-btn {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 14px 10px; border: 1.5px solid var(--border);
  border-radius: 10px; cursor: pointer; font-size: 12px; font-weight: 600;
  color: var(--soft); transition: all 0.15s; text-align: center;
}
.dept-btn:hover { border-color: var(--soft); }
.dept-btn.vol.sel { background: #FEF0E7; border-color: var(--vol); color: var(--vol); }
.dept-btn.bet.sel { background: #F3EBE3; border-color: var(--bet); color: var(--bet); }
.dept-btn.pis.sel { background: #E3EFF5; border-color: var(--pis); color: var(--pis); }

.badge-required {
  color: var(--danger);
  font-weight: 600;
  margin-left: 2px;
}

.form-error {
  color: var(--danger);
  font-size: 12px;
  margin-top: 4px;
  display: block;
}
</style>

