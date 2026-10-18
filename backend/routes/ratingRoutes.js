import express from "express";
import authenticate from "../middlewares/authenticate.js";
import {
    createRating,
    getRatingsByUser
} from "../controllers/ratingController.js";
import { ratingValidation } from "../validations/ratingValidation.js";
import validateRequest from "../middlewares/validateRequest.js";

const router = express.Router();

router.post(
    "/",
    authenticate,
    ratingValidation,
    validateRequest,
    createRating
);

router.get(
    "/user/:id",
    getRatingsByUser
);

export default router;