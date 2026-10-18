import * as profileService from "../services/profileService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";
import cloudinary from "../config/cloudinary.js";
import * as profileRepository from "../repositories/profileRepository.js";

export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await profileService.getUserProfile(req.user.id);

    return successResponse(
        res,
        200,
        "Profile fetched successfully",
        user
    );
});

export const updateUserProfile = asyncHandler(async (req, res) => {
    const result = await profileService.updateUserProfile(
        req.user.id,
        req.body.name,
        req.body.email,
        req.body.bio,
        req.body.course,
        req.body.university,
        req.body.phone,
        req.body.year
    );

    return successResponse(
        res,
        200,
        "Profile updated successfully",
        result
    );
});

export const uploadProfileImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No image received. Check upload.single('image').",
        });
    }

    const { type } = req.body;

    if (!["profile", "cover"].includes(type)) {
        return res.status(400).json({
            success: false,
            message: "Invalid image type. Use profile or cover.",
        });
    }

    const imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "rideshare",
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    return reject(error);
                }

                if (!result?.secure_url) {
                    return reject(
                        new Error("Cloudinary did not return an image URL")
                    );
                }

                resolve(result.secure_url);
            }
        );

        stream.end(req.file.buffer);
    });

    const affectedRows = await profileRepository.updateUserImage(
        req.user.id,
        type,
        imageUrl
    );

    // DB me save nahi hua to success mat bhejo
    if (!affectedRows) {
        return res.status(500).json({
            success: false,
            message: "Image uploaded but could not be saved to the database.",
        });
    }

    return successResponse(
        res,
        200,
        "Image uploaded and saved successfully",
        { type, imageUrl }
    );
});


export const getPublicProfile = asyncHandler(async (req, res) => {
    const user = await profileService.getPublicProfile(req.params.id);

    return successResponse(
        res,
        200,
        "Profile fetched successfully",
        user
    );
});