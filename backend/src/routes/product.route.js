import express from "express";
import { requireAuth, autoriser } from "../middlewares/authMiddleware.js";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
} from "../controllers/product.controller.js";

const router = express.Router();

router.post("/", requireAuth, autoriser("admin"), createProduct);
router.get("/low-stock", requireAuth, getLowStockProducts);
router.get("/", requireAuth, getProducts);
router.get("/:id", requireAuth, getProduct);
router.put("/:id", requireAuth, autoriser("admin"), updateProduct);
router.delete("/:id", requireAuth, autoriser("admin"), deleteProduct);

export default router;
