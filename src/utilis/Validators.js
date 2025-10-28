import { body } from "express-validator";


const registrationValidator = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("confirmPassword").custom((value, { req }) => {
    if (req.body.password && value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),

  body("phoneNumber")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid phone number"),

  
];


const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Invalid Email or Password")
    .bail()
    .isEmail()
    .withMessage("Invalid Email or Password"),

  body("password").notEmpty().withMessage("Invalid Email or Password"),
];


const eventValidator = [
  body("title").notEmpty().withMessage("Event title is required"),
  body("description").notEmpty().withMessage("Event description is required"),
  body("date")
    .notEmpty()
    .withMessage("Event date is required")
    .bail()
    .isISO8601()
    .withMessage("Invalid date format (use YYYY-MM-DD)"),
  body("location").notEmpty().withMessage("Event location is required"),
  body("category")
    .isIn(["Music", "Tech", "Sports", "Education", "Business", "Art", "Other"])
    .withMessage("Invalid category selected"),
  body("capacity")
    .isInt({ min: 1 })
    .withMessage("Capacity must be a positive integer"),
];

export { registrationValidator, loginValidator, eventValidator };
