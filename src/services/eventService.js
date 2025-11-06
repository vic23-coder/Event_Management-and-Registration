import Event from "../models/event.js";
import Registration from "../models/registration.js";
import AppError from "../utils/AppError.js";

export async function createEvent({ name, date, location, description, capacity = null, category = "other", organizer_id = null }) {
  if (!name || !date || !location || !description) {
    throw new AppError("Missing required event fields", 400);
  }

  const event = await Event.create({
    title: name,
    description,
    date,
    location,
    capacity,
    category,
    organizer_id,
  });

  return event.toJSON();
}

export async function getAllEvents() {
  const events = await Event.findAll();
  return events.map((e) => {
    const obj = e.toJSON();
    return obj;
  });
}

export async function registerForEvent(user_uuid, event_uuid) {
  if (!user_uuid || !event_uuid) {
    throw new AppError("user_uuid and event_uuid are required", 400);
  }

  const registration = await Registration.create({ user_uuid, event_uuid });
  return registration.toJSON();
}

export async function cancelEventRegistration(user_uuid, event_uuid) {
  if (!user_uuid || !event_uuid) {
    throw new AppError("user_uuid and event_uuid are required", 400);
  }

  const reg = await Registration.findOne({ where: { user_uuid, event_uuid } });
  if (!reg) {
    throw new AppError("Registration not found", 404);
  }

  reg.status = "cancelled";
  await reg.save();
  return true;
}


export async function getUserRegistrations(user_uuid) {
  return await Registration.findAll({
    where: { user_uuid },
    include: [Event]
  });
}

export default {
  createEvent,
  getAllEvents,
  registerForEvent,
  cancelEventRegistration,
  getUserRegistrations,
};
