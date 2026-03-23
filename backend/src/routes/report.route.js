import express from "express";
import { requireAuth, autoriser } from "../middlewares/authMiddleware.js";
import {
  generateReport,
  getReports,
  getReport,
  deleteReport,
} from "../controllers/report.controller.js";

const router = express.Router();

router.post("/", requireAuth, autoriser("admin"), generateReport);
router.get("/", requireAuth, getReports);
router.get("/:id", requireAuth, getReport);
router.delete("/:id", requireAuth, autoriser("admin"), deleteReport);

export default router;
