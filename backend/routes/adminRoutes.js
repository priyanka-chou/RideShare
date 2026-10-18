import express from "express";

import authenticate from "../middlewares/authenticate.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

import {
    deleteUser,
    getAllBookings,
    getAllUsers,
    getAllRides,
    getDashboardStats,
    updateRideStatus
} from "../controllers/adminController.js";

import {
    userIdValidation,
    updateRideStatusValidation
} from "../validations/adminValidation.js";

import validateRequest from "../middlewares/validateRequest.js";

const router = express.Router();

router.get(
    "/users",
    authenticate,
    adminMiddleware,
    getAllUsers
);

router.get(
    "/rides",
    authenticate,
    adminMiddleware,
    getAllRides
);

router.get(
    "/bookings",
    authenticate,
    adminMiddleware,
    getAllBookings
);

router.get(
    "/dashboard",
    authenticate,
    adminMiddleware,
    getDashboardStats
);

router.delete(
    "/users/:id",
    authenticate,
    adminMiddleware,
    userIdValidation,
    validateRequest,
    deleteUser
);

router.put(
    "/rides/:id/status",
    authenticate,
    adminMiddleware,
    updateRideStatusValidation,
    validateRequest,
    updateRideStatus
);

export default router;