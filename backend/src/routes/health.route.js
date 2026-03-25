import express from "express";
import { requireAuth, autoriser } from "../middlewares/authMiddleware.js";
import {
  createHealthRecord,
  getHealthRecords,
  updateHealthRecord,
  deleteHealthRecord,
  getUpcomingVaccinations,
  getAlerts,
} from "../controllers/health.controller.js";

const router = express.Router();

router.post("/", requireAuth, autoriser("admin"), createHealthRecord);
router.get("/alerts", requireAuth, getAlerts);
router.get("/upcoming-vaccinations", requireAuth, getUpcomingVaccinations);
router.get("/", requireAuth, getHealthRecords);
router.put("/:id", requireAuth, updateHealthRecord);
router.delete("/:id", requireAuth, autoriser("admin"), deleteHealthRecord);

export default router;
