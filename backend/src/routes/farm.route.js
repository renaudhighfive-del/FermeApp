import express from "express";
import { requireAuth, autoriser } from "../middlewares/authMiddleware.js";
import {
  createFarm,
  getFarms,
  getFarm,
  updateFarm,
  deleteFarm,
} from "../controllers/farm.controller.js";

const router = express.Router();

router.post("/", requireAuth, autoriser("admin"), createFarm);
router.get("/", requireAuth, getFarms);
router.get("/:id", requireAuth, getFarm);
router.put("/:id", requireAuth, autoriser("admin"), updateFarm);
router.delete("/:id", requireAuth, autoriser("admin"), deleteFarm);

export default router;
