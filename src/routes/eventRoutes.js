import express from "express";
import { 
  createNewEvent, 
  getAllEvents, 
  registerUserForEvent, 
  cancelEvent 
} from "../controllers/eventcontroller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllEvents);

// Protected routes (require authentication)
router.post("/", authMiddleware, createNewEvent);
router.post("/register", authMiddleware, registerUserForEvent);
router.post("/cancel", authMiddleware, cancelEvent);

export default router;
