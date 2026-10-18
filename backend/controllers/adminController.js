import * as adminService from "../services/adminService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";

export const getAllUsers = asyncHandler(async (req, res) => {

    const users = await adminService.getAllUsers();

    return successResponse(
        res,
        200,
        "Users fetched successfully",
        users
    );
});


export const getAllRides = asyncHandler(async (req, res) => {
    const rides = await adminService.getAllRides();

    return successResponse(
        res,
        200,
        "Rides fetched successfully",
        rides
    );
});


export const getAllBookings = asyncHandler(async (req, res) => {
    const bookings = await adminService.getAllBookings();

    return successResponse(
        res,
        200,
        "Bookings fetched successfully",
        bookings
    );
});

export const getDashboardStats = asyncHandler(async (req, res) => {
    const stats = await adminService.getDashboardStats();

    return successResponse(
        res,
        200,
        "Dashboard statistics fetched successfully",
        stats
    );
});

export const deleteUser = asyncHandler(async (req, res) => {
    const result = await adminService.deleteUser(
        req.params.id,
        req.user.id
    );

    return successResponse(
        res,
        200,
        "User deleted successfully",
        result
    );
});


export const updateRideStatus = asyncHandler(async (req, res) => {
    const result = await adminService.updateRideStatus(
        req.params.id,
        req.body.status
    );

    return successResponse(
        res,
        200,
        "Ride status updated successfully",
        result
    );
});