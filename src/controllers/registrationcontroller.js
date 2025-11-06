import AppError from "../utils/AppError.js";
import {
  registerForEvent,
  cancelEventRegistration,
  getUserRegistrations,
  getEventRegistrations,
  updateRegistrationStatus,
  checkRegistrationStatus,
} from "../services/eventService.js";

// REGISTER FOR EVENT (moved from eventController)
export async function registerUserForEvent(req, res, next) {
  try {
    const { event_uuid } = req.params;
    const user_uuid = req.user.user_uuid; // From auth middleware

    const registration = await registerForEvent(user_uuid, event_uuid);
    
    res.status(201).json({
      success: true,
      message: "Event registration successful",
      data: registration,
    });
  } catch (error) {
    next(new AppError(error.message || "Event registration failed", 400));
  }
}

// CANCEL REGISTRATION
export async function cancelRegistration(req, res, next) {
  try {
    const { event_uuid } = req.params;
    const user_uuid = req.user.user_uuid;

    await cancelEventRegistration(user_uuid, event_uuid);
    
    res.status(200).json({
      success: true,
      message: "Event registration cancelled successfully",
    });
  } catch (error) {
    next(new AppError(error.message || "Failed to cancel registration", 400));
  }
}

// GET USER'S REGISTRATIONS
export async function getMyRegistrations(req, res, next) {
  try {
    const user_uuid = req.user.user_uuid;
    const { status } = req.query;

    const registrations = await getUserRegistrations(user_uuid, status);
    
    res.status(200).json({
      success: true,
      data: registrations,
    });
  } catch (error) {
    next(new AppError(error.message || "Failed to fetch registrations", 500));
  }
}

// GET EVENT REGISTRATIONS (for event organizers)
export async function getEventRegistrations(req, res, next) {
  try {
    const { event_uuid } = req.params;
    const organizer_id = req.user.user_uuid;

    const registrations = await getEventRegistrations(event_uuid, organizer_id);
    
    res.status(200).json({
      success: true,
      data: registrations,
    });
  } catch (error) {
    next(new AppError(error.message || "Failed to fetch event registrations", 500));
  }
}

// CHECK REGISTRATION STATUS
export async function checkRegistration(req, res, next) {
  try {
    const { event_uuid } = req.params;
    const user_uuid = req.user.user_uuid;

    const registration = await checkRegistrationStatus(user_uuid, event_uuid);
    
    res.status(200).json({
      success: true,
      data: {
        isRegistered: !!registration,
        registration: registration || null,
      },
    });
  } catch (error) {
    next(new AppError(error.message || "Failed to check registration", 500));
  }
}