import express from "express";
import {
    createBooking,
    cancelBooking,
    getUserBookings,
    getBookingById
} from "../controllers/bookingController.js";
import { bookingValidation } from "../validations/bookingValidation.js";
import validateRequest from "../middlewares/validateRequest.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

router.post(
    "/",
    authenticate,
    bookingValidation,
    validateRequest,
    createBooking
);

router.delete(
    "/:id",
    authenticate,
    cancelBooking
);

router.get(
    "/",
    authenticate,
    getUserBookings
);


router.get(
    "/:id",
    authenticate,
    getBookingById
);

export default router;