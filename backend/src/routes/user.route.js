import { Router } from "express";
import { autoriser, requireAuth } from "../middlewares/authMiddleware.js";
import { creerUser, 
    toggleUserStatus, 
    listerUsers, 
    modifierUser, 
    obtenirUser, 
    reinitialiserMotDePasse,
    supprimerUser } from "../controllers/user.controller.js";

const router = Router()

// Toutes les routes nécessitent d'être connecté
router.use(requireAuth)

// ── CRUD users — admin (et gerant pour la liste des agents) ──────
router.get('/',    autoriser('admin', 'gerant','agent'), listerUsers)   // GET    /api/users
router.post('/',   autoriser('admin'), creerUser)     // POST   /api/users
router.get('/:id', autoriser('admin'), obtenirUser)   // GET    /api/users/:id
router.put('/:id', autoriser('admin'), modifierUser)  // PUT    /api/users/:id
router.delete('/:id', autoriser('admin'), supprimerUser) // DELETE /api/users/:id
 
// ── Actions spécifiques ───────────────────────────────────────────
router.patch('/:id/mot-de-passe', autoriser('admin'), reinitialiserMotDePasse)  // PATCH /api/users/:id/mot-de-passe
router.patch('/:id/desactiver',   autoriser('admin'), toggleUserStatus)   


export default router;
