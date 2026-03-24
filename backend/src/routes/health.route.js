import express from "express";
import { requireAuth, autoriser } from "../middlewares/authMiddleware.js";
import {
  createHealthRecord,
  getHealthRecords,
  updateHealthRecord,
  deleteHealthRecord,
  getUpcomingVaccinations,
} from "../controllers/health.controller.js";

const router = express.Router();

router.post("/", requireAuth, autoriser("admin"), createHealthRecord);
router.get("/upcoming-vaccinations", requireAuth, getUpcomingVaccinations);
router.get("/", requireAuth, getHealthRecords);
router.put("/:id", requireAuth, autoriser("admin"), updateHealthRecord);
router.delete("/:id", requireAuth, autoriser("admin"), deleteHealthRecord);

export default router;
