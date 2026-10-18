import {body} from "express-validator";

export const bookingValidation = [

    body("rideId")
      .notEmpty()
      .withMessage("Ride Id is required")
      .isInt({min:1})
      .withMessage(" Ride ID must be a number")
    
    ];