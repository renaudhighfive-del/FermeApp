import { Router } from "express";
import { getCurrentUser, login } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/authMiddleware.js";


const router = Router()

router.post("/login", login) // POST /api/auth/login
router.get("/me", requireAuth, getCurrentUser)  // GET  /api/auth/me

export default router;
