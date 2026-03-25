import { Router } from "express";
import { autoriser, requireAuth } from "../middlewares/authMiddleware.js";
import { 
    getAllEvents, 
    createEvent, 
    updateEvent, 
    deleteEvent 
} from "../controllers/event.controller.js";

const router = Router();

// Toutes les routes nécessitent d'être connecté
router.use(requireAuth);

// --- Routes publiques (tous les rôles) ---
router.get('/', getAllEvents);

// --- Routes Admin ---
router.post('/', autoriser('admin'), createEvent);
router.put('/:id', autoriser('admin'), updateEvent);
router.delete('/:id', autoriser('admin'), deleteEvent);

// --- Routes Gérant (peut créer pour ses campagnes) ---
router.post('/gerant', autoriser('gerant'), createEvent);
router.put('/gerant/:id', autoriser('gerant'), updateEvent);

export default router;
