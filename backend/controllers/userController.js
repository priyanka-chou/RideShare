
import * as userRepository from "../repositories/userRepository.js";
import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await userRepository.getAllUsers(req.user.id);

    return successResponse(
        res,
        200,
        "Users fetched successfully",
        users
    );
});
