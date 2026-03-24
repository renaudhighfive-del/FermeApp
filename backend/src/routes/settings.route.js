import express from "express";
import { requireAuth, autoriser } from "../middlewares/authMiddleware.js";
import {
  getSettings,
  updateSettings,
  getDashboardStats,
} from "../controllers/settings.controller.js";

const router = express.Router();

router.get("/dashboard-stats", requireAuth, getDashboardStats);
router.get("/", requireAuth, getSettings);
router.put("/", requireAuth, autoriser("admin"), updateSettings);

export default router;
