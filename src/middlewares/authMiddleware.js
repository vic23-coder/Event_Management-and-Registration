import jwt from "jsonwebtoken";
import config from "../config/index.js";
import AppError from "../utils/AppError.js";

export default function authMiddleware(req, res, next) {
	const authHeader = req.headers?.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return next(new AppError("Unauthorized: No token provided", 401));
	}

	const token = authHeader.split(" ")[1];
	try {
		const payload = jwt.verify(token, config.JWT_SECRET);
		req.user = payload;
		return next();
	} catch (error) {
		return next(new AppError("Unauthorized: Invalid token", 401));
	}
}
