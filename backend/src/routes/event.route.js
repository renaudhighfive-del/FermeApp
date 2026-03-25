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
router.get('/', getAllEvents);
router.post('/',     autoriser('admin', 'gerant'), createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', autoriser('admin', 'gerant'), deleteEvent);

// --- Routes Gérant (peut aussi voir/créer pour ses campagnes) ---
router.get('/gerant', autoriser('gerant'), getAllEvents);
router.post('/gerant', autoriser('gerant'), createEvent);

export default router;
