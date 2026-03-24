import { Router } from "express";
import { autoriser, requireAuth } from "../middlewares/authMiddleware.js";
import { creerUser, 
    desactiverUser, 
    listerUsers, 
    modifierUser, 
    obtenirUser, 
    reinitialiserMotDePasse } from "../controllers/user.controller.js";

const router = Router()

// Toutes les routes nécessitent d'être connecté
router.use(requireAuth)

// ── CRUD users — admin seulement ──────────────────────────────────
router.get('/',    autoriser('admin'), listerUsers)   // GET    /api/users
router.post('/',   autoriser('admin'), creerUser)     // POST   /api/users
router.get('/:id', autoriser('admin'), obtenirUser)   // GET    /api/users/:id
router.put('/:id', autoriser('admin'), modifierUser)  // PUT    /api/users/:id
 
// ── Actions spécifiques ───────────────────────────────────────────
router.patch('/:id/mot-de-passe', autoriser('admin'), reinitialiserMotDePasse)  // PATCH /api/users/:id/mot-de-passe
router.patch('/:id/desactiver',   autoriser('admin'), desactiverUser)   


export default router;
