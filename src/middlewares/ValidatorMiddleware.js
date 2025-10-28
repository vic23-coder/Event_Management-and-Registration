// src/middlewares/validationMiddleware.js
import { validationResult } from "express-validator";

// Customize how validation errors are formatted
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => error.msg, // only show the error message text
});

// Validation middleware function
const validationMiddleware = (req, res, next) => {
  // Run all validation checks on the request
  const result = myValidationResult(req);

  // If there are validation errors
  if (!result.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation errors",
      data: result.array(), // list of error messages
    });
  }

  // If no errors, continue to next middleware or route
  next();
};

export default validationMiddleware;
