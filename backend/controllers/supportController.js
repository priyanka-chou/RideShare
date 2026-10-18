
import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";
import * as supportRepository from "../repositories/supportRepository.js";

const allowedCategories = [
    "Booking",
    "Ride",
    "Account",
    "Payment",
    "Safety",
    "Other",
];

export const createSupportRequest = asyncHandler(
    async (req, res) => {
        const { category, subject, message } = req.body;

        if (
            !allowedCategories.includes(category) ||
            typeof subject !== "string" ||
            typeof message !== "string" ||
            !subject.trim() ||
            !message.trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please provide a valid category, subject, and message.",
            });
        }

        if (subject.trim().length > 150) {
            return res.status(400).json({
                success: false,
                message: "Subject cannot exceed 150 characters.",
            });
        }

        if (message.trim().length > 5000) {
            return res.status(400).json({
                success: false,
                message: "Message cannot exceed 5000 characters.",
            });
        }

        const requestId =
            await supportRepository.createSupportRequest({
                userId: req.user.id,
                category,
                subject: subject.trim(),
                message: message.trim(),
            });

        return successResponse(
            res,
            201,
            "Support request submitted successfully.",
            { id: requestId, status: "Open" }
        );
    }
);

export const getMySupportRequests = asyncHandler(
    async (req, res) => {
        const requests =
            await supportRepository.getSupportRequestsByUser(
                req.user.id
            );

        return successResponse(
            res,
            200,
            "Support requests fetched successfully.",
            requests
        );
    }
);

export const getMySupportRequestById = asyncHandler(
    async (req, res) => {
        const request =
            await supportRepository.getSupportRequestById(
                req.params.id,
                req.user.id
            );

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Support request not found.",
            });
        }

        return successResponse(
            res,
            200,
            "Support request fetched successfully.",
            request
        );
    }
);
