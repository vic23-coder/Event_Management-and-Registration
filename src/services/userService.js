import { Op } from "sequelize";
import User from "../models/user.js";
import AppError from "../utils/AppError.js";

export async function registerUserService({ username, email, password, phoneNumber, role = "user" }) {
  if (!username || !email || !password) {
    throw new AppError("username, email and password are required", 400);
  }

  const existing = await User.findOne({
    where: {
      [Op.or]: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() },
      ],
    },
  });

  if (existing) {
    throw new AppError("User with provided email or username already exists", 400);
  }

  const user = await User.create({
    username,
    email,
    password,
    phoneNumber,
    role,
  });

  const userObj = user.toJSON();
  delete userObj.password;
  return userObj;
}

export async function loginUserService({ email, password }) {
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await User.findOne({ where: { email: email.toLowerCase() } });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isValid = await user.validatePassword(password);
  if (!isValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const userObj = user.toJSON();
  delete userObj.password;
  return userObj;
}

export async function getUserProfileService(userUUID) {
  if (!userUUID) return null;

  const user = await User.findOne({ where: { user_uuid: userUUID } });
  if (!user) return null;

  const userObj = user.toJSON();
  delete userObj.password;
  return userObj;
}

export default {
  registerUserService,
  loginUserService,
  getUserProfileService,
};
