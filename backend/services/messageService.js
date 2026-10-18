
// import * as messageRepository from "../repositories/messageRepository.js";
// import * as userRepository from "../repositories/userRepository.js";
// import AppError from "../error/AppError.js";
// import * as userService from "./userService.js";

// export const getAllUsers = async (currentUserId) => {
//     return await userService.getAllUsers(currentUserId);
// };

// export const sendMessage = async (senderId, receiverId, message) => {
//   if (!receiverId || !Number.isInteger(Number(receiverId))) {
//     throw new AppError("Valid receiver ID is required", 400);
//   }

//   if (!message || !message.trim()) {
//     throw new AppError("Message cannot be empty", 400);
//   }

//   if (message.trim().length > 5000) {
//     throw new AppError("Message is too long", 400);
//   }

//   if (Number(senderId) === Number(receiverId)) {
//     throw new AppError("You cannot message yourself", 400);
//   }

//   const receiver = await userRepository.findUserById(receiverId);

//   if (!receiver) {
//     throw new AppError("Receiver not found", 404);
//   }

//   return await messageRepository.createMessage(
//     senderId,
//     Number(receiverId),
//     message.trim()
//   );
// };

// export const getConversation = async (userId, otherUserId) => {
//   if (!otherUserId || !Number.isInteger(Number(otherUserId))) {
//     throw new AppError("Valid user ID is required", 400);
//   }

//   if (Number(userId) === Number(otherUserId)) {
//     throw new AppError("Invalid conversation", 400);
//   }

//   const otherUser = await userRepository.findUserById(otherUserId);

//   if (!otherUser) {
//     throw new AppError("User not found", 404);
//   }

//   return await messageRepository.getConversation(
//     userId,
//     Number(otherUserId)
//   );
// };



import * as messageRepository from "../repositories/messageRepository.js";
import * as userRepository from "../repositories/userRepository.js";
import AppError from "../error/AppError.js";
import * as userService from "./userService.js";

export const getAllUsers = async (currentUserId) => {
    return await userService.getAllUsers(currentUserId);
};

export const sendMessage = async (senderId, receiverId, message) => {
  if (!receiverId || !Number.isInteger(Number(receiverId))) {
    throw new AppError("Valid receiver ID is required", 400);
  }

  if (!message || !message.trim()) {
    throw new AppError("Message cannot be empty", 400);
  }

  if (message.trim().length > 5000) {
    throw new AppError("Message is too long", 400);
  }

  // NOTE: sender == receiver allowed hai (self-chat / "My Notes" feature)

  const receiver = await userRepository.findUserById(receiverId);

  if (!receiver) {
    throw new AppError("Receiver not found", 404);
  }

  return await messageRepository.createMessage(
    senderId,
    Number(receiverId),
    message.trim()
  );
};

export const getConversation = async (userId, otherUserId) => {
  if (!otherUserId || !Number.isInteger(Number(otherUserId))) {
    throw new AppError("Valid user ID is required", 400);
  }

  // NOTE: userId == otherUserId allowed hai (self-chat / "My Notes" feature)

  const otherUser = await userRepository.findUserById(otherUserId);

  if (!otherUser) {
    throw new AppError("User not found", 404);
  }

  return await messageRepository.getConversation(
    userId,
    Number(otherUserId)
  );
};