import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import * as authRepository from "../repositories/authRepository.js";

import { generateOtp } from "../utils/generateOtp.js";
import { sendEmail } from "../utils/sendEmail.js";

import AppError from "../error/AppError.js";


// ====================================================
// Register User
// ====================================================

export const registerUser = async (userData) => {

    const { name, email, password, role } = userData;


    // 1. Check if user already exists

   const existingUser =
    await authRepository.findUserByEmail(email);

console.log("EXISTING USER FOUND:", !!existingUser);


    if (existingUser) {
        throw new AppError(
            "Email already registered",
            409
        );
    }


    // 2. Check pending registration

   
const pendingUser =
    await authRepository.findPendingUserByEmail(email);

if (pendingUser) {
    if (role !== "user" && role !== "rider") {
        throw new AppError("Invalid role", 400);
    }

    await authRepository.updatePendingUserRole(email, role);

    return null;
}


    // 3. Hash password

    const hashedPassword =
        await bcrypt.hash(password, 10);


    // 4. Save user temporarily in pending_users

    await authRepository.createPendingUser(
        name,
        email,
        hashedPassword,
        role
    );



    return null;
};


// ====================================================
// Login User
// ====================================================

export const loginUser = async (credentials) => {

    const { email, password } = credentials;


    // 1. Find user

    const user =
        await authRepository.findUserByEmail(email);

    if (!user) {
        throw new AppError(
            "Invalid email or password",
            401
        );
    }


    // 2. Compare password

    const isMatch =
        await bcrypt.compare(
            password,
            user.password
        );


        
console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
        throw new AppError(
            "Invalid email or password",
            401
        );
    }


    // 3. Generate JWT

    const token = jwt.sign(
        {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        },

        process.env.JWT_SECRET,

        {
            expiresIn: "1d"
        }
    );


    // 4. Remove password from response

    delete user.password;


    // 5. Return user + token

    return {
        user,
        token
    };
};


// ====================================================
// Send OTP
// ====================================================

export const sendOtp = async ({ email }) => {


    // 1. Check recent OTP

    const recentOtp =
        await authRepository.findRecentOtp(email);

    if (recentOtp) {
        throw new AppError(
            "Please wait 30 seconds before requesting a new OTP.",
            429
        );
    }


    // 2. Delete old registration OTP

    await authRepository.deleteOtp(
        email,
        "registration"
    );


    // 3. Generate new OTP

    const otp = generateOtp();


    // 4. Save OTP

    await authRepository.saveOtp(
        email,
        otp,
        "registration"
    );


    // 5. Send OTP through email

    await sendEmail(
        email,
        otp
    );


    return null;
};


// ====================================================
// Verify Registration OTP
// ====================================================

export const verifyOtp = async ({ email, otp }) => {


    // 1. Check OTP exists

    const otpData =
        await authRepository.findOtp(
            email,
            otp,
            "registration"
        );

    if (!otpData) {
        throw new AppError(
            "Invalid OTP",
            400
        );
    }


    // 2. Check OTP expiry

    const validOtp =
        await authRepository.findValidOtp(
            email,
            otp,
            "registration"
        );

    if (!validOtp) {
        throw new AppError(
            "OTP Expired",
            400
        );
    }


    // 3. Find pending user

    const pendingUser =
        await authRepository.findPendingUserByEmail(email);

    if (!pendingUser) {
        throw new AppError(
            "Pending user not found",
            404
        );
    }


    // 4. Get database connection

    const connection =
        await authRepository.getConnection();


    try {

        // 5. Start transaction

        await connection.beginTransaction();


        // 6. Move pending user → users

        await authRepository.createUserFromPending(
            connection,
            pendingUser
        );

        console.log("USER CREATED FROM PENDING:", pendingUser.email);


        // 7. Delete pending user

        await authRepository.deletePendingUser(
            connection,
            email
        );


        // 8. Delete verified OTP

        await authRepository.deleteOtpByEmail(
            connection,
            email,
            "registration"
        );


        // 9. Commit transaction

        await connection.commit();
console.log("TRANSACTION COMMITTED:", email);

        return null;


    } catch (error) {

        // 10. Rollback if anything fails
                 console.error("VERIFY OTP TRANSACTION ERROR:", error);

        await connection.rollback();

        throw error;


    } finally {

        // 11. Release database connection



        connection.release();

    }
};


// ====================================================
// Forgot Password
// ====================================================

export const forgotPassword = async ({ email }) => {


    // 1. Find user

    const user =
        await authRepository.findUserByEmail(email);

    if (!user) {
        throw new AppError(
            "User not found",
            404
        );
    }


    // 2. Delete previous reset OTP

    await authRepository.deleteOtp(
        email,
        "reset-password"
    );


    // 3. Generate reset OTP

    const otp = generateOtp();


    // 4. Save reset OTP

    await authRepository.saveOtp(
        email,
        otp,
        "reset-password"
    );


    // 5. Send reset OTP

    await sendEmail(
        email,
        otp
    );


    return null;
};




// ====================================================
// Verify Reset OTP
// ====================================================

export const verifyResetOtp = async ({ email, otp }) => {

    // 1. Check reset OTP exists

    const otpData =
        await authRepository.findOtp(
            email,
            otp,
            "reset-password"
        );

    if (!otpData) {
        throw new AppError(
            "Invalid OTP",
            400
        );
    }


    // 2. Check reset OTP expiry

    const validOtp =
        await authRepository.findValidOtp(
            email,
            otp,
            "reset-password"
        );

    if (!validOtp) {
        throw new AppError(
            "OTP Expired",
            400
        );
    }


    // 3. Find user

    const user =
        await authRepository.findUserByEmail(email);

    if (!user) {
        throw new AppError(
            "User not found",
            404
        );
    }


    // 4. Generate short-lived reset token

    const resetToken = jwt.sign(
        {
            id: user.id,
            email: user.email,
            purpose: "password-reset"
        },

        process.env.JWT_SECRET,

        {
            expiresIn: "10m"
        }
    );


    // 5. Delete OTP after successful verification

    await authRepository.deleteOtp(
        email,
        "reset-password"
    );


    // 6. Return reset token

    return {
        resetToken
    };
};


// ====================================================
// Reset Password
// ====================================================

export const resetPassword = async ({
    userId,
    password
}) => {

    const user = await authRepository.findUserById(userId);

    if (!user) {
        throw new AppError(
            "User not found",
            404
        );
    }

    const hashedPassword = await bcrypt.hash(
        password,
        10
    );

    await authRepository.updateUserPassword(
        userId,
        hashedPassword
    );

    return null;
};


// ====================================================
// Get Current User
// ====================================================

export const getCurrentUser = async (userId) => {

    const user = await authRepository.findUserById(userId);

    if (!user) {
        throw new AppError(
            "User not found",
            404
        );
    }

    delete user.password;

    return user;
};

