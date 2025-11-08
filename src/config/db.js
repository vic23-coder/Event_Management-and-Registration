import { Sequelize } from "sequelize";
import config from "./index.js";

// NEW: Support both DATABASE_URL and individual parameters
const sequelize = config.DATABASE_URL 
  ? new Sequelize(config.DATABASE_URL, {
      dialect: 'postgres',
      logging: config.ENVIRONMENT !== 'production' ? console.log : false,
      define: {
        timestamps: true, 
        underscored: true, 
      },
    })
  : new Sequelize(
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

// Rest of your code stays the same
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(" Connected to the Event Management Database successfully!");
  } catch (error) {
    console.error(" Database connection failed:", error.message);
  }
};

export default sequelize;