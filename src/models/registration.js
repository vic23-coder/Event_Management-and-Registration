import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Registration = sequelize.define("Registration", {
    registration_uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Users",
            key: "user_uuid",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    event_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Events",
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
