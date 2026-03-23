import express from "express";
import { requireAuth, autoriser } from "../middlewares/authMiddleware.js";
import {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getFinancialSummary,
} from "../controllers/transaction.controller.js";

const router = express.Router();

router.post("/", requireAuth, autoriser("admin"), createTransaction);
router.get("/summary", requireAuth, getFinancialSummary);
router.get("/", requireAuth, getTransactions);
router.get("/:id", requireAuth, getTransaction);
router.put("/:id", requireAuth, autoriser("admin"), updateTransaction);
router.delete("/:id", requireAuth, autoriser("admin"), deleteTransaction);

export default router;
