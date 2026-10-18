import * as ratingService from "../services/ratingService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";

export const createRating = asyncHandler(async (req, res) => {

    const result = await ratingService.createRating(
        req.body.rideId,
        req.user.id,
        req.body.rating,
        req.body.review
    );

    return successResponse(
        res,
        201,
        "Rating submitted successfully",
        result
    );
});


export const getRatingsByUser = asyncHandler(async (req, res) => {

    const ratings = await ratingService.getRatingsByUser(
        req.params.id
    );

    return successResponse(
        res,
        200,
        "Ratings fetched successfully",
        ratings
    );
});