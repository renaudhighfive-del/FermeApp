<template>
<div>
  <div class="page-header">
    <div class="page-header-row">
      <div>
        <h1 class="page-title">Gestion Animaux</h1>
        <p class="page-subtitle" v-if="campaign">{{ campaign.name }} · {{ animals.length }} animaux</p>
        <p class="page-subtitle" v-else>Aucune campagne active</p>
      </div>
      <div class="page-actions"><button class="btn btn-primary" @click="showAddModal = true"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Ajouter animal</button></div>
    </div>
  </div>

  <div v-if="loading" class="card" style="text-align: center; padding: 40px;">
    <p class="text-soft">Chargement...</p>
  </div>

  <div v-else-if="!campaign" class="card" style="text-align: center; padding: 40px;">
    <p class="text-soft" style="font-size: 16px;">Aucune campagne active pour charger les animaux</p>
    <RouterLink to="/gerant/campaigns" class="btn btn-primary" style="margin-top: 20px;">Voir les campagnes</RouterLink>
  </div>

  <div v-else>
    <div class="filters-bar">
      <div class="search-wrap"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7A6652" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input class="search-input" placeholder="Rechercher par ID..."/></div>
      <select class="filter-select"><option>Tous les lots</option><option v-for="loc in uniqueLocations" :key="loc">{{ loc }}</option></select>
      <select class="filter-select"><option>Tous statuts santé</option><option>Sain</option><option>Malade</option><option>Suspect</option></select>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>ID Animal</th><th>Location</th><th>Poids</th><th>Santé</th><th>Vaccins</th><th>Actions</th></tr></thead>
          <tbody>
            <tr v-for="a in animals" :key="a._id || a.id">
              <td class="fw-600" style="color:var(--primary)">{{ a.idNumber || a._id }}</td>
              <td class="text-soft text-sm">{{ a.location || '-' }}</td>
              <td>{{ a.weight ? a.weight.toFixed(2) : '-' }} kg</td>
              <td><span class="badge" :class="getHealthClass(a.healthStatus)">{{ a.healthStatus || 'Inconnu' }}</span></td>
              <td>{{ a.vaccinations?.length || 0 }}/4</td>
              <td><div class="table-actions"><button class="btn btn-outline btn-sm" @click="viewAnimalFiche(a)">Voir fiche</button></div></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="animals.length === 0" class="text-center p-20">
        <p class="text-soft">Aucun animal pour cette campagne</p>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGerantStore } from '@/stores/gerant'
import { animalService } from '@/services/api'
import ModalAddAnimal from '@/components/common/ModalAddAnimal.vue'

const gerantStore = useGerantStore()
const campaign = computed(() => gerantStore.activeCampaigns[0] || null)
const animals = ref([])
const loading = ref(false)
const showAddModal = ref(false)

onMounted(async () => {
  await loadAnimals()
})

async function loadAnimals() {
  loading.value = true
  try {
    if (campaign.value) {
      const res = await animalService.getAll({ campaign: campaign.value._id || campaign.value.id, limit: 100 })
      animals.value = res.data.animals || res.data || []
    }
  } catch (err) {
    console.error('Erreur lors du chargement des animaux:', err)
    animals.value = []
  } finally {
    loading.value = false
  }
}

const uniqueLots = computed(() => {
  const lots = animals.value.map(a => a.location).filter(Boolean)
  return [...new Set(lots)]
})

const uniqueLocations = computed(() => uniqueLots.value)

function getHealthClass(status) {
  const classes = {
    'Sain': 'badge-sain',
    'Malade': 'badge-anomalie',
    'Suspect': 'badge-observation',
    'Décédé': 'badge-danger'
  }
  return classes[status] || 'badge-inactif'
}

function viewAnimalFiche(animal) {
  // Navigation vers la fiche animal
  window.location.href = `/gerant/animal/${animal._id || animal.id}`
}

async function handleAddModalClose() {
  showAddModal.value = false
  await loadAnimals()
}
</script>

<template>
<div>
  <div class="page-header">
    <div class="page-header-row">
      <div>
        <h1 class="page-title">Gestion Animaux</h1>
        <p class="page-subtitle" v-if="campaign">{{ campaign.name }} · {{ animals.length }} animaux</p>
        <p class="page-subtitle" v-else>Aucune campagne active</p>
      </div>
      <div class="page-actions"><button class="btn btn-primary" @click="showAddModal = true"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Ajouter animal</button></div>
    </div>
  </div>

  <div v-if="loading" class="card" style="text-align: center; padding: 40px;">
    <p class="text-soft">Chargement...</p>
  </div>

  <div v-else-if="!campaign" class="card" style="text-align: center; padding: 40px;">
    <p class="text-soft" style="font-size: 16px;">Aucune campagne active pour charger les animaux</p>
    <RouterLink to="/gerant/campaigns" class="btn btn-primary" style="margin-top: 20px;">Voir les campagnes</RouterLink>
  </div>

  <div v-else>
    <div class="filters-bar">
      <div class="search-wrap"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7A6652" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input class="search-input" placeholder="Rechercher par ID..."/></div>
      <select class="filter-select"><option>Tous les lots</option><option v-for="loc in uniqueLocations" :key="loc">{{ loc }}</option></select>
      <select class="filter-select"><option>Tous statuts santé</option><option>Sain</option><option>Malade</option><option>Suspect</option></select>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>ID Animal</th><th>Location</th><th>Poids</th><th>Santé</th><th>Vaccins</th><th>Actions</th></tr></thead>
          <tbody>
            <tr v-for="a in animals" :key="a._id || a.id">
              <td class="fw-600" style="color:var(--primary)">{{ a.idNumber || a._id }}</td>
              <td class="text-soft text-sm">{{ a.location || '-' }}</td>
              <td>{{ a.weight ? a.weight.toFixed(2) : '-' }} kg</td>
              <td><span class="badge" :class="getHealthClass(a.healthStatus)">{{ a.healthStatus || 'Inconnu' }}</span></td>
              <td>{{ a.vaccinations?.length || 0 }}/4</td>
              <td><div class="table-actions"><button class="btn btn-outline btn-sm" @click="viewAnimalFiche(a)">Voir fiche</button></div></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="animals.length === 0" class="text-center p-20">
        <p class="text-soft">Aucun animal pour cette campagne</p>
      </div>
    </div>
  </div>

  <ModalAddAnimal :open="showAddModal" :campaign="campaign" @close="handleAddModalClose"/>
</div>

