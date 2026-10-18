import { body } from "express-validator";


// 2. authValidation.js kya karta hai?
// Is file mein hum rules define karte hain.


// withMessage() ka kaam
// Ye sirf bolta hai:
// Agar isEmail() fail ho, to ye message error ke andar save kar dena.

// withMessage() bhi error message de raha hai, lekin wo response nahi bhej raha.

// For example:
// email = "priya@gmail"        ↓
// isEmail() ❌        ↓
// withMessage()        ↓
// Error message:
// "Please provide a valid email"
// Lekin ye message user ko directly nahi bhejta.


// Phir validateRequest.js kya karta hai?
// Ye saved error ko nikalta hai:

// const errors = validationResult(req);

// return res.status(400).json({
//     success: false,
//     message: "Validation failed",
//     errors: errors.array()
// });




// .withMessage() = error ka message define karta hai
// validateRequest = us error ko response mein bhejta hai

// Example:

// .withMessage("Please provide a valid email")

// 👉 Message banaya

// res.status(400).json(...)

// 👉 Message bheja


export const registerValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required"),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email"),

    body("password")
        .isLength({ min: 8})
        .withMessage("Password must be at least 6 characters"),

    body("role")
        .optional()
        .isIn(["user", "rider"])
        .withMessage("Role must be either user or rider")
];

// login

export const loginValidation =[
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid Email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),
]

export const sendOtpValidation =[
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email"),

    
]


export const verifyOtpValidation = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email"),

    body("otp")
        .trim()
        .notEmpty()
        .withMessage("OTP is required")
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP must be 6 digits"),
];

export const forgotPasswordValidation = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email"),
];

export const verifyResetOtpValidation = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email"),

    body("otp")
        .trim()
        .notEmpty()
        .withMessage("OTP is required")
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP must be 6 digits"),
];


export const resetPasswordValidation = [
    body("resetToken")
        .trim()
        .notEmpty()
        .withMessage("Reset token is required"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
];