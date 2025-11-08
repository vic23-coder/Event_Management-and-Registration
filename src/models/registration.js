import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Registration = sequelize.define("Registration", {
    registration_uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        
    },
    user_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "users",
            key: "user_uuid",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    event_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "events",
            key: "event_uuid",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    status: {
        type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
        defaultValue: "pending",
    },
}, {
    timestamps: true,
});

export default Registration;
