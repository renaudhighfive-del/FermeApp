import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  campaignService,
  farmService,
  animalService,
  productService,
  transactionService,
  healthService,
  saleService,
  reportService,
  settingsService,
  eventService,
} from "@/services/api";

export const useAdminStore = defineStore("admin", () => {
  // State
  const campaigns = ref([]);
  const farms = ref([]);
  const animals = ref([]);
  const products = ref([]);
  const transactions = ref([]);
  const alerts = ref([]);
  const sales = ref([]);
  const reports = ref([]);
  const events = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const activeCampaigns = computed(() =>
    campaigns.value.filter((c) => c.status === "En cours")
  );

  const totalAnimals = computed(() => animals.value.length);

  const lowStockProducts = computed(() =>
    products.value.filter((p) => p.quantity <= p.reorderLevel)
  );

  const totalRevenue = computed(() =>
    transactions.value
      .filter((t) => t.type === "Revenu")
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const totalExpenses = computed(() =>
    transactions.value
      .filter((t) => t.type === "Dépense")
      .reduce((sum, t) => sum + t.amount, 0)
  );

  // Actions
  const fetchCampaigns = async (filter = {}) => {
    loading.value = true;
    try {
      const response = await campaignService.getAll(filter);
      campaigns.value = response.data.campaigns;
      return response.data;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const fetchCampaignById = async (id) => {
    try {
      return await campaignService.getById(id);
    } catch (err) {
      error.value = err.message;
    }
  };

  const createCampaign = async (data) => {
    try {
      const response = await campaignService.create(data);
      campaigns.value.push(response.data);
      return response.data;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  const updateCampaign = async (id, data) => {
    try {
      const response = await campaignService.update(id, data);
      const index = campaigns.value.findIndex((c) => c._id === id);
      if (index !== -1) campaigns.value[index] = response.data;
      return response.data;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  const deleteCampaign = async (id) => {
    try {
      await campaignService.delete(id);
      campaigns.value = campaigns.value.filter((c) => c._id !== id);
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  // Farms
  const fetchFarms = async (filter = {}) => {
    loading.value = true;
    try {
      const response = await farmService.getAll(filter);
      farms.value = response.data.farms;
      return response.data;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const createFarm = async (data) => {
    try {
      const response = await farmService.create(data);
      farms.value.push(response.data);
      return response.data;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  const updateFarm = async (id, data) => {
    try {
      const response = await farmService.update(id, data);
      const index = farms.value.findIndex((f) => f._id === id);
      if (index !== -1) farms.value[index] = response.data;
      return response.data;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  const deleteFarm = async (id) => {
    try {
      await farmService.delete(id);
      farms.value = farms.value.filter((f) => f._id !== id);
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  // Animals
  const fetchAnimals = async (filter = {}) => {
    loading.value = true;
    try {
      // Fetch all animals with a high limit
      const response = await animalService.getAll({ ...filter, limit: 1000 });
      animals.value = response.data.animals;
      return response.data;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const addAnimal = async (data) => {
    try {
      const response = await animalService.create(data);
      animals.value.push(response.data);
      return response.data;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  const updateAnimal = async (id, data) => {
    try {
      const response = await animalService.update(id, data);
      const index = animals.value.findIndex((a) => a._id === id);
      if (index !== -1) animals.value[index] = response.data;
      return response.data;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  const deleteAnimal = async (id) => {
    try {
      await animalService.delete(id);
      animals.value = animals.value.filter((a) => a._id !== id);
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  // Products
  const fetchProducts = async (filter = {}) => {
    loading.value = true;
    try {
      const response = await productService.getAll(filter);
      products.value = response.data.products;
      return response.data;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const addProduct = async (data) => {
    try {
      const response = await productService.create(data);
      products.value.push(response.data);
      return response.data;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  const updateProduct = async (id, data) => {
    try {
      const response = await productService.update(id, data);
      const index = products.value.findIndex((p) => p._id === id);
      if (index !== -1) products.value[index] = response.data;
      return response.data;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productService.delete(id);
      products.value = products.value.filter((p) => p._id !== id);
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  // Transactions
  const fetchTransactions = async (filter = {}) => {
    loading.value = true;
    try {
      const response = await transactionService.getAll(filter);
      transactions.value = response.data.transactions;
      return response.data;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const addTransaction = async (data) => {
    try {
      const response = await transactionService.create(data);
      transactions.value.push(response.data);
      return response.data;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  // Alerts
  const fetchAlerts = async (filter = {}) => {
    loading.value = true;
    try {
      const response = await healthService.getAlerts(filter);
      alerts.value = response.data.alerts;
      return response.data;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const resolveAlert = async (id) => {
    try {
      // Update the health record or mark as resolved
      await healthService.update(id, { status: "Complété" });
      alerts.value = alerts.value.filter((a) => a._id !== id);
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  // Sales
  const fetchSales = async (filter = {}) => {
    loading.value = true;
    try {
      const response = await saleService.getAll(filter);
      sales.value = response.data.sales;
      return response.data;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const addSale = async (data) => {
    try {
      const response = await saleService.create(data);
      sales.value.push(response.data);
      return response.data;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  // Reports
  const fetchReports = async (filter = {}) => {
    try {
      const response = await reportService.getAll(filter);
      reports.value = response.data.reports;
      return response.data;
    } catch (err) {
      error.value = err.message;
    }
  };

  const generateReport = async (data) => {
    try {
      const response = await reportService.create(data);
      reports.value.push(response.data);
      return response.data;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  // Events (Tasks)
  const fetchEvents = async (filter = {}) => {
    loading.value = true;
    try {
      const response = await eventService.getAll(filter);
      events.value = response.data.events;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const createEvent = async (data) => {
    try {
      const response = await eventService.create(data);
      events.value.unshift(response.data.event);
      return response.data.event;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  const updateEvent = async (id, data) => {
    try {
      const response = await eventService.update(id, data);
      const index = events.value.findIndex((e) => e._id === id);
      if (index !== -1) events.value[index] = response.data.event;
      return response.data.event;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  const deleteEvent = async (id) => {
    try {
      await eventService.delete(id);
      events.value = events.value.filter((e) => e._id !== id);
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  return {
    campaigns,
    farms,
    animals,
    products,
    transactions,
    alerts,
    sales,
    reports,
    loading,
    error,
    activeCampaigns,
    totalAnimals,
    lowStockProducts,
    totalRevenue,
    totalExpenses,
    fetchCampaigns,
    fetchCampaignById,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    fetchFarms,
    createFarm,
    updateFarm,
    deleteFarm,
    fetchAnimals,
    addAnimal,
    updateAnimal,
    deleteAnimal,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    fetchTransactions,
    addTransaction,
    fetchAlerts,
    resolveAlert,
    fetchSales,
    addSale,
    fetchReports,
    generateReport,
    events,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
});
