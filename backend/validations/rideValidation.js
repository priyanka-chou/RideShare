import { body } from "express-validator";


// ===============================
// CREATE RIDE VALIDATION
// ===============================
export const createRideValidation = [

    body("fromLocation")
        .trim()
        .notEmpty()
        .withMessage("From location is required"),


    body("toLocation")
        .trim()
        .notEmpty()
        .withMessage("To location is required"),


    
body("rideDate")
    .notEmpty()
    .withMessage("Ride date is required")
    .isISO8601()
    .withMessage("Invalid ride date")
    .custom((value) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const selectedDate = new Date(value);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            throw new Error("Ride date cannot be in the past");
        }

        return true;
    }),



    body("rideTime")
        .notEmpty()
        .withMessage("Ride time is required"),


    body("totalSeats")
        .notEmpty()
        .withMessage("Total seats are required")
        .isInt({ min: 1 })
        .withMessage("Total seats must be at least 1"),


    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isFloat({ min: 0 })
        .withMessage("Price cannot be negative"),


     // Ride preferences
    body("acAvailable")
        .optional()
        .isBoolean()
        .withMessage("AC preference must be true or false"),

    body("music")
        .optional()
        .isBoolean()
        .withMessage("Music preference must be true or false"),

    body("noSmoking")
        .optional()
        .isBoolean()
        .withMessage("No Smoking preference must be true or false"),

    body("petsAllowed")
        .optional()
        .isBoolean()
        .withMessage("Pets preference must be true or false"),

    body("stopoversAllowed")
        .optional()
        .isBoolean()
        .withMessage("Stopovers preference must be true or false"),

    body("additionalNotes")
        .optional()
        .isString()
        .withMessage("Additional notes must be text")
        .isLength({ max: 500 })
        .withMessage("Additional notes cannot exceed 500 characters")   
];


// ===============================
// UPDATE RIDE VALIDATION
// ===============================
export const updateRideValidation = [

    body("fromLocation")
        .trim()
        .notEmpty()
        .withMessage("From location is required"),


    body("toLocation")
        .trim()
        .notEmpty()
        .withMessage("To location is required"),


    
body("rideDate")
    .notEmpty()
    .withMessage("Ride date is required")
    .isISO8601()
    .withMessage("Invalid ride date")
    .custom((value) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const selectedDate = new Date(value);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            throw new Error("Ride date cannot be in the past");
        }

        return true;
    }),


    body("rideTime")
        .notEmpty()
        .withMessage("Ride time is required"),


    body("totalSeats")
        .notEmpty()
        .withMessage("Total seats are required")
        .isInt({ min: 1 })
        .withMessage("Total seats must be at least 1"),


    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isFloat({ min: 0 })
        .withMessage("Price cannot be negative")


        
];