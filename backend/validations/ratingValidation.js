import { body } from "express-validator";

export const ratingValidation = [
    body("rideId")
        .notEmpty()
        .withMessage("Ride ID is required")
        .isInt({ min: 1 })
        .withMessage("Ride ID must be a valid number"),

    body("rating")
        .notEmpty()
        .withMessage("Rating is required")
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating must be between 1 and 5"),

    body("review")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Review cannot exceed 500 characters")
];