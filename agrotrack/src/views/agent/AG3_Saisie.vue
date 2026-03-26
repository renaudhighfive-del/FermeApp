<template>
<div>
  <div class="page-header">
    <h1 class="page-title">Nouvelle saisie</h1>
    <p class="page-subtitle">{{ selectedCampaignName }} · {{ new Date().toLocaleDateString('fr-FR') }}</p>
  </div>
 
  <!-- Étape 1 : Campagne -->
  <div class="card mb-gap">
    <div class="card-title">
      <svg width="16" height="16" fill="none" stroke="var(--accent)" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
      Étape 1 — Sélection campagne
    </div>
    <select class="form-select w-full" v-model="form.campaignId" @change="onCampaignChange">
      <option value="" disabled>Sélectionner une campagne</option>
      <option v-for="c in campaigns" :key="c._id" :value="c._id">{{ c.name }}</option>
    </select>
  </div>
 
  <!-- Étape 2 : Type de saisie -->
  <div class="card mb-gap">
    <div class="card-title">Étape 2 — Type de saisie</div>
    <div class="radio-grid">
      <div class="radio-opt" :class="{sel:saisieType==='pesee'}" @click="saisieType='pesee'">
        <svg width="22" height="22" fill="none" :stroke="saisieType==='pesee'?'#fff':'var(--soft)'" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 6v6h4"/></svg>
        Pesée
      </div>
      <div class="radio-opt" :class="{sel:saisieType==='alim'}" @click="saisieType='alim'">
        <svg width="22" height="22" fill="none" :stroke="saisieType==='alim'?'#fff':'var(--soft)'" stroke-width="1.5" viewBox="0 0 24 24"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
        Alimentation
      </div>
      <div class="radio-opt" :class="{sel:saisieType==='sante'}" @click="saisieType='sante'">
        <svg width="22" height="22" fill="none" :stroke="saisieType==='sante'?'#fff':'var(--soft)'" stroke-width="1.5" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        Santé
      </div>
      <div class="radio-opt" :class="{sel:saisieType==='mort'}" @click="saisieType='mort'">
        <svg width="22" height="22" fill="none" :stroke="saisieType==='mort'?'#fff':'var(--soft)'" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        Mortalité
      </div>
      <div class="radio-opt" :class="{sel:saisieType==='vacc'}" @click="saisieType='vacc'">
        <svg width="22" height="22" fill="none" :stroke="saisieType==='vacc'?'#fff':'var(--soft)'" stroke-width="1.5" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        Vaccination
      </div>
    </div>
  </div>
 
  <!-- Formulaire dynamique -->
  <div class="card mb-gap">
    <div class="card-title">Étape 3 — Saisie des données</div>
 
    <!-- Pesée -->
    <div v-if="saisieType==='pesee'">
      <div class="form-group">
        <label class="form-label">Animal</label>
        <select class="form-select w-full" v-model="form.animalId">
          <option value="" disabled>Sélectionner un animal</option>
          <option v-for="a in animals" :key="a._id" :value="a._id">{{ a.idNumber }} ({{ a.breed || 'Sans race' }})</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Poids (grammes)</label>
        <input class="form-input" type="number" v-model="form.weight" placeholder="Ex: 1350"/>
      </div>
      <div class="form-group">
        <label class="form-label">Date et heure</label>
        <input class="form-input" :value="now" readonly style="background:var(--bg);color:var(--soft)"/>
      </div>
      <div class="form-group">
        <label class="form-label">Observation</label>
        <textarea class="form-input form-textarea" v-model="form.notes" placeholder="Comportement, anomalie visible..."></textarea>
      </div>
    </div>
 
    <!-- Alimentation -->
    <div v-if="saisieType==='alim'">
      <div class="form-group">
        <label class="form-label">Animal (optionnel)</label>
        <select class="form-select w-full" v-model="form.animalId">
          <option value="">Sélectionner un animal (Lot entier)</option>
          <option v-for="a in animals" :key="a._id" :value="a._id">{{ a.idNumber }}</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Type d'aliment</label>
        <select class="form-select w-full" v-model="form.productId">
          <option value="" disabled>Sélectionner un aliment</option>
          <option v-for="p in products" :key="p._id" :value="p._id">{{ p.name }} (Stock: {{ p.quantity }} {{ p.unit }})</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Quantité (kg)</label><input class="form-input" type="number" v-model="form.quantity" placeholder="Ex: 15"/></div>
      <div class="form-group"><label class="form-label">Observation</label><textarea class="form-input form-textarea" v-model="form.notes" placeholder="Observations sur la distribution..."></textarea></div>
    </div>
 
    <!-- Mortalité -->
    <div v-if="saisieType==='mort'">
      <div class="form-group">
        <label class="form-label">Animal</label>
        <select class="form-select w-full" v-model="form.animalId">
          <option value="" disabled>Sélectionner un animal</option>
          <option v-for="a in animals" :key="a._id" :value="a._id">{{ a.idNumber }}</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Cause présumée</label><select class="form-select w-full" v-model="form.cause"><option>Cause inconnue</option><option>Maladie</option><option>Accident</option><option>Prédateur</option><option>Stress thermique</option></select></div>
      <div class="form-group"><label class="form-label">Observation</label><textarea class="form-input form-textarea" v-model="form.notes" placeholder="Détaillez les circonstances..."></textarea></div>
    </div>
 
    <!-- Vaccination -->
    <div v-if="saisieType==='vacc'">
      <div class="form-group">
        <label class="form-label">Animal</label>
        <select class="form-select w-full" v-model="form.animalId">
          <option value="" disabled>Sélectionner un animal</option>
          <option v-for="a in animals" :key="a._id" :value="a._id">{{ a.idNumber }}</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Vaccin / Description</label><input class="form-input" v-model="form.description" placeholder="Ex: Newcastle"/></div>
      <div class="form-group"><label class="form-label">Prochain rappel (optionnel)</label><input class="form-input" type="date" v-model="form.nextScheduledDate"/></div>
      <div class="form-group"><label class="form-label">Notes</label><textarea class="form-input form-textarea" v-model="form.notes" placeholder="Observations sur la vaccination..."></textarea></div>
    </div>
 
    <!-- Santé -->
    <div v-if="saisieType==='sante'">
      <div class="form-group">
        <label class="form-label">Animal</label>
        <select class="form-select w-full" v-model="form.animalId">
          <option value="" disabled>Sélectionner un animal</option>
          <option v-for="a in animals" :key="a._id" :value="a._id">{{ a.idNumber }}</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Type d'observation</label><select class="form-select w-full" v-model="form.type"><option>Observation générale</option><option>Symptôme maladie</option><option>Blessure</option><option>Anomalie comportementale</option></select></div>
      <div class="form-group"><label class="form-label">Description</label><textarea class="form-input form-textarea" v-model="form.description" placeholder="Décrivez les symptômes observés..."></textarea></div>
    </div>
  </div>
 
  <!-- Indicateur connexion + Bouton submit -->
  <div class="flex items-center justify-between mb-gap">
    <div class="status-indicator">
      <div class="status-dot status-online"></div>
      <span>En ligne · Synchronisé</span>
    </div>
  </div>
 
  <button class="btn btn-primary btn-full btn-lg" @click="submit" :disabled="loading" style="height:52px;font-size:15px;margin-bottom:var(--gap)">
    <span v-if="loading">Chargement...</span>
    <template v-else>
      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
      Enregistrer la saisie
    </template>
  </button>
