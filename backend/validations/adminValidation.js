import { param, body } from "express-validator";

export const userIdValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("User ID must be a valid number")
];

export const rideIdValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Ride ID must be a valid number")
];

export const updateRideStatusValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Ride ID must be a valid number"),

    body("status")
        .isIn([
            "upcoming",
            "ongoing",
            "completed",
            "cancelled"
        ])
        .withMessage("Invalid ride status")
];