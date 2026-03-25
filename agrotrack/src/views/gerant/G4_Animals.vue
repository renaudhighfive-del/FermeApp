<template>
  <div>
    <div class="page-header">
      <div class="page-header-row">
        <div>
          <h1 class="page-title">Gestion Animaux</h1>
          <p class="page-subtitle" v-if="campaign">
            {{ campaign.name }} · {{ animals.length }} animaux
          </p>
          <p class="page-subtitle" v-else>Aucune campagne active</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" @click="showAddModal = true">
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              viewBox="0 0 24 24"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" /></svg
            >Ajouter animal
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="card" style="text-align: center; padding: 40px">
      <p class="text-soft">Chargement...</p>
    </div>

    <div
      v-else-if="!campaign"
      class="card"
      style="text-align: center; padding: 40px"
    >
      <p class="text-soft" style="font-size: 16px">
        Aucune campagne active pour charger les animaux
      </p>
      <RouterLink
        to="/gerant/campaigns"
        class="btn btn-primary"
        style="margin-top: 20px"
        >Voir les campagnes</RouterLink
      >
    </div>

    <div v-else>
      <div class="filters-bar">
        <div class="search-wrap">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7A6652"
            stroke-width="1.5"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" /></svg
          ><input class="search-input" placeholder="Rechercher par ID..." v-model="searchQuery" />
        </div>
        
        <!-- Filtre Campagne -->
        <select v-if="activeCampaigns.length > 1" class="filter-select" v-model="selectedCampaignId">
          <option v-for="c in activeCampaigns" :key="c._id || c.id" :value="c._id || c.id">
            {{ c.name }}
          </option>
        </select>

        <select class="filter-select" v-model="selectedLocation">
          <option value="">Tous les lots</option>
          <option v-for="loc in uniqueLocations" :key="loc" :value="loc">{{ loc }}</option>
        </select>
        <select class="filter-select" v-model="selectedHealth">
          <option value="">Tous statuts santé</option>
          <option value="Sain">Sain</option>
          <option value="Malade">Malade</option>
          <option value="Suspect">Suspect</option>
        </select>
      </div>
      <div class="card">
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>ID Animal</th>
                <th>Lot</th>
                <th>Poids</th>
                <th>Santé</th>
                <th>Vaccins</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="a in filteredAnimals" :key="a._id || a.id">
                <td class="fw-600" style="color: var(--primary)">
                  {{ a.idNumber || a._id }}
                </td>
                <td class="text-soft text-sm">{{ a.location || "-" }}</td>
                <td>{{ a.weight ? a.weight.toFixed(2) : "-" }} kg</td>
                <td>
                  <span class="badge" :class="getHealthClass(a.healthStatus)">{{
                    a.healthStatus || "Inconnu"
                  }}</span>
                </td>
                <td>{{ a.vaccinations?.length || 0 }}/4</td>
                <td>
                  <div class="table-actions">
                    <button
                      class="btn btn-outline btn-sm"
                      @click="viewAnimalFiche(a)"
                    >
                      Voir fiche
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="animals.length === 0" class="text-center p-20">
          <p class="text-soft">Aucun animal pour cette campagne</p>
        </div>
      </div>
    </div>

    <ModalAddAnimal
      v-if="showAddModal"
      :open="showAddModal"
      :campaign="campaign"
      @close="handleAddModalClose"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useGerantStore } from "@/stores/gerant";
import { animalService } from "@/services/api";
import { getHealthClass } from "@/utils/formatters";
import ModalAddAnimal from "@/components/common/ModalAddAnimal.vue";

const router = useRouter();
const gerantStore = useGerantStore();

const activeCampaigns = computed(() => gerantStore.activeCampaigns);
const selectedCampaignId = ref("");

const campaign = computed(() => {
  if (selectedCampaignId.value) {
    return (
      activeCampaigns.value.find(
        (c) => (c._id || c.id) === selectedCampaignId.value
      ) ||
      activeCampaigns.value[0] ||
      null
    );
  }
  return activeCampaigns.value[0] || null;
});

const animals = ref([]);
const loading = ref(false);
const showAddModal = ref(false);

const searchQuery = ref("");
const selectedLocation = ref("");
const selectedHealth = ref("");

onMounted(async () => {
  await loadData();
});

async function loadData() {
  await gerantStore.fetchGerantFarms();
  await gerantStore.fetchGerantCampaigns();

  if (activeCampaigns.value.length > 0 && !selectedCampaignId.value) {
    selectedCampaignId.value =
      activeCampaigns.value[0]._id || activeCampaigns.value[0].id;
  }

  await loadAnimals();
}

watch(selectedCampaignId, async () => {
  await loadAnimals();
});

async function loadAnimals() {
  loading.value = true;
  try {
    if (campaign.value) {
      const res = await animalService.getAll({
        campaign: campaign.value._id || campaign.value.id,
        limit: 100,
      });
      animals.value = res.data.animals || res.data || [];
    }
  } catch (err) {
    console.error("Erreur lors du chargement des animaux:", err);
    animals.value = [];
  } finally {
    loading.value = false;
  }
}

const filteredAnimals = computed(() => {
  return animals.value.filter((a) => {
    const id = String(a.idNumber || a._id || "").toLowerCase();
    const query = searchQuery.value.toLowerCase();
    const matchesSearch = searchQuery.value ? id.includes(query) : true;
    
    const matchesLocation = selectedLocation.value && selectedLocation.value !== "Tous les lots" ? a.location === selectedLocation.value : true;
    const matchesHealth = selectedHealth.value && selectedHealth.value !== "Tous statuts santé" ? a.healthStatus === selectedHealth.value : true;
    return matchesSearch && matchesLocation && matchesHealth;
  });
});

const uniqueLots = computed(() => {
  const lots = animals.value.map((a) => a.location).filter(Boolean);
  return [...new Set(lots)];
});

const uniqueLocations = computed(() => uniqueLots.value);


function viewAnimalFiche(animal) {
  router.push(`/gerant/animal/${animal._id || animal.id}`);
}

const handleAddModalClose = async () => {
  showAddModal.value = false;
  await loadAnimals();
}

</script>
