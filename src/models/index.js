import User from "./user.js";
import Event from "./event.js";
import Registration from "./registration.js";

User.hasMany(Event, { as: "organizedEvents", foreignKey: "organizer_id" });
Event.belongsTo(User, { as: "organizer", foreignKey: "organizer_id" });


User.hasMany(Registration, { as: "userRegistrations", foreignKey: "user_uuid" });
Registration.belongsTo(User, { as: "user", foreignKey: "user_uuid" });


Event.hasMany(Registration, { as: "eventRegistrations", foreignKey: "event_uuid" });
Registration.belongsTo(Event, { as: "event", foreignKey: "event_uuid" });

export { User, Event, Registration };
