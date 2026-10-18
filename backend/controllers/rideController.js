import * as rideService from "../services/rideService.js";

import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";


// ===============================
// CREATE RIDE
// ===============================
export const createRide = asyncHandler(async (req, res) => {

    const result = await rideService.createRide(
        req.body,
        req.user.id
    );

    return successResponse(
        res,
        201,
        "Ride created successfully",
        result
    );
});


// ===============================
// GET ALL RIDES
// ===============================
export const getAllRides = asyncHandler(async (req, res) => {

    const filters = {
        from: req.query.from,
        to: req.query.to,
        date: req.query.date,
        page : req.query.page
    };

    const rides = await rideService.getAllRides(
        filters,
        req.user.id
    );

    return successResponse(
        res,
        200,
        "Rides fetched successfully",
        rides
    );
});


// ===============================
// GET RIDE BY ID
// ===============================
export const getRideById = asyncHandler(async (req, res) => {

    const ride = await rideService.getRideById(
        req.params.id,
        req.user.id
    );

    return successResponse(
        res,
        200,
        "Ride fetched successfully",
        ride
    );
});


// ===============================
// UPDATE RIDE
// ===============================
export const updateRide = asyncHandler(async (req, res) => {

    const result = await rideService.updateRide(
        req.params.id,
        req.body,
        req.user.id
    );

    return successResponse(
        res,
        200,
        "Ride updated successfully",
        result
    );
});


// ===============================
// CANCEL RIDE
// ===============================
export const cancelRide = asyncHandler(async (req, res) => {

    const result = await rideService.cancelRide(
        req.params.id,
        req.user.id
    );

    return successResponse(
        res,
        200,
        "Ride cancelled successfully",
        result
    );
});


// ===============================
// COMPLETE RIDE
// ===============================
export const completeRide = asyncHandler(async (req, res) => {

    const result = await rideService.completeRide(
        req.params.id,
        req.user.id
    );

    return successResponse(
        res,
        200,
        "Ride marked as completed",
        result
    );
});


// ===============================
// GET MY RIDES
// ===============================
export const getMyRides = asyncHandler(async (req, res) => {
    const rides = await rideService.getMyRides(req.user.id);

    return successResponse(
        res,
        200,
        "My rides fetched successfully",
        rides
    );
});


//1. req.params.id

// Ye URL se ride ki ID leta hai.

// Humara route hoga:

// router.put("/:id/cancel", authMiddleware, cancelRide);

// Agar Postman mein request:

// PUT /api/rides/5/cancel




//2 . req.user.id

// Ye logged-in user ki ID hai.

// Ye JWT token se aati hai.

// Hamare authMiddleware mein:

// const decoded = jwt.verify(
//     token,
//     process.env.JWT_SECRET
// );

// req.user = decoded;

// JWT ke andar humne login ke time user ki information rakhi thi:

// {
//     id: 1,
//     name: "Tuser",
//     email: "...",
//     role: "rider"
// }