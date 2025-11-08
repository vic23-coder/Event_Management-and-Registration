// routes/auth.js

import express from "express";
import {
  registerUser,
  loginUser,
  userProfile,
} from "../controllers/authcontroller.js";
import {
  registrationValidator,
  loginValidator,
} from "../utils/Validators.js";
import validationMiddleware from "../middlewares/ValidatorMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";

import {
  createNewEvent,
  getAllEvents,
  cancelEvent,
  registerUserForEvent,
} from "../controllers/eventcontroller.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

//
// USER AUTH ROUTES
//

// Register a new user
router.post(
  "/register",
  registrationValidator,
  validationMiddleware,
  registerUser
);

// Login user
router.post("/login", loginValidator, validationMiddleware, loginUser);

// View user profile (protected route)
router.get("/profile", authMiddleware, userProfile);

//
// EVENT MANAGEMENT ROUTES
//



// Create a new event (admin or event organizer only)
router.post("/events", authMiddleware, roleMiddleware, createNewEvent);

// Get all available events
router.get("/events", getAllEvents);

// Cancel an event (event creator or admin only)
router.put("/events/:eventId/cancel", authMiddleware, cancelEvent);

// Register logged-in user for a specific event
router.post("/events/:eventId/register", authMiddleware, registerUserForEvent);

export default router;
