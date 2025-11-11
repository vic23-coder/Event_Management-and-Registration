import express from "express";
import config from "./config/index.js";
import { connectDB } from "./config/db.js";
import sequelize from "./config/db.js";
// Import models directly at the top
import { User, Event, Registration } from "./models/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/eventRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import cors from 'cors'

// Initialize Express app
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Health check route (to test server)
app.get("/api/health", (req, res) => {
  res.json({ status: "API is running fine and healthy" });
});

// Main routes
app.use("/api/auth", authRoutes);               // user registration/login
app.use("/api/events", eventRoutes);            // create, view, or update events
app.use("/api/registrations", registrationRoutes); // user registers/cancels events

// Default route for undefined endpoints
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route does not exist" });
});

// Error handler middleware
app.use(errorHandler);


if (!config.DATABASE_PASSWORD || !config.JWT_SECRET) {
  console.error("Missing required environment variables!");
  process.exit(1);
}



// Start the server - sync models in correct dependency order
const startServer = async () => {
  try {
    console.log("Starting Event Management Server...");
    
    // Connect to database first
    await connectDB();
    
    // Log that models are loaded
    console.log("Models loaded:", { 
      User: User.name, 
      Event: Event.name, 
      Registration: Registration.name 
    });
    
    // IMPORTANT: Sync models in dependency order to avoid foreign key errors
    // 1. User table first (no foreign key dependencies)

const isProduction = config.ENVIRONMENT === 'production';
console.log(`Syncing models (production: ${isProduction})...`);
await User.sync({ force: !isProduction, alter: isProduction });
await Event.sync({ force: !isProduction, alter: isProduction });  
await Registration.sync({ force: !isProduction, alter: isProduction });
    
    console.log("All models synchronized with the database!");
    
    // Start the Express server
    app.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
      console.log(`Health check: http://localhost:${config.PORT}/api/health`);
      console.log(`API endpoints:`);
      console.log(`   - Auth: http://localhost:${config.PORT}/api/auth`);
      console.log(`   - Events: http://localhost:${config.PORT}/api/events`);
      console.log(`   - Registrations: http://localhost:${config.PORT}/api/registrations`);
    });
    
  } catch (error) {
    console.error("Failed to start server:", error.message);
    console.error("Full error details:", error);
    process.exit(1);
  }
};

// Start the server
startServer();