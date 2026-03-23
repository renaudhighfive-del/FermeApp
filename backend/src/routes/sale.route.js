import express from "express";
import { requireAuth, autoriser } from "../middlewares/authMiddleware.js";
import {
  createSale,
  getSales,
  updateSale,
  deleteSale,
  getSalesStats,
} from "../controllers/sale.controller.js";

const router = express.Router();

router.post("/", requireAuth, autoriser("admin"), createSale);
router.get("/stats", requireAuth, getSalesStats);
router.get("/", requireAuth, getSales);
router.put("/:id", requireAuth, autoriser("admin"), updateSale);
router.delete("/:id", requireAuth, autoriser("admin"), deleteSale);

export default router;
