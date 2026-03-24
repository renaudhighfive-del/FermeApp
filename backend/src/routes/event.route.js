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

// --- Routes Admin ---
router.get('/',      autoriser('admin'), getAllEvents);
router.post('/',     autoriser('admin'), createEvent);
router.put('/:id',   autoriser('admin'), updateEvent);
router.delete('/:id', autoriser('admin'), deleteEvent);

// --- Routes Gérant (peut aussi voir/créer pour ses campagnes) ---
router.get('/gerant', autoriser('gerant'), getAllEvents);
router.post('/gerant', autoriser('gerant'), createEvent);

export default router;
