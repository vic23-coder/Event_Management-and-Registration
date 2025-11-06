import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config/index.js";

/**
 * Generate access token for a user
 */
async function generateToken(user) {
  try {
    const payload = {
      user_uuid: user.user_uuid,
      username: user.username,
      role: user.role,
    };

    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: "2h",
    });
  } catch (error) {
    throw new Error("Error generating access token");
  }
}

/**
 * Verify access token
 */
async function verifyToken(token) {
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired access token");
  }
}

/**
 * Generate refresh token
 */
async function generateRefreshToken(user) {
  try {
    const payload = {
      id: user.user_uuid,
      username: user.username,
      role: user.role,
      type: "refresh",
    };

    return jwt.sign(payload, config.JWT_REFRESH_SECRET || config.JWT_SECRET, {
      expiresIn: config.JWT_REFRESH_EXPIRES_IN || "7d",
    });
  } catch (error) {
    throw new Error("Error generating refresh token");
  }
}

/**
 * Verify refresh token
 */
async function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, config.JWT_REFRESH_SECRET || config.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
}

/**
 * Hash a user password
 */
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare password with hashed version
 */
async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

export default {
  generateToken,
  verifyToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashPassword,
  comparePassword,
};
