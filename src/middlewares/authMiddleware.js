import jwt from "jsonwebtoken";
import config from "../config/index.js";
import AppError from "../utils/AppError.js";

// export default function authMiddleware(req, res, next) {
// 	const authHeader = req.headers?.authorization;
// 	if (!authHeader || !authHeader.startsWith("Bearer ")) {
// 		return next(new AppError("Unauthorized: No token provided", 401));
// 	}

// 	const token = authHeader.split(" ")[1];
// 	try {
// 		const payload = jwt.verify(token, config.JWT_SECRET);
// 		req.user = payload;
// 		return next();
// 	} catch (error) {
// 		return next(new AppError("Unauthorized: Invalid token", 401));
// 	}
// }

export default function authMiddleware(req, res, next) {
  console.log("🔍 Auth header:", req.headers?.authorization?.substring(0, 30) + "...");
  
  const authHeader = req.headers?.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No Bearer token");
    return next(new AppError("Unauthorized: No token provided", 401));
  }

  const token = authHeader.split(" ")[1];
  console.log("🎫 Token length:", token.length);
  
  try {
    const payload = jwt.verify(token, config.JWT_SECRET);
    console.log("✅ Token valid for user:", payload.username);
    req.user = payload;
    return next();
  } catch (error) {
    console.log("❌ Token error:", error.name, error.message);
    return next(new AppError("Unauthorized: Invalid token", 401));
  }
}


