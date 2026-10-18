import express from "express";
import {
    register,
    login,
    sendOtp,
    verifyOtp,
    forgotPassword,
    verifyResetOtp,
    resetPassword,
    getCurrentUser,
    logout
} from "../controllers/authController.js";


import authenticate from "../middlewares/authenticate.js";
import { forgotPasswordValidation, loginValidation, registerValidation, resetPasswordValidation, sendOtpValidation, verifyOtpValidation, verifyResetOtpValidation } from "../validations/authValidation.js";
import validateRequest from "../middlewares/validateRequest.js";
import resetTokenMiddleware from "../middlewares/resetTokenMiddleware.js";
const router = express.Router();


// ========================================
// Register
// ========================================

router.post(
    "/register",
    registerValidation,
    validateRequest,
    register
);

router.post(
    "/login",
    loginValidation,
    validateRequest,
    login
);

router.post(
    "/send-Otp",
    sendOtpValidation,
    validateRequest,
    sendOtp
);

router.post(
    "/verify-otp",
    verifyOtpValidation,
    validateRequest,
    verifyOtp
);

router.post(
    "/forgot-password",
    forgotPasswordValidation,
    validateRequest,
    forgotPassword
)


router.post(
    "/verify-reset-otp",
    verifyResetOtpValidation,
    validateRequest,
    verifyResetOtp
);

router.post(
    "/reset-password",
    resetPasswordValidation,
    validateRequest,
    resetTokenMiddleware,
    resetPassword
);


router.get("/me", authenticate, getCurrentUser);


router.post("/logout", logout);


export default router;