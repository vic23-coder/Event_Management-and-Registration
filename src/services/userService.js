import User from "../models/user.js";
import utils from "../utils/Auth.js";
import { sendEmail, renderTemplate } from "./emailService.js";
import fs from "fs/promises";
import path from "path";
import crypto from "node:crypto";

/**
 * Registers a new user for the event management system
 */
async function createUser(userData) {
  const checkEmailExists = await User.findOne({ where: { email: userData.email } });
  if (checkEmailExists) throw new Error("Email already exists");

  const checkUsernameExists = await User.findOne({ where: { username: userData.username } });
  if (checkUsernameExists) throw new Error("Username already exists");

  const newUser = await User.create(userData);

  // Send registration confirmation email
  const emailHtml = await renderTemplate("userRegistration", {
    username: newUser.username,
  });

  await sendEmail(
    newUser.email,
    "Welcome to the Event Management Platform",
    emailHtml
  );

  return newUser;
}

/**
 * Logs in a registered user
 */


async function logUserIntoApp(loginCredentials) {
  const user = await User.findOne({ 
  where: { email: loginCredentials.email },
  mapToModel: true, // ensures it returns a Sequelize instance
  model: User
});

  const isPasswordValid = await user.verifyPassword(loginCredentials.password);
  if (!isPasswordValid) throw new Error("Invalid Email or Password");

  const token = await utils.generateToken(user);
  const refreshToken = await utils.generateRefreshToken(user, token);

  await sendLoginNotification(user);

  return {
    userUUID: user.user_uuid,
    email: user.email,
    username: user.username,
    role: user.role,
    phone: user.phoneNumber || null,
    profilePicture: user.profilePicture || null,
    token,
    refreshToken,
  };
}

/**
 * Logs the user out of the app
 */
async function logUserOutOfApp(userUUID) {
  return { success: true, message: "User logged out successfully" };
}

/**
 * Refresh access token
 */
async function refreshUserToken(refreshToken) {
  const decoded = await utils.verifyRefreshToken(refreshToken);
  const user = await User.findOne({ where: { user_uuid: decoded.id } });
  if (!user) throw new Error("User not found");

  const newToken = await utils.generateToken(user);
  const newRefreshToken = await utils.generateRefreshToken(user, newToken);

  return { token: newToken, refreshToken: newRefreshToken };
}

/**
 * Get user profile details
 */
async function getUserProfile(userUUID) {
  const user = await User.findOne({ where: { user_uuid: userUUID } });
  if (!user) throw new Error("User not found");

  delete user.dataValues.password;

  return user;
}

/**
 * Update user details or profile picture
 */
async function updateUserProfile(userUUID, requestData) {
  const user = await User.findOne({ where: { user_uuid: userUUID } });
  if (!user) throw new Error("User not found");

  const updateData = {};

  if (requestData.username) updateData.username = requestData.username;
  if (requestData.email) updateData.email = requestData.email;
  if (requestData.phoneNumber) updateData.phoneNumber = requestData.phoneNumber;

  // Handle profile picture upload
  if (requestData.file) {
    const avatarsDir = path.join("uploads", "avatars");
    await fs.mkdir(avatarsDir, { recursive: true });

    const filename = `${userUUID}-${Date.now()}${path.extname(requestData.file.originalname)}`;
    const permanentPath = path.join(avatarsDir, filename);

    await fs.rename(requestData.file.path, permanentPath);

    if (user.profilePicture) {
      await fs.unlink(user.profilePicture).catch(() => {});
    }

    updateData.profilePicture = permanentPath;
  }

  await user.update(updateData);
  await user.reload();

  const updatedProfile = user.toJSON();
  delete updatedProfile.password;

  return updatedProfile;
}

/**
 * Send login notification email
 */
async function sendLoginNotification(user) {
  const html = await renderTemplate("login-notification", {
    username: user.username,
    loginTime: new Date().toLocaleString(),
    location: "Unknown location",  // Default value
    device: "Unknown device"       // Default value
  });

  const text = `Hello ${user.username},\n\nYour account was accessed at ${new Date().toLocaleString()}. If this wasn't you, please contact support immediately.`;

  await sendEmail(user.email, "Login Alert", html, text);
}

// Named exports expected by controllers for backward compatibility
export { createUser as registerUserService };
export { logUserIntoApp as loginUserService };
export { getUserProfile as getUserProfileService };

export default {
  createUser,
  logUserIntoApp,
  logUserOutOfApp,
  refreshUserToken,
  getUserProfile,
  updateUserProfile,
};
