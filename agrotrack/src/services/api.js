import axios from "./axios.js";

// AUTH
export const authService = {
  login: (email, password) => axios.post("/auth/login", { email, password }),
  getMe: () => axios.get("/auth/me"),
};

// USERS
export const userService = {
  getAll: (params) => axios.get("/users", { params }),
  getById: (id) => axios.get(`/users/${id}`),
  create: (data) => axios.post("/users", data),
  update: (id, data) => axios.put(`/users/${id}`, data),
  delete: (id) => axios.delete(`/users/${id}`),
  resetPassword: (id, password) => axios.patch(`/users/${id}/mot-de-passe`, { password }),
  deactivateUser: (id) => axios.patch(`/users/${id}/desactiver`, {}),
};

// CAMPAIGNS
export const campaignService = {
  getAll: (params) => axios.get("/campaigns", { params }),
  getById: (id) => axios.get(`/campaigns/${id}`),
  create: (data) => axios.post("/campaigns", data),
  update: (id, data) => axios.put(`/campaigns/${id}`, data),
  delete: (id) => axios.delete(`/campaigns/${id}`),
  getStats: (id) => axios.get(`/campaigns/${id}/stats`),
};

// FARMS
export const farmService = {
  getAll: (params) => axios.get("/farms", { params }),
  getById: (id) => axios.get(`/farms/${id}`),
  create: (data) => axios.post("/farms", data),
  update: (id, data) => axios.put(`/farms/${id}`, data),
  delete: (id) => axios.delete(`/farms/${id}`),
};

// ANIMALS
export const animalService = {
  getAll: (params) => axios.get("/animals", { params }),
  getById: (id) => axios.get(`/animals/${id}`),
  create: (data) => axios.post("/animals", data),
  update: (id, data) => axios.put(`/animals/${id}`, data),
  delete: (id) => axios.delete(`/animals/${id}`),
};

// PRODUCTS (STOCK)
export const productService = {
  getAll: (params) => axios.get("/products", { params }),
  getById: (id) => axios.get(`/products/${id}`),
  create: (data) => axios.post("/products", data),
  update: (id, data) => axios.put(`/products/${id}`, data),
  delete: (id) => axios.delete(`/products/${id}`),
  getLowStock: (params) => axios.get("/products/low-stock", { params }),
};

// TRANSACTIONS (FINANCE)
export const transactionService = {
  getAll: (params) => axios.get("/transactions", { params }),
  getById: (id) => axios.get(`/transactions/${id}`),
  create: (data) => axios.post("/transactions", data),
  update: (id, data) => axios.put(`/transactions/${id}`, data),
  delete: (id) => axios.delete(`/transactions/${id}`),
  getSummary: (params) => axios.get("/transactions/summary", { params }),
};

// HEALTH
export const healthService = {
  getAll: (params) => axios.get("/health", { params }),
  create: (data) => axios.post("/health", data),
  update: (id, data) => axios.put(`/health/${id}`, data),
  delete: (id) => axios.delete(`/health/${id}`),
  getUpcomingVaccinations: (params) =>
    axios.get("/health/upcoming-vaccinations", { params }),
};

// SALES
export const saleService = {
  getAll: (params) => axios.get("/sales", { params }),
  create: (data) => axios.post("/sales", data),
  update: (id, data) => axios.put(`/sales/${id}`, data),
  delete: (id) => axios.delete(`/sales/${id}`),
  getStats: (params) => axios.get("/sales/stats", { params }),
};

// REPORTS
export const reportService = {
  getAll: (params) => axios.get("/reports", { params }),
  getById: (id) => axios.get(`/reports/${id}`),
  create: (data) => axios.post("/reports", data),
  delete: (id) => axios.delete(`/reports/${id}`),
};

// SETTINGS
export const settingsService = {
  get: (params) => axios.get("/settings", { params }),
  update: (data) => axios.put("/settings", data),
  getDashboardStats: (params) => axios.get("/settings/dashboard-stats", { params }),
};
