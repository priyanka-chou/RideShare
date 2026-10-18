
import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";
import * as settingsRepository from "../repositories/settingsRepository.js";

export const getNotificationSettings = asyncHandler(
    async (req, res) => {
        const preference =
            await settingsRepository.getNotificationPreference(
                req.user.id
            );

        if (!preference) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return successResponse(
            res,
            200,
            "Notification settings fetched successfully",
            {
                notificationsEnabled:
                    Boolean(preference.notifications_enabled),
            }
        );
    }
);

export const updateNotificationSettings = asyncHandler(
    async (req, res) => {
        const { enabled } = req.body;

        if (typeof enabled !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "enabled must be true or false",
            });
        }

        // Verify that the user exists.
        const preference =
            await settingsRepository.getNotificationPreference(
                req.user.id
            );

        if (!preference) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        await settingsRepository.updateNotificationPreference(
            req.user.id,
            enabled
        );

        return successResponse(
            res,
            200,
            "Notification settings updated successfully",
            {
                notificationsEnabled: enabled,
            }
        );
    }
);
