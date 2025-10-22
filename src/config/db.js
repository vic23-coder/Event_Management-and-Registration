import { Sequelize } from "sequelize";
import config from "./index.js";

const sequelize = new Sequelize(
  config.DATABASE_NAME,
  config.DATABASE_USERNAME,
  config.DATABASE_PASSWORD,
  {
    host: config.DATABASE_HOST,
    port: config.DATABASE_PORT,
    dialect: config.DATABASE_DIALECT,
    logging: false,
    define: {
      timestamps: true, 
      underscored: true, 
    },
  }
);


export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(" Connected to the Event Management Database successfully!");
  } catch (error) {
    console.error(" Database connection failed:", error.message);
  }
};

export default sequelize;
