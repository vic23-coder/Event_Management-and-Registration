import express from "express";
import { 
  createNewEvent, 
  getAllEvents,
  registerUserForEvent,
  cancelEvent 
} from "../controllers/eventcontroller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import validationMiddleware from "../middlewares/ValidatorMiddleware.js";

const router = express.Router();

// Create event - requires admin or organizer role
router.post("/", 
  authMiddleware,              // Must be logged in
  roleMiddleware,              // Must have admin/organizer role
  validationMiddleware,        // Validate request data
  createNewEvent
);

// Get all events - public access
router.get("/", getAllEvents);

// Register for event - requires authentication
router.post("/register", 
  authMiddleware,
  registerUserForEvent
);

// Cancel event registration - requires authentication  
router.post("/cancel", 
  authMiddleware,
  cancelEvent
);

export default router;