</div>
</template>
 
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUiStore } from '../../stores/ui'
import { campaignService, animalService, productService, healthService, eventService } from '../../services/api'
 
const ui = useUiStore()
const saisieType = ref('pesee')
const loading = ref(false)
const campaigns = ref([])
const animals = ref([])
const products = ref([])
 
const form = ref({
  campaignId: '',
  animalId: '',
  productId: '',
  weight: '',
  quantity: '',
  notes: '',
  cause: 'Cause inconnue',
  description: '',
  nextScheduledDate: '',
  type: 'Observation générale'
})
 
const now = computed(() => {
  return new Date().toLocaleDateString('fr-FR') + ' · ' + new Date().toLocaleTimeString('fr-FR', {hour:'2-digit',minute:'2-digit'})
})
 
const selectedCampaignName = computed(() => {
  const c = campaigns.value.find(c => c._id === form.value.campaignId)
  return c ? c.name : 'Sélectionnez une campagne'
})
 
const fetchData = async () => {
  try {
    const campaignsRes = await campaignService.getAll({ status: 'En cours' })
    campaigns.value = campaignsRes.data.campaigns
   
    const productsRes = await productService.getAll()
    products.value = productsRes.data.products
   
    if (campaigns.value.length > 0) {
      form.value.campaignId = campaigns.value[0]._id
      onCampaignChange()
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
 
const onCampaignChange = async () => {
  if (!form.value.campaignId) return
  try {
    const animalsRes = await animalService.getAll({ campaign: form.value.campaignId })
    animals.value = animalsRes.data.animals
  } catch (error) {
    console.error('Error fetching animals:', error)
  }
}
 
async function submit() {
  if (!form.value.campaignId) {
    ui.warning('Veuillez sélectionner une campagne')
    return
  }

  loading.value = true
  try {
    if (saisieType.value === 'pesee') {
      if (!form.value.animalId || !form.value.weight) throw new Error('Champs manquants')
      await animalService.update(form.value.animalId, {
        weight: form.value.weight,
        notes: form.value.notes
      })
    } else if (saisieType.value === 'mort') {
      if (!form.value.animalId) throw new Error('Veuillez sélectionner un animal')
      await animalService.update(form.value.animalId, {
        healthStatus: 'Décédé',
        notes: `Cause: ${form.value.cause}. ${form.value.notes}`
      })
    } else if (saisieType.value === 'vacc') {
      if (!form.value.animalId || !form.value.description) throw new Error('Champs manquants')
      
      // Créer l'enregistrement de santé
      await healthService.create({
        animal: form.value.animalId,
        campaign: form.value.campaignId,
        type: 'Vaccination',
        description: form.value.description,
        nextScheduledDate: form.value.nextScheduledDate,
        notes: form.value.notes,
        status: 'Complété'
      })
      
      // Mettre à jour l'animal avec l'historique de vaccination
      const currentAnimal = animals.value.find(a => a._id === form.value.animalId)
      const vaccinations = currentAnimal?.vaccinations || []
      vaccinations.push({
        vaccine: form.value.description,
        date: new Date(),
        nextDue: form.value.nextScheduledDate
      })
      
      await animalService.update(form.value.animalId, {
        vaccinations: vaccinations
      })
    } else if (saisieType.value === 'sante') {
      if (!form.value.animalId || !form.value.description) throw new Error('Champs manquants')
      
      // Map UI type to backend enum
      let backendType = 'Observation'
      if (form.value.type === 'Symptôme maladie') backendType = 'Diagnostic'
      else if (form.value.type === 'Blessure') backendType = 'Traitement'

      await healthService.create({
        animal: form.value.animalId,
        campaign: form.value.campaignId,
        type: backendType,
        description: form.value.description,
        notes: form.value.notes,
        status: 'Complété'
      })

      // Update the animal's health status if it's a symptom or injury
      if (form.value.type !== 'Observation générale') {
        const currentAnimal = animals.value.find(a => a._id === form.value.animalId)
        const treatmentHistory = currentAnimal?.treatmentHistory || []
        treatmentHistory.push({
          treatment: 'Observation enregistrée',
          date: new Date(),
          reason: form.value.description,
          outcome: 'En cours'
        })
        
        await animalService.update(form.value.animalId, {
          healthStatus: 'Malade',
          treatmentHistory: treatmentHistory
        })
      }
    } else if (saisieType.value === 'alim') {
      if (!form.value.productId || !form.value.quantity) throw new Error('Champs manquants')
      
      const product = products.value.find(p => p._id === form.value.productId)
      const desc = `Distribution de ${form.value.quantity}kg de ${product?.name || 'aliment'}. ${form.value.notes || ''}`

      await eventService.create({
        campaign: form.value.campaignId,
        animal: form.value.animalId || null,
        type: 'feeding',
        quantity: form.value.quantity,
        description: desc,
        status: 'done'
      })
      
      // Mettre à jour le stock du produit
      const productToUpdate = products.value.find(p => p._id === form.value.productId)
      if (productToUpdate) {
        await productService.update(productToUpdate._id, {
          quantity: productToUpdate.quantity - Number(form.value.quantity)
        })
      }
    }

    ui.success('Saisie enregistrée avec succès !')
    
    // Reset some fields
    form.value.weight = ''
    form.value.notes = ''
    form.value.description = ''
    form.value.quantity = ''
    form.value.productId = ''
    
  } catch (error) {
    console.error('Error in submit:', error)
    const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Erreur inconnue'
    ui.error('Erreur: ' + errorMessage)
  } finally {
    loading.value = false
  }
}
 
onMounted(fetchData)
</script>