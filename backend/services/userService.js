
import * as userRepository from "../repositories/userRepository.js";

export const getAllUsers = async (currentUserId) => {
    return await userRepository.getAllUsersExceptMe(currentUserId);
};
