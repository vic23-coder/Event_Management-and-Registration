
import AppError from "../utils/AppError.js";
import {
  createEvent,
  getAllEvents as getAllEventsService,
  registerForEvent,
  cancelEventRegistration,
} from "../services/eventService.js";


export async function createNewEvent(req, res, next) {
  try {
    const { name, date, location, description } = req.body;
    
    // ADD THIS LINE - get the organizer_id from the authenticated user
    const organizer_id = req.user.id; // or req.user.uuid depending on your token structure
    
    // CHANGE THIS LINE - pass organizer_id to the service
    const createdEvent = await createEvent({ 
      name, 
      date, 
      location, 
      description, 
      organizer_id 
    });
    
    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: createdEvent,
    });
  } catch (error) {
    next(new AppError(error.message || "Failed to create event", 400));
  }
}

export async function getAllEvents(req, res, next) {
  try {
    const events = await getAllEventsService();
    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    next(new AppError(error.message || "Failed to fetch events", 500));
  }
}


export async function registerUserForEvent(req, res, next) {
  try {
    const { user_uuid, event_uuid } = req.body;
    const registration = await registerForEvent(user_uuid, event_uuid);
    res.status(200).json({
      success: true,
      message: "Event registration successful",
      data: registration,
    });
  } catch (error) {
    next(new AppError(error.message || "Event registration failed", 400));
  }
}


export async function cancelEvent(req, res, next) {
  try {
    const { user_uuid, event_uuid } = req.body;
    await cancelEventRegistration(user_uuid, event_uuid);
    res.status(200).json({
      success: true,
      message: "Event registration cancelled successfully",
    });
  } catch (error) {
    next(new AppError(error.message || "Failed to cancel registration", 400));
  }
}
