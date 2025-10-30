import logger from "../utils/logger.js";
import AppError from "../utils/AppError.js";

export default function errorHandler(err, req, res, next) {
  if (!(err instanceof AppError)) {
    logger.error({
      message: err.message || "Unhandled error",
      stack: err.stack,
      statusCode: 500,
    });
    err = new AppError("Internal Server Error", 500);
  }

  const statusCode = err.statusCode || 500;

  if (statusCode >= 500) {
    logger.fatal({
      message: err.message,
      stack: err.stack,
      statusCode,
      data: err.data || null,
    });
  } else {
    logger.error({
      message: err.message,
      statusCode,
      data: err.data || null,
    });
  }

  console.error(err.stack);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(err.data && { data: err.data }),
  });
}
