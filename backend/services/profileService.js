import * as profileRepository from "../repositories/profileRepository.js";
import * as authRepository from "../repositories/authRepository.js";
import AppError from "../error/AppError.js";


// ===============================
// GET USER PROFILE
// ===============================
export const getUserProfile = async (userId) => {

    const user = await profileRepository.getUserProfile(userId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    return user;
};


// ===============================
// UPDATE USER PROFILE
// ===============================
export const updateUserProfile = async (
    userId,
    name,
    email,
    bio,
    course,
    university,
    phone,
    year
) => {

    const user = await profileRepository.getUserProfile(userId);

    if (!user) {
        throw new AppError("User not found", 404);
    }


    // Check whether email is already used
    if (email !== user.email) {

        const existingUser =
            await authRepository.findUserByEmail(email);

        if (existingUser) {
            throw new AppError(
                "Email is already in use",
                409
            );
        }
    }


    // Update profile
    await profileRepository.updateUserProfile(
        userId,
        name,
        email,
        bio,
        course,
        university,
        phone,
        year
    );


return {
    userId,
    name,
    email,
    bio,
    course,
    university,
    phone,
    year
};

};


// ===============================
// GET PUBLIC PROFILE (kisi bhi user ki, email/phone ke bina)
// ===============================
export const getPublicProfile = async (userId) => {

    if (!userId || !Number.isInteger(Number(userId))) {
        throw new AppError("Valid user ID is required", 400);
    }

    const user = await profileRepository.getPublicProfile(Number(userId));

    if (!user) {
        throw new AppError("User not found", 404);
    }

    return user;
};