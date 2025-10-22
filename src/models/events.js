import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Event = sequelize.define("Event", {
    event_uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    category: {
        type: DataTypes.ENUM("conference", "workshop","concert","Sports","other"),
        defaultValue: "other",
    },
    status: {
        type: DataTypes.ENUM("upcoming", "ongoing", "completed", "cancelled"),
        allowNull: false,
        defaultValue: "upcoming",
    },
    organizer_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Users",
            key: "user_uuid",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
}, {
    timestamps: true,
});

export default Event;
