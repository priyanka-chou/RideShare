 
import * as authService from "../services/authService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";


// ========================================
// Register
// ========================================

export const register = asyncHandler(async (req, res) => {

    const result = await authService.registerUser(req.body);

    return successResponse(
        res,
        201,
        "Registration successful.",
        result
    );

});


// ==============================================
// Login
// ================================================

export const login = asyncHandler (async (req,res) =>{

    const result = await authService.loginUser(req.body);


    res.cookie("token",result.token,{
        httpOnly : true,
        secure:process.env.NODE_ENV === "production",
        sameSite : process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge : 24 * 60 * 60 * 1000
    });

    return successResponse(
        res,
        200,
        "Login Succesfull",
        {
            user : result.user
        }
    );

});

// =================================================
// Send otp 
// ===================================================

export const sendOtp = asyncHandler( async(req,res)=>{

    const result = await authService.sendOtp(req.body);

    return successResponse(
        res,
        200,
        "OTP sent successfully",
        result
    );
});

// ===================================================
//verify Otp 
// ===================================================

export const verifyOtp = asyncHandler(async(req,res)=>{

    const result = await authService.verifyOtp(req.body);

    return successResponse(
       res,
       200,
       "Email verify Successfully",
       result
    );
});


// ====================================================
// Forgot Password
// ====================================================

export const forgotPassword = asyncHandler(async (req, res) => {

    await authService.forgotPassword(req.body);

    return successResponse(
        res,
        200,
        "Password reset OTP sent successfully"
    );

});

// ====================================================
// Verify Reset OTP
// ====================================================

export const verifyResetOtp = asyncHandler(async (req, res) => {

   const result = await authService.verifyResetOtp(req.body);

    return successResponse(
        res,
        200,
        "Reset OTP verified successfully",
        result
    );

});


// ====================================================
// Reset Password
// ====================================================

export const resetPassword = asyncHandler(async (req, res) => {

    const result = await authService.resetPassword({
        userId: req.resetUser.id,
        password: req.body.password
    });

    return successResponse(
        res,
        200,
        "Password reset successfully",
        result
    );
});



export const getCurrentUser = asyncHandler(async (req, res) => {

    const user = await authService.getCurrentUser(req.user.id);

    return successResponse(
        res,
        200,
        "Current user fetched successfully",
        user
    );
});



// ====================================================
// Logout
// ====================================================

export const logout = asyncHandler(async (req, res) => {

    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });

    return successResponse(
        res,
        200,
        "Logout successful"
    );
});