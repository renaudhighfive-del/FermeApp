import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAuthStore } from "./auth";
import {
  campaignService,
  farmService,
} from "@/services/api";

export const useGerantStore = defineStore("gerant", () => {
  // ── State ────────────────────────────────────────────────────
  const farms = ref([]); // Fermes assignées au gérant
  const campaigns = ref([]); // Campagnes du gérant
  const agents = ref([]); // Tous les agents du système
  const loading = ref(false);
  const error = ref(null);

  // ── Getters ──────────────────────────────────────────────────
  const activeCampaigns = computed(() =>
    campaigns.value.filter((c) => c.status === "En cours")
  );

  const completedCampaigns = computed(() =>
    campaigns.value.filter((c) => c.status === "Terminée")
  );

  const preparationCampaigns = computed(() =>
    campaigns.value.filter((c) => c.status === "Préparation")
  );

  // ── Actions ──────────────────────────────────────────────────
  async function fetchGerantFarms() {
    loading.value = true;
    error.value = null;
    try {
      const authStore = useAuthStore();
      const userId = authStore.user?._id || authStore.user?.id;
      
      const response = await farmService.getAll({ limit: 100 });
      const allFarms = response.data.farms || response.data;
      
      // Filtrer les fermes où l'utilisateur est manager ou propriétaire
      farms.value = allFarms.filter((farm) => {
        const userIdStr = String(userId);
        const isManager = farm.managers?.some((m) => {
          const mId = String(m._id || m.id || m);
          return mId === userIdStr;
        });
        const ownerId = String(farm.owner?._id || farm.owner?.id || farm.owner);
        const isOwner = ownerId === userIdStr;
        return isManager || isOwner;
      });
    } catch (err) {
      error.value = "Erreur lors du chargement des fermes";
      console.error(err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchAgents() {
    try {
      const { userService } = await import("@/services/api");
      const response = await userService.getAll({ role: "agent", limit: 100 });
      agents.value = response.data.users || response.data;
    } catch (err) {
      console.error("Erreur lors du chargement des agents:", err);
    }
  }

  async function fetchGerantCampaigns() {
    loading.value = true;
    error.value = null;
    try {
      const authStore = useAuthStore();
      const userId = authStore.user?._id || authStore.user?.id;
      
      const allCampaigns = [];
      
      // 1. Récupérer les campagnes par ferme assignée
      const farmsIds = farms.value.map((f) => f._id || f.id);
      for (const farmId of farmsIds) {
        try {
          const response = await campaignService.getAll({ farm: farmId, limit: 100 });
          const campaignsList = response.data.campaigns || response.data;
          if (Array.isArray(campaignsList)) {
            allCampaigns.push(...campaignsList);
          }
        } catch (farmErr) {
          console.error(`Erreur pour la ferme ${farmId}:`, farmErr);
        }
      }

      // 2. Récupérer les campagnes où l'utilisateur est manager (au cas où il n'ait pas accès à la ferme)
      try {
        const response = await campaignService.getAll({ limit: 100 });
        const allServerCampaigns = response.data.campaigns || response.data;
        if (Array.isArray(allServerCampaigns)) {
          const userIdStr = String(userId);
          allServerCampaigns.forEach(campaign => {
            // Ajouter si l'utilisateur est manager de la campagne et pas déjà dans la liste
            const isManager = campaign.managers?.some(m => {
              const mId = String(m._id || m.id || m);
              return mId === userIdStr;
            });
            const alreadyAdded = allCampaigns.find(c => String(c._id || c.id) === String(campaign._id || campaign.id));
            if (isManager && !alreadyAdded) {
              allCampaigns.push(campaign);
            }
          });
        }
      } catch (err) {
        console.error('Erreur lors du chargement des autres campagnes:', err);
      }

      campaigns.value = allCampaigns;
    } catch (err) {
      error.value = "Erreur lors du chargement des campagnes";
      console.error(err);
    } finally {
      loading.value = false;
    }
  }

  async function createCampaign(campaignData) {
    loading.value = true;
    error.value = null;
    try {
      const response = await campaignService.create(campaignData);
      campaigns.value.push(response.data);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error || "Erreur lors de la création de la campagne";
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateCampaign(id, campaignData) {
    loading.value = true;
    error.value = null;
    try {
      const response = await campaignService.update(id, campaignData);
      const index = campaigns.value.findIndex((c) => (c._id || c.id) === id);
      if (index !== -1) {
        campaigns.value[index] = response.data;
      }
      return response.data;
    } catch (err) {
      error.value = "Erreur lors de la mise à jour de la campagne";
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteCampaign(id) {
    loading.value = true;
    error.value = null;
    try {
      await campaignService.delete(id);
      campaigns.value = campaigns.value.filter((c) => (c._id || c.id) !== id);
    } catch (err) {
      error.value = "Erreur lors de la suppression de la campagne";
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function getCampaignStats(id) {
    try {
      const response = await campaignService.getStats(id);
      return response.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  return {
    farms,
    campaigns,
    loading,
    error,
    activeCampaigns,
    agents,
    completedCampaigns,
    preparationCampaigns,
    fetchGerantFarms,
    fetchGerantCampaigns,
    fetchAgents,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    getCampaignStats,
  };
});
