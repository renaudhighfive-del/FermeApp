<template>
  <div class="modal-overlay" :class="{open:open}" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">
          <svg width="20" height="20" fill="none" stroke="var(--primary)" stroke-width="1.5" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Modifier campagne
        </div>
        <button class="modal-close" @click="$emit('close')">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div v-if="campaign">
        <!-- Nom de la campagne -->
        <div class="form-group">
          <label class="form-label">Nom de la campagne <span class="badge-required">*</span></label>
          <input class="form-input" v-model="form.name" placeholder="Ex: Campagne Avril 2026"/>
        </div>

        <!-- Type d'animal -->
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
            <label class="form-label">Effectif initial <span class="badge-required">*</span></label>
            <input class="form-input" type="number" v-model="form.initialAnimalCount" placeholder="Ex: 1000"/>
          </div>
        </div>

        <!-- Budget -->
        <div class="form-group">
          <label class="form-label">Budget (FCFA) <span class="badge-required">*</span></label>
          <input class="form-input" type="number" v-model="form.budget" placeholder="Ex: 5000000"/>
        </div>

        <div class="form-group">
          <label class="form-label">Statut</label>
          <select class="form-input" v-model="form.status">
            <option value="Préparation">Préparation</option>
            <option value="En cours">En cours</option>
            <option value="Terminée">Terminée</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Agents assignés</label>
          <div class="agents-selection" style="max-height: 120px; overflow-y: auto; border: 1px solid var(--border); padding: 10px; border-radius: 6px;">
            <div v-for="agent in gerantStore.agents" :key="agent._id || agent.id" class="agent-checkbox" style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <input type="checkbox" :id="'edit-agent-' + (agent._id || agent.id)" :value="agent._id || agent.id" v-model="form.agents">
              <label :for="'edit-agent-' + (agent._id || agent.id)" style="font-size: 13px; cursor: pointer;">{{ agent.name }}</label>
            </div>
          </div>
          <p class="text-soft" style="font-size: 11px; margin-top: 4px;">Sélectionnez les agents qui travailleront sur cette campagne.</p>
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
            <span v-if="loading">Modification...</span>
            <span v-else>Modifier</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useGerantStore } from '@/stores/gerant'

const props = defineProps({
  open: Boolean,
  campaign: Object
})
const emit = defineEmits(['close', 'updated'])

const gerantStore = useGerantStore()
const loading = ref(false)
const error = ref(null)

const form = ref({
  name: '',
  animalType: '',
  startDate: '',
  initialAnimalCount: '',
  budget: '',
  status: 'Préparation',
  agents: []
})

onMounted(async () => {
  await gerantStore.fetchAgents()
})

// Pré-remplir le formulaire quand la campagne change
watch(
  () => props.campaign,
  (newCampaign) => {
    if (newCampaign) {
      form.value = {
        name: newCampaign.name || '',
        animalType: newCampaign.animalType || '',
        startDate: newCampaign.startDate ? new Date(newCampaign.startDate).toISOString().split('T')[0] : '',
        initialAnimalCount: newCampaign.initialAnimalCount || '',
        budget: newCampaign.budget || '',
        status: newCampaign.status || 'Préparation',
        agents: newCampaign.agents ? newCampaign.agents.map(a => a._id || a.id || a) : []
      }
    }
  },
  { immediate: true }
)

async function update() {
  error.value = null

  // Validation
  if (!form.value.name || !form.value.animalType || !form.value.startDate || !form.value.initialAnimalCount || !form.value.budget) {
    error.value = 'Remplissez tous les champs obligatoires'
    return
  }

  loading.value = true

  try {
    const campaignData = {
      name: form.value.name,
      animalType: form.value.animalType,
      startDate: form.value.startDate,
      initialAnimalCount: parseInt(form.value.initialAnimalCount),
      budget: parseInt(form.value.budget),
      status: form.value.status,
      agents: form.value.agents
    }

    const updatedCampaign = await gerantStore.updateCampaign(props.campaign._id || props.campaign.id, campaignData)
    emit('updated', updatedCampaign)
    emit('close')
  } catch (err) {
    error.value = err.response?.data?.error || 'Erreur lors de la modification de la campagne'
  } finally {
    loading.value = false
  }
}
</script>