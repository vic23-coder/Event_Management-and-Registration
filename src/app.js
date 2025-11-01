import express from "express";
import config from "./config/index.js";
import  { connectDB } from "./config/db.js";
// models imported as needed; removed unused default import to match exports
import errorHandler from "./middlewares/errorHandler.js";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/eventRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";

// Initialize Express app
const app = express();


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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

// Start the server
try {
  await connectDB(); // connect to the database
  app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
  });
} catch (error) {
  console.error("Failed to start server:", error.message);
}
