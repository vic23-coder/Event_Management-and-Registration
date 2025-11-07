// controllers/authController.js
import AppError from "../utils/AppError.js";
import {
  registerUserService,
  loginUserService,
  getUserProfileService,
} from "../services/userService.js";
import emailService from "../services/emailService.js";

//  USER REGISTRATION
export async function registerUser(req, res, next) {
  try {
    const { username, email, password, phoneNumber, role = "user" } = req.body;

    const newUser = await registerUserService({
      username,
      email,
      password,
      phoneNumber,
      role,
    });

    // Send welcome email after registration
    await emailService.sendWelcomeEmail(email, username);

    res.status(201).json({
      success: true,
      message: "User registered successfully. Welcome email sent.",
      data: newUser,
    });
  } catch (error) {
    next(new AppError(error.message || "Registration failed", 400));
  }
}

//  USER LOGIN
export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await loginUserService({ email, password });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    next(new AppError(error.message || "Invalid email or password", 401));
  }
}

// USER PROFILE
export async function getUserProfile(req, res, next) {
  try {
    const userUUID = req.user?.user_uuid; // assumes middleware sets req.user
    const profile = await getUserProfileService(userUUID);

    if (!profile) throw new AppError("User not found", 404);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(new AppError(error.message || "Failed to fetch profile", 400));
  }
}

// Alias export expected by routes
export { getUserProfile as userProfile };
