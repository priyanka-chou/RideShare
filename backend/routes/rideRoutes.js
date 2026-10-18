import express from "express";

import authenticate from "../middlewares/authenticate.js";
import riderMiddleware from "../middlewares/riderMiddleware.js";
import validateRequest from "../middlewares/validateRequest.js";

import {
    createRideValidation,
    updateRideValidation
} from "../validations/rideValidation.js";

import {
    createRide,
    getAllRides,
    getMyRides,
    getRideById,
    updateRide,
    cancelRide,
    completeRide
} from "../controllers/rideController.js";

const router = express.Router();


router.post(
    "/",
    authenticate,
    riderMiddleware,
    createRideValidation,
    validateRequest,
    createRide
);

router.get(
    "/",
    authenticate,
    getAllRides
);

router.get(
    "/my-rides",
    authenticate,
    riderMiddleware,
    getMyRides
);


router.get(
    "/:id",
    authenticate,
    getRideById
);


router.put(
    "/:id",
    authenticate,
    riderMiddleware,
    updateRideValidation,
    validateRequest,
    updateRide
);



router.put(
    "/:id/cancel",
    authenticate,
    riderMiddleware,
    cancelRide
);


router.put(
    "/:id/complete",
    authenticate,
    riderMiddleware,
    completeRide
);


export default router;