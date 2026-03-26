import express from "express";
import { requireAuth, autoriser } from "../middlewares/authMiddleware.js";
import {
  createAnimal,
  getAnimals,
  getAnimal,
  updateAnimal,
  deleteAnimal,
} from "../controllers/animal.controller.js";

const router = express.Router();

router.post("/", requireAuth, autoriser("admin", "gerant","agent"), createAnimal);
router.get("/", requireAuth, getAnimals);
router.get("/:id", requireAuth, getAnimal);
router.put("/:id", requireAuth, autoriser("admin", "gerant", "agent"), updateAnimal);
router.delete("/:id", requireAuth, autoriser("admin"), deleteAnimal);

export default router;
