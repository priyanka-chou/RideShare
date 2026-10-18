
import * as messageService from "../services/messageService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";

export const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, message } = req.body;

  const result = await messageService.sendMessage(
    req.user.id,
    receiverId,
    message
  );

  return successResponse(
    res,
    201,
    "Message sent successfully",
    result
  );
});

export const getConversation = asyncHandler(async (req, res) => {
  const messages = await messageService.getConversation(
    req.user.id,
    req.params.userId
  );

  return successResponse(
    res,
    200,
    "Conversation fetched successfully",
    messages
  );
});


export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await messageService.getAllUsers(req.user.id);

    return successResponse(
        res,
        200,
        "Users fetched successfully",
        users
    );
});
