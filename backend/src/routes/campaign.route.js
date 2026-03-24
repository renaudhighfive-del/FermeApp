import express from "express";
import { requireAuth, autoriser } from "../middlewares/authMiddleware.js";
import {
  createCampaign,
  getCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign,
  getCampaignStats,
} from "../controllers/campaign.controller.js";

const router = express.Router();

router.post("/", requireAuth, autoriser("admin"), createCampaign);
router.get("/", requireAuth, getCampaigns);
router.get("/:id/stats", requireAuth, getCampaignStats);
router.get("/:id", requireAuth, getCampaign);
router.put("/:id", requireAuth, autoriser("admin"), updateCampaign);
router.delete("/:id", requireAuth, autoriser("admin"), deleteCampaign);

export default router;
