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
} from "@/services/api";

export const useAdminStore = defineStore("admin", () => {
  // State
  const campaigns = ref([]);
  const farms = ref([]);
  const animals = ref([]);
  const products = ref([]);
  const transactions = ref([]);
  const sales = ref([]);
  const reports = ref([]);
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

  // Animals
  const fetchAnimals = async (filter = {}) => {
    loading.value = true;
    try {
      const response = await animalService.getAll(filter);
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

  return {
    campaigns,
    farms,
    animals,
    products,
    transactions,
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
    fetchAnimals,
    addAnimal,
    fetchProducts,
    addProduct,
    fetchTransactions,
    addTransaction,
    fetchSales,
    addSale,
    fetchReports,
    generateReport,
  };
});
