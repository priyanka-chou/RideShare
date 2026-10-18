import * as bookingService from "../services/bookingService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";

export const createBooking = asyncHandler(async (req, res) => {

    const result = await bookingService.createBooking(
        req.body.rideId,
        req.user.id
    );

    return successResponse(
        res,
        201,
        "Ride booked successfully",
        result
    );
});

export const cancelBooking = asyncHandler(async (req, res) => {

    const result = await bookingService.cancelBooking(
        req.params.id,
        req.user.id
    );

    return successResponse(
        res,
        200,
        "Booking cancelled successfully",
        result
    );
});



export const getUserBookings = asyncHandler(async (req, res) => {

    const bookings = await bookingService.getUserBookings(
        req.user.id
    );

    return successResponse(
        res,
        200,
        "Bookings fetched successfully",
        bookings
    );
});



export const getBookingById = asyncHandler(async (req, res) => {

    const booking = await bookingService.getBookingById(
        req.params.id,
        req.user.id
    );

    return successResponse(
        res,
        200,
        "Booking fetched successfully",
        booking
    );
